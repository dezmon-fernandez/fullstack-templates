---
name: angular-forms
description: TRIGGER on any form build or edit (`form()`, `[formField]`, FormValueControl, schema validation) or forms question ("how do I validate X", cross-field rules, custom value controls, load/reset, splitting a form across components). Covers Signal Forms over a model signal — the template's only forms paradigm.
---

# Angular Signal Forms

This template builds forms with **Signal Forms** (`@angular/forms/signals`). Reactive
Forms (`FormGroup`/`FormBuilder`/`formControlName`) is not used here — don't reach for
it, don't add `ReactiveFormsModule`, and migrate any you find.

## Philosophy

**Your `signal<Model>` is the single source of truth.** `form()` wraps it and exposes
every field's state as signals; validation lives in the schema; a control is a *view*
of a field, never the owner of its value or its validity.

Once that sinks in, most form questions answer themselves. Where does the value live?
The model signal. Where does "is it valid" live? The schema, aggregated up the field
tree. What is an `<input>`? A view that reads one field and writes back to it. If you
ever find yourself storing form state *beside* the model — a separate `isValid` flag, a
hand-maintained "dirty" boolean, a copy of a field's value in a component field — stop:
that state already exists on the form, and your copy will drift.

### The model owns the value; the control is a view

A control's only job is to render a field's value and write edits back. Everything
else — what's valid, what's required, what's disabled, what error to show — is derived
from the model through the schema and the field tree.

- Read value and state from the **field** (`form.email().value()`, `.touched()`,
  `.invalid()`, `.errors()`) — never from a component field you maintain in parallel.
- Put validation in the **schema**, not in the control. The control produces a value
  (a bad parse yields `NaN`); the schema judges it.
- Derived display (`canSubmit`, an error string, a formatted value) is a `computed()`
  or `linkedSignal()` *off the form*, not a stored signal you update by hand.

**Litmus test:** could you swap the input widget — native `<input>` → a custom control,
a text field → a `<select>` — without touching the schema or the model? If yes, the
control is a proper view. If the validation rules live in the widget, every swap drags
the rules along and the form fights reuse.

## Before you build a form

A short checklist worth running before each new form. Each item is here because skipping
it is the most common cause of a confusing bug later.

- **Define the model interface first**, then the schema, then the form. The model is the
  contract; the schema validates that shape; `form()` is the last line, not the first.
  Designing in this order keeps validation in one place from the start.
- **One schema is the source of validity.** Don't split rules between the schema and the
  template (`@if (value.length < 1)`) — the template should *read* `field().invalid()`,
  never recompute it. Two places to change a rule is one place too many.
- **Bind the field node, not its called state.** `[formField]="form.email"` binds the
  field; `form.email()` is its *state* and is for reading (`.touched()`, `.errors()`).
  Binding the called state is the single most common "my control doesn't update" bug.
- **Know whether `form` is a signal.** A `form()` you create locally is a field tree —
  bind `form.email`. A field tree passed in via `input.required<FieldTree<Model>>()` is
  a *signal* — call it first: bind `form().email`. Same field, different access because
  one arrived through an input.
- **Load with `model.set()`, revert with `form().reset()`.** `set()` replaces the value
  without dirtying; `reset()` clears touched/dirty *without reverting the value* (it is
  not a value reset — a common surprise). To load-then-present-clean: `model.set(values)`
  then `form().reset()`.
- **Gate submit on the form, not a flag.** `computed(() => form().valid() && form().dirty())`.
  Validity folds over every descendant for free; you never maintain it.
- **Decide the component boundary up front** (see "Splitting a form" below). Whether a
  child *is a control*, *threads the field tree*, or *wraps its own inner form* is the
  one design choice that's expensive to change later.

## The core shape

The whole thing in one place — model signal, schema-backed validation, binding, error
display, submit gate:

```ts
import { Component, computed, signal } from '@angular/core';
import { form, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
interface LoginModel { email: string; password: string; }

@Component({
  selector: 'app-login-form',
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
    if (!this.form().valid()) return;
    // this.model() is the validated value
  }
}
```

Worth knowing before you start:

- **`form.email` is the field node; `form.email()` is its state.** Bind the node, read
  the state. The state object carries `value()`, `valid()`, `invalid()`, `touched()`,
  `dirty()`, `errors()` — all signals.
- **The error gate is `touched() && invalid()`**, not `invalid()` alone — otherwise a
  pristine field screams red before the user has typed. `touched` flips on blur.
