---
name: angular-forms
description: TRIGGER on any form build or edit (`form()`, `[formField]`, FormValueControl, schema validation) or forms question (cross-field rules, custom value controls, load/reset, splitting a form across components). Covers Signal Forms over a model signal — the template's only forms paradigm.
---

# Angular Signal Forms

This template builds forms with **Signal Forms** (`@angular/forms/signals`). Reactive
Forms (`FormGroup`/`FormBuilder`/`formControlName`) is not used — don't add
`ReactiveFormsModule`, and migrate any you find.

## Philosophy

**Your `signal<Model>` is the single source of truth.** `form()` wraps it; validation
lives in the schema; a control is a *view* of a field — never the owner of its value or
its validity. Anything derived — validity, `canSubmit`, an error string, a formatted
value — is a `computed()`/`linkedSignal()` off the form, never a signal you maintain by
hand. A parallel copy (`isValid` flag, hand-kept `dirty` boolean) drifts the moment a
field changes.

**Litmus:** could you swap the input widget — `<input>` → custom control → `<select>` —
without touching the schema or the model? If yes, the control is a proper view. If the
validation rules live in the widget, every swap drags them along and the form fights reuse.

## The core shape

Model signal, schema-backed validation, binding, error display, submit gate:

```ts
import { Component, computed, signal } from '@angular/core';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
interface LoginModel { email: string; password: string; }

@Component({
  selector: 'app-login-form',
  imports: [FormField],
  template: `
    <form (submit)="$event.preventDefault(); onSubmit()">
      <input [formField]="form.email" data-testid="email" />
      @if (form.email().touched() && form.email().invalid()) {
        <p data-testid="email-error">{{ form.email().errors()[0].message }}</p>
      }
      <input type="password" [formField]="form.password" data-testid="password" />
      <button type="submit" [disabled]="!canSubmit()" data-testid="submit">Sign in</button>
    </form>
  `,
})
export class LoginFormComponent {
  private readonly model = signal<LoginModel>({ email: '', password: '' });
  protected readonly form = form(this.model, (p) => validateStandardSchema(p, LoginSchema));
  protected readonly canSubmit = computed(() => this.form().valid() && this.form().dirty());

  protected onSubmit(): void {
    if (!this.form().valid()) return;   // re-check: Enter can submit before a field blurs
    // this.model() is the validated value
  }
}
```

`[formField]` is a directive — add `FormField` to the component's `imports`. `form.email`
is the field node — bind it. `form.email()` is its state — read it
(`value()`, `valid()`, `invalid()`, `touched()`, `dirty()`, `errors()`, all signals). The
`touched() && invalid()` gate stops a pristine field from showing errors before the user
types; `touched` flips on blur.

**Load and revert:** `model.set(values)` replaces the value without dirtying;
`form().reset()` clears touched/dirty *without reverting the value* (not a value reset).
Load-then-present-clean is `model.set(values)` then `form().reset()`.

## Validate in the schema

Validation goes in the schema, by field path — `form().valid()` then aggregates over
every descendant for free. Keep all value rules here (even "is it a number": a control
produces a value, a bad parse yields `NaN`, and the schema judges it).

```ts
const EditSchema = z.object({ name: z.string().min(1), priority: z.number().int().min(0).max(100) });
form(this.model, (p) => validateStandardSchema(p, EditSchema));
```

**The built-in validators are the one exception.** `required`/`min`/`max`/`pattern` from
`@angular/forms/signals` both validate *and* set field metadata that reflects to native
input attributes — accessibility a schema can't provide. Reach for them for that
reflection, and for `disabled`/`hidden`/async logic a static schema can't express.

```ts
import { form, required, min, max } from '@angular/forms/signals';

form(this.model, (p) => {
  validateStandardSchema(p, EditSchema);     // value rules
  required(p.name);                          // also reflects the `required` attr
  min(p.priority, 0); max(p.priority, 100);  // also reflect min/max attrs
});
```

## Cross-field rules: `validate` + `valueOf`

Read another field with `valueOf(path)` inside a logic function; put `validate()` on the
field that should show the error.

```ts
import { form, validate, required, disabled } from '@angular/forms/signals';

form(this.model, (p) => {
  validate(p.confirmPassword, ({ value, valueOf }) =>
    value() === valueOf(p.password) ? null : { kind: 'mismatch', message: 'Passwords must match' });
});
```

It re-runs reactively when either field changes, and the error lands on
`confirmPassword().errors()`. The same `valueOf` drives cross-field *state* a schema can't
express:

```ts
required(p.promoCode, { when: ({ valueOf }) => valueOf(p.applyDiscount) });
disabled(p.couponCode, ({ valueOf }) => valueOf(p.total) < 50);
```

**The easy mixup:** `value()` is a signal (parens); `valueOf(p.x)` returns the value
directly (no parens). Reach for the wrong one and you compare a function to a value.

## Splitting a form across components

The axis a component couples to predicts where it's reusable. Default to threading the
field tree into slice-local children; graduate to a reusable control only when the same
shape recurs.

