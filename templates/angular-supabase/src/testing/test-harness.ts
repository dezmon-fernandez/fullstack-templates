/**
 * Fluent Angular Test Utilities
 *
 * Each harness is scoped to its element—queries only search within that element's subtree.
 * @example
 * ```ts
 * const h = createTestHarness(fixture.debugElement);
 *
 * // Scoped queries - each harness only sees its descendants
 * const form = h.findTestId('login-form');
 * form.findTestId('email').setInputValue('a@b.com');
 * form.findTestId('submit').click();
 *
 * // Overlay is a separate scope (outside fixture tree)
 * h.getOverlayContainer().findTestId('confirm').click();
 * ```
 */

import { getDebugNode } from '@angular/core';
import { By } from '@angular/platform-browser';
import { isNil } from 'lodash-es';

import type { DebugElement, Type } from '@angular/core';
import type { MatSelect, MatSelectChange } from '@angular/material/select';

export interface TestHarness<
  C = unknown,
  E extends HTMLElement = HTMLElement
> {
  readonly componentInstance: C | null;
  readonly debugElement: DebugElement;
  readonly nativeElement: E;

  check: () => TestHarness<C, E>;
  clear: () => TestHarness<C, E>;
  click: (options?: MouseEventInit) => TestHarness<C, E>;
  dispatch: (event: Event) => TestHarness<C, E>;
  existsTestId: (testId: string) => boolean;
  existsSelector: (selector: string) => boolean;
  findDirective: <D>(directive: Type<D>) => TestHarness<D>;
  findDirectives: <D>(directive: Type<D>) => TestHarness<D>[];
  findTestId: <NC = unknown, NE extends HTMLElement = HTMLElement>(testId: string) => TestHarness<NC, NE>;
  findTestIds: <NC = unknown, NE extends HTMLElement = HTMLElement>(testId: string) => TestHarness<NC, NE>[];
  getAttribute: (name: string) => string | null;
  getOverlayContainer: () => TestHarness | null;
  getTextContent: () => string;
  getInputValue: () => string;
  hasAttribute: (attr: string, value?: string) => boolean;
  hasClass: (className: string) => boolean;
  isChecked: () => boolean;
  isDisabled: () => boolean;
  isVisible: () => boolean;
  keyDown: (key: string, options?: KeyboardEventInit) => TestHarness<C, E>;
  keyUp: (key: string, options?: KeyboardEventInit) => TestHarness<C, E>;
  keyPress: (key: string, options?: KeyboardEventInit) => TestHarness<C, E>;
  prettyPrintHtml: (maxLines?: number) => string;
  querySelector: <NC = unknown, NE extends HTMLElement = HTMLElement>(selector: string) => TestHarness<NC, NE>;
  querySelectorAll: <NC = unknown, NE extends HTMLElement = HTMLElement>(selector: string) => TestHarness<NC, NE>[];
  setInputValue: (text: string | number | null | undefined) => TestHarness<C, E>;
  uncheck: () => TestHarness<C, E>;
}

function resolveCheckableInput(nativeEl: HTMLElement): HTMLInputElement {
  if (!nativeEl.classList.contains('mat-mdc-checkbox')) {
    return nativeEl as unknown as HTMLInputElement;
  }
  const input = nativeEl.querySelector<HTMLInputElement>('input');
  if (!input) {
    throw new Error('mat-mdc-checkbox is missing its inner <input> element.');
  }
  return input;
}

function createHarness<
  C = unknown,
  E extends HTMLElement = HTMLElement