- **Validity aggregates up the tree.** `form().valid()` folds over every descendant, so
  the submit gate needs no per-field bookkeeping.
- **Submit prevents default in the template** (`$event.preventDefault()`); the handler
  re-checks `valid()` because a user can submit via Enter before blurring a field.

## Validate in the schema, not in a control

Declare validation by field path. Validity aggregates up the tree for free, and the
rules live in one place. A control is a view: it produces a value (a bad parse yields
`NaN`) and the schema judges it — so even "is it a number" stays in the schema.

```ts
const EditSchema = z.object({
  name: z.string().min(1),
  priority: z.number().int().min(0).max(100),
});
form(this.model, (p) => validateStandardSchema(p, EditSchema));
```

**The built-in validators are the one exception worth knowing.**
`required`/`min`/`max`/`pattern` from `@angular/forms/signals` do two things: they
validate *and* they set field metadata that reflects to native input attributes
(`required`, `min`, …). That reflection is accessibility a schema can't provide.

```ts
import { form, required, min, max, disabled, hidden } from '@angular/forms/signals';

form(this.model, (p) => {
  validateStandardSchema(p, EditSchema);     // value rules
  required(p.name);                          // also reflects the `required` attr
  min(p.priority, 0); max(p.priority, 100);  // also reflect min/max attrs
});
```

Rule of thumb: keep **value rules** in the schema; reach for the built-ins when you want
**native-attribute reflection**, or for `disabled`/`hidden`/async logic that a static
schema can't express.

## Cross-field rules: `validate` + `valueOf`

Read another field with `valueOf(path)` inside a logic function, and put the `validate()`
on the field that should show the error.

```ts
import { form, validate, required, disabled } from '@angular/forms/signals';

form(this.model, (p) => {
  validate(p.confirmPassword, ({ value, valueOf }) =>
    value() === valueOf(p.password)
      ? null
      : { kind: 'mismatch', message: 'Passwords must match' });
});
```

The check re-runs reactively when either field changes, and the error lands on
`confirmPassword().errors()`. The same `valueOf` drives cross-field *state*, which a
schema can't express at all:

```ts
required(p.promoCode, { when: ({ valueOf }) => valueOf(p.applyDiscount) });
disabled(p.couponCode, ({ valueOf }) => valueOf(p.total) < 50);
```

**The easy mixup:** `value()` is a signal (parens), but `valueOf(p.x)` returns the value
directly (no parens). Reach for the wrong one and you'll compare a function to a value.

## Splitting a form across components

The axis a component couples to predicts where it's reusable. Default to threading the
field tree into slice-local children that bind leaf controls — and graduate to a
reusable control only when the same shape recurs.

| Pattern | The component… | Coupled to | Reusable |
|---|---|---|---|
| **Be a control** | implements `FormValueControl<T>`, bound by `[formField]` | a **type** (`T`) | anywhere that type appears |
| **Thread the tree** | takes `FieldTree<Model>` as input, binds `[formField]="form().x"` | a form **shape** | that slice only |
| **Control + inner form** | implements `FormValueControl<Object>`, builds its own `form()` | a **type** (object) | reusable, validated as a unit |

```ts
// Thread-the-tree container: knows the shape; the leaves know only their type.
import { input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

public readonly form = input.required<FieldTree<EditModel>>();
```
```html
<!-- form is an input() signal here, so call it first: form().name -->
<input [formField]="form().name" />                <!-- native input -->
<app-editable-field [formField]="form().code" />   <!-- a "be a control" leaf -->
```

Graduate to **control-with-inner-form** only when a multi-field group is reused *and*
validated as a unit — and then bridge its validity up explicitly, because an inner
form's validity does **not** auto-merge into the parent:

```ts
form(this.model, (p) => validateStandardSchema(p.address, AddressSchema));
```

## Custom controls for non-native values

When a field's displayed form differs from its model type — a percent or currency
string, a custom date format — build a control that **formats with `linkedSignal` and
writes the parsed value back on blur**. The control produces a value (a bad parse yields
`NaN`); it never validates — the schema judges the value, parseability included.

> For a plain `number`/`Date`, skip all of this and bind `<input type="number">`. Reach
> for a custom control only when display ≠ model.