| Pattern | The component… | Coupled to | Reusable |
|---|---|---|---|
| **Be a control** | implements `FormValueControl<T>`, bound by `[formField]` | a **type** (`T`) | anywhere that type appears |
| **Thread the tree** | takes `FieldTree<Model>` as input, binds `[formField]="form().x"` | a form **shape** | that slice only |
| **Control + inner form** | implements `FormValueControl<Object>`, builds its own `form()` | a **type** (object) | reusable, validated as a unit |

```ts
import { input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

public readonly form = input.required<FieldTree<EditModel>>();
```
```html
<!-- form arrived as an input() signal, so call it first: form().name -->
<input [formField]="form().name" />
<app-editable-field [formField]="form().code" />
```

Graduate to **control-with-inner-form** only when a multi-field group is reused *and*
validated as a unit — then bridge its validity up explicitly, because an inner form's
validity does **not** auto-merge into the parent:

```ts
form(this.model, (p) => validateStandardSchema(p.address, AddressSchema));
```

## Custom controls

`value = model.required<T>()` is the entire contract — `[formField]` two-way-binds it and
syncs whatever optional state inputs (`dirty`, `required`, …) the control declares. The
control produces a value and never validates; the schema judges it, parseability included.
So a control wraps any UI over any type — and falls into one of two fundamentally different
shapes, which differ in *when and how* the value gets written back.

### Display ≠ model — format/parse with `linkedSignal`

The value the user sees isn't the value you store: a percent/currency string, a masked
date. Map model→view with `linkedSignal`, and write the parsed value back **on blur**, so a
half-typed entry isn't reparsed mid-keystroke. (For a plain `number`/`Date`, don't bother —
bind `<input type="number">`.)

```ts
import { Component, linkedSignal, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-percent-input',
  template: `<input [value]="display()" (input)="display.set(asString($event))" (blur)="updateModel()" />`,
})
export class PercentInputComponent implements FormValueControl<number> {
  public readonly value = model.required<number>();                     // the whole contract
  public readonly touched = model<boolean>(false);                      // declare it or the error never shows
  protected readonly display = linkedSignal(() => `${this.value()}%`);  // model → view
  protected updateModel(): void {                                       // view → model, on blur
    this.touched.set(true);                                             // flip touched so the parent's gate fires
    this.value.set(Number(this.display().replace('%', '').trim()));     // NaN if unparseable
  }
}
```

Declare a `touched` model and set it on blur — otherwise the field never flips `touched`
and its error never shows.

### Structured value — write on each interaction

The value is a collection or object with no "half-typed" intermediate state: a chip picker,
a multi-select, a toggle group. No display mapping, no `linkedSignal`, no blur — you
`value.set(...)` immediately as the user acts.

```ts
import { Component, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-chip-input',
  template: `
    @for (chip of value(); track chip) {
      <span class="chip">{{ chip }} <button type="button" (click)="remove(chip)">×</button></span>
    }
    <input #box (keydown.enter)="add(box.value); box.value = ''" />
  `,
})
export class ChipInputComponent implements FormValueControl<string[]> {
  public readonly value = model.required<string[]>();                          // the whole contract
  public readonly touched = model<boolean>(false);                             // set it on interaction, not blur
  protected add(chip: string): void {
    if (chip) { this.touched.set(true); this.value.set([...this.value(), chip]); }
  }
  protected remove(chip: string): void {
    this.touched.set(true);
    this.value.set(this.value().filter((c) => c !== chip));
  }
}
```

Both shapes declare `value` and `touched`; `linkedSignal` and blur belong only to the
format/parse shape — here you flip `touched` on the interaction.

## Array fields

When the model has an array field — say `tags: string[]` — its field node (`form.tags`)
is iterable: loop it for one control per element, and use `applyEach` to apply a rule to
every item. (`tags` is your model's field; `form.<field>` and `applyEach` are the API.)

```ts
import { form, required, applyEach } from '@angular/forms/signals';
form(this.model, (p) => applyEach(p.tags, (t) => required(t)));
```
```html
@for (tag of form.tags; track $index) { <input [formField]="tag" /> }
```

## When a form misbehaves

Work through these in order — roughly how often each is the cause:

1. **Bound to the field node, not the called state?** `[formField]="form.email"`, not
   `form.email()`. The #1 cause of "edits don't stick."
2. **Errors never show / show too early?** The gate is `touched() && invalid()`; `touched`
   flips on blur.
3. **Is `form` a signal here?** Via `input.required<FieldTree<…>>()` you call it first
   (`form().email`); created locally you don't (`form.email`).
4. **Sub-form validity not aggregating?** An inner `form()` doesn't auto-merge — bridge it
   with `validateStandardSchema(p.sub, SubSchema)`.
5. **Custom control not syncing?** Confirm `value = model.required<T>()` is declared and
   you write back on `blur`.
6. **`reset()` "not working"?** It clears touched/dirty, not the value — pair with
   `model.set(values)` to revert the value too.

## Note on stability

These symbols are **experimental** and the API has already moved once (the binding
selector was renamed). The **typings define what exists; the official guide defines the
recommended pattern** — and they diverge (`transformedValue` exists, but the guide teaches
`linkedSignal`). Check the typings for the signature, the guide for whether to use it.
Pinning the exact surface (import paths, symbol names) is the planning phase's job.
