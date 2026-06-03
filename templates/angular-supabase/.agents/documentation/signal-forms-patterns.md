# Signal Forms — Practices

How we build edit forms with `@angular/forms/signals`. One principle frames all of
it: **your `signal<Model>` is the single source of truth; `form()` wraps it and
exposes every field's state as signals; validation lives in the schema; a control is
a *view* of a field, never the owner of its value or validity.**

---

## 1. Wire a form over a model signal

The whole shape in one place — model signal, schema, binding, error display, submit
gate. Keep validation in one place: a Zod schema via `validateStandardSchema`.

```ts
interface LoginModel { email: string; password: string; }

private readonly model = signal<LoginModel>({ email: '', password: '' });
protected readonly form = form(this.model, (p) => validateStandardSchema(p, LoginSchema));
protected readonly canSubmit = computed(() => this.form().valid() && this.form().dirty());
```
```html
<form (submit)="$event.preventDefault(); onSubmit()">
  <input [formField]="form.email" />
  @if (form.email().touched() && form.email().invalid()) {
    <p>{{ form.email().errors()[0].message }}</p>
  }
  <button type="submit" [disabled]="!canSubmit()">Sign in</button>
</form>
```

Bind the field *node* (`form.email`), not its called state (`form.email()`). To load
or revert, `model.set(values)` then `form().reset()` — `set()` doesn't dirty, and
`reset()` clears touched/dirty *without* reverting the value (it is not a value reset).

---

## 2. Validate in the schema, not in a control

Declare validation by field path. Validity then aggregates up the tree for free —
`form().valid()` folds over every descendant — and the rules live in one place. A
control is a view: it produces a value (a bad parse yields `NaN`) and the schema
judges it, so even "is it a number" stays in the schema.

```ts
const EditSchema = z.object({ name: z.string().min(1), priority: z.number().int().min(0).max(100) });
form(this.model, (p) => validateStandardSchema(p, EditSchema));
```

The built-in validators (`required`/`min`/`max`/`pattern`) are the exception worth
knowing: alongside validating, they set field metadata that reflects to native input
attributes (`required`, `min`, …) — accessibility a schema can't provide. Reach for
them for that reflection, and for `disabled`/`hidden`/async; keep value rules in the
schema.

---

## 3. Split a form across components by the coupling axis

The axis a component couples to predicts where it's reusable. Default to threading the
field tree into slice-local children that bind leaf controls.

| Pattern | The component… | Coupled to | Reusable |
|---|---|---|---|
| **Be a control** | implements `FormValueControl<T>`, bound by `[formField]` | a **type** (`T`) | anywhere that type appears |
| **Thread the tree** | takes `FieldTree<Model>` as input, binds `[formField]="form().x"` | a form **shape** | that slice only |
| **Control + inner form** | implements `FormValueControl<Object>`, builds its own `form()` | a **type** (object) | reusable, validated as a unit |

```ts
// Thread-the-tree container: knows the shape; the leaves know only their type.
public readonly form = input.required<FieldTree<EditModel>>();
```
```html
<input [formField]="form().name" />                <!-- native input -->
<app-editable-field [formField]="form().code" />   <!-- a "be a control" leaf -->
```

Graduate to control-with-inner-form only when a multi-field group is reused *and*
validated as a unit — and then bridge its validity up explicitly
(`validateStandardSchema(p.address, AddressSchema)`), because an inner form's validity
does not auto-merge into the parent.

---

## 4. Custom controls for non-native values

When a field's displayed form differs from its model type — a percent or currency
string, a custom date format — build a control that **formats with `linkedSignal` and
writes the parsed value back on blur**. The control produces a value (a bad parse
yields `NaN`); it never validates — the schema judges the value, parseability included.
(For a plain `number`/`Date`, skip all this and bind `<input type="number">`.)

```ts
import { linkedSignal, model } from '@angular/core';

export class PercentInputComponent implements FormValueControl<number> {
  public readonly value = model.required<number>();                     // the whole contract
  protected readonly display = linkedSignal(() => `${this.value()}%`);  // model → view
  protected updateModel(): void {                                       // view → model, on blur
    this.value.set(Number(this.display().replace('%', '').trim()));     // NaN if unparseable
  }
}
```
```html
<input [value]="display()" (input)="display.set(asString($event))" (blur)="updateModel()" />
```

`value = model<T>()` is the only required member — `[formField]` two-way-binds it and
syncs whatever optional state inputs (`dirty`, `required`, …) the control declares.
For array fields, iterate `form.aliases` to render rows and use `applyEach(p.aliases,
(a) => required(a))` for per-item rules.

---

## 5. Cross-field rules: `validate` + `valueOf`, not the schema

Read another field with `valueOf(path)` inside a logic function, and put the
`validate()` on the field that should show the error.

```ts
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

Note `value()` is a signal (parens) but `valueOf(p.x)` returns the value directly (no
parens) — the easy mixup.

---

## Note on stability

These symbols are experimental and the API has already moved once (the binding
selector was renamed). The **typings define what exists; the official guide defines
the recommended pattern** — and they can diverge (`transformedValue` exists, but the
guide teaches `linkedSignal`). Check both: the typings for the signature, the guide
for whether to reach for it. Pinning the current surface is the planning phase's job;
this file is for the patterns that outlast a given version.