```ts
import { Component, linkedSignal, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-percent-input',
  template: `
    <input [value]="display()"
           (input)="display.set(asString($event))"
           (blur)="updateModel()" />
  `,
})
export class PercentInputComponent implements FormValueControl<number> {
  public readonly value = model.required<number>();                     // the whole contract
  protected readonly display = linkedSignal(() => `${this.value()}%`);  // model → view
  protected updateModel(): void {                                       // view → model, on blur
    this.value.set(Number(this.display().replace('%', '').trim()));     // NaN if unparseable
  }
}
```

`value = model.required<T>()` is the **only required member** — `[formField]`
two-way-binds it and syncs whatever optional state inputs (`dirty`, `required`, …) the
control declares. The model is `number`; the schema (`z.number()`) catches the `NaN`
from a bad parse, so the control never has to.

> The typings expose a `transformedValue` member for the format/parse split, but the
> official guide teaches the `linkedSignal` pattern above. Prefer the guide unless you
> have a specific reason — see "Note on stability."

## Array fields

Iterate `form.aliases` to render rows, and use `applyEach` for per-item rules:

```ts
import { form, required, applyEach } from '@angular/forms/signals';

form(this.model, (p) => applyEach(p.aliases, (a) => required(a)));
```
```html
@for (alias of form.aliases; track $index) {
  <input [formField]="alias" />
}
```

## Anti-patterns

### ❌ Binding the called state instead of the field node
```ts
// Bad: binds the FieldState, not the field — the control won't write back
<input [formField]="form.email()" />
// Good: bind the node; call it only to read state
<input [formField]="form.email" />
@if (form.email().touched() && form.email().invalid()) { … }
```

### ❌ Validating in the control or the template
```ts
// Bad: rule lives in the widget / markup; every swap drags it along
@if (form.priority().value() > 100) { <p>Too high</p> }
// Good: rule in the schema; template only reflects the verdict
// schema: priority: z.number().max(100)
@if (form.priority().touched() && form.priority().invalid()) {
  <p>{{ form.priority().errors()[0].message }}</p>
}
```

### ❌ Showing errors before the field is touched
```ts
// Bad: a pristine form is red on first paint
@if (form.email().invalid()) { … }
// Good: gate on touched
@if (form.email().touched() && form.email().invalid()) { … }
```

### ❌ `value()` vs `valueOf` mixup in cross-field logic
```ts
// Bad: valueOf returns the value directly — calling it throws / compares a value to nothing
validate(p.confirm, ({ valueOf }) => valueOf(p.password)() === … );
// Good: value() is a signal (parens); valueOf(path) is the value (no parens)
validate(p.confirm, ({ value, valueOf }) => value() === valueOf(p.password) ? null : err);
```

## When a form misbehaves

When something's off and the cause isn't obvious, work through these in order — listed by
how often each turns out to be it:

1. **Is the control bound to the field node, not the called state?**
   `[formField]="form.email"`, not `form.email()`. The #1 cause of "edits don't stick."
2. **Did you forget the `touched()` gate, or expect errors without it?** Either errors
   show on a pristine form (missing not-quite — you wanted the gate) or never show
   (the field hasn't been blurred, so `touched()` is still false).
3. **Is `form` a signal here?** If it came in via `input.required<FieldTree<…>>()`, you
   must call it: `form().email`. If you created it locally with `form()`, you don't:
   `form.email`. Mixing these up yields "x is not a function" or a field that reads undefined.
4. **Validity not aggregating from a sub-form?** An inner `form()`'s validity does not
   auto-merge into the parent — bridge it with `validateStandardSchema(p.sub, SubSchema)`.
5. **Custom control not syncing?** Confirm `value = model.required<T>()` is declared (it's
   the whole contract) and that you write back on `blur`, not on every keystroke.
6. **`reset()` "not working"?** It clears touched/dirty, not the value. Pair it with
   `model.set(values)` if you meant to revert the value too.
7. **Cross-field rule comparing wrong?** `value()` is a signal (parens); `valueOf(path)`
   is the value (no parens). The classic off-by-a-call bug.

## Note on stability

These symbols are **experimental** and the API has already moved once (the binding
selector was renamed). The **typings define what exists; the official guide defines the
recommended pattern** — and they can diverge (`transformedValue` exists, but the guide
teaches `linkedSignal`). Check both: the typings for the signature, the guide for whether
to reach for it. Pinning the exact current surface (import paths, symbol names) is the
planning phase's job; this skill is for the patterns that outlast a given version.