>(debugEl: DebugElement): TestHarness<C, E> {
  const nativeEl = debugEl.nativeElement as E;

  const harness: TestHarness<C, E> = {
    get componentInstance() {
      return (debugEl.componentInstance ?? null) as C | null;
    },
    get debugElement() {
      return debugEl;
    },
    get nativeElement() {
      return nativeEl;
    },

    check() {
      const input = resolveCheckableInput(nativeEl);
      if (!input.checked) {
        input.click();
      }
      return harness;
    },

    clear() {
      const input = nativeEl as unknown as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return harness;
    },

    click(options: MouseEventInit = {}) {
      nativeEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, ...options }));
      nativeEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, ...options }));
      nativeEl.click();
      return harness;
    },

    dispatch(event: Event) {
      nativeEl.dispatchEvent(event);
      return harness;
    },

    existsTestId(testId: string) {
      return debugEl.query(By.css(`[data-testid="${testId}"]`)) !== null;
    },

    existsSelector(selector: string) {
      return debugEl.query(By.css(selector)) !== null;
    },

    findTestId<NC = unknown, NE extends HTMLElement = HTMLElement>(testId: string) {
      const found = debugEl.query(By.css(`[data-testid="${testId}"]`));
      if (!found) {
        throw new Error(`[data-testid="${testId}"] not found.`);
      }
      return createHarness<NC, NE>(found);
    },

    findTestIds<NC = unknown, NE extends HTMLElement = HTMLElement>(testId: string) {
      return debugEl
        .queryAll(By.css(`[data-testid="${testId}"]`))
        .map((d) => createHarness<NC, NE>(d));
    },

    findDirective<D>(directive: Type<D>) {
      const found = debugEl.query(By.directive(directive));
      if (!found) {
        throw new Error(`Directive "${directive.name}" not found within element.`);
      }
      return createHarness<D>(found);
    },

    findDirectives<D>(directive: Type<D>) {
      return debugEl.queryAll(By.directive(directive)).map((d) => createHarness<D>(d));
    },

    getAttribute(name: string) {
      return nativeEl.getAttribute(name);
    },

    getOverlayContainer() {
      const container = document.querySelector('.cdk-overlay-container');
      if (!container) {
        return null;
      }
      const overlayDebugEl = getDebugNode(container) as DebugElement;
      if (!overlayDebugEl) {
        return null;
      }
      return createHarness(overlayDebugEl);
    },

    getTextContent: () => nativeEl.textContent?.trim() ?? '',

    getInputValue() {
      // mat-select uses a hidden input inside a div for display
      if (harness.hasClass('mat-mdc-select')) {
        return harness.querySelector('.mat-mdc-select-value-text').getTextContent();
      }

      return (nativeEl as unknown as HTMLInputElement).value;
    },

    hasAttribute(attr: string, value?: string) {
      if (isNil(value)) {
        return nativeEl.hasAttribute(attr);
      }
      return nativeEl.getAttribute(attr) === value;
    },

    hasClass: (className: string) => nativeEl.classList.contains(className),

    isChecked() {
      // mat checkbox uses classes to indicate checked state
      if (harness.hasClass('mat-mdc-checkbox')) {
        return harness.hasClass('mat-mdc-checkbox-checked');
      }

      // native checkbox or radio input
      return (nativeEl as unknown as HTMLInputElement).checked;
    },

    isDisabled() {
      return nativeEl.getAttribute('aria-disabled') === 'true'
        || nativeEl.hasAttribute('disabled')
        || nativeEl.classList.contains('mat-mdc-checkbox-disabled');
    },

    isVisible() {
      const style = getComputedStyle(nativeEl);
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && style.opacity !== '0';
    },

    keyDown(key: string, options: KeyboardEventInit = {}) {
      nativeEl.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
      return harness;
    },

    keyUp(key: string, options: KeyboardEventInit = {}) {
      nativeEl.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, ...options }));
      return harness;
    },

    keyPress(key: string, options: KeyboardEventInit = {}) {
      nativeEl.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
      nativeEl.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, ...options }));
      return harness;
    },

    prettyPrintHtml(maxLines = 40) {
      if (!nativeEl) {
        return '';
      }
      const html = nativeEl.outerHTML
        .replace(/></g, '>\n<')
        .replace(/(\S)(<\/)/g, '$1\n$2')
        .split('\n')
        .map((line, i, arr) => {
          const indent = arr.slice(0, i).reduce((depth, currentLine) => {
            const openCount = currentLine.match(/<[^/!][^>]*[^/]>?/g)?.length ?? 0;
            const closeCount = currentLine.match(/<\//g)?.length ?? 0;
            return depth + openCount - closeCount;
          }, 0);
          return `${'  '.repeat(Math.max(0, indent))}${line.trim()}`;
        });
      if (html.length > maxLines) {
        return `${html.slice(0, maxLines).join('\n')}\n...`;
      }
      return html.join('\n');
    },

    querySelector<NC = unknown, NE extends HTMLElement = HTMLElement>(selector: string) {
      const found = debugEl.query(By.css(selector));
      if (!found) {
        throw new Error(`Selector "${selector}" not found.`);
      }
      return createHarness<NC, NE>(found);
    },

    querySelectorAll<NC = unknown, NE extends HTMLElement = HTMLElement>(selector: string) {
      return debugEl
        .queryAll(By.css(selector))
        .map((d) => createHarness<NC, NE>(d));
    },

    /**
     * Sets the value of an input, textarea, or mat-select.
     *
     * For mat-select, this programmatically sets the value and emits
     * `valueChange` and `selectionChange` events.
     * @param text - Value to set
     * @returns The harness for chaining
     */
    setInputValue(text: string | number | null | undefined) {
      const value = text ?? '';
      const valueString = String(value);
      if (harness.hasClass('mat-mdc-select')) {
        // programatically set the value on the mat-select
        const select = debugEl.componentInstance as MatSelect;

        select.value = valueString;
        select.valueChange.emit(valueString);
        select.selectionChange.emit({ source: select, value: valueString } as MatSelectChange);
        return harness;
      }

      const input = nativeEl as unknown as HTMLInputElement;
      input.focus();
      input.value = valueString;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return harness;
    },

    uncheck() {
      const input = resolveCheckableInput(nativeEl);
      if (input.checked) {
        input.click();
      }
      return harness;
    }
  };

  return harness;
}

/**
 * Creates a fluent test harness scoped to a DebugElement.
 *
 * Queries only search within the element's subtree. Most methods return
 * the harness for chaining.
 * @template C - Component instance type
 * @template E - Native element type
 * @param root - The DebugElement to wrap, typically `fixture.debugElement`
 * @returns A TestHarness scoped to the provided element
 * @example
 * const harness = createTestHarness(fixture.debugElement);
 *
 * harness.findTestId('email').clear().setInputValue('a@b.com');
 * harness.findTestId('submit').click();
 *
 * expect(harness.findTestId('error').getTextContent()).toContain('Invalid');
 *
 * // For overlays (dialogs, menus, etc.)
 * harness.getOverlayContainer()?.findTestId('confirm').click();
 */
export function createTestHarness<
  C = unknown,
  E extends HTMLElement = HTMLElement
>(root: DebugElement): TestHarness<C, E> {
  return createHarness<C, E>(root);
}
