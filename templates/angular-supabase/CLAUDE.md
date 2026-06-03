# Angular 21 + Supabase Template

This file provides guidance to Claude Code when working with Angular 21 + Supabase projects.

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Angular | 21.x |
| **Language** | TypeScript | 5.8 (strict) |
| **Package Manager** | pnpm | 10.x |
| **Styling** | Tailwind CSS | 4.x |
| **Forms** | Angular Reactive Forms + Zod | Built-in + 3.24.x |
| **Backend** | Supabase | 2.97.x |
| **Linting** | Biome | 2.x |
| **Testing** | Vitest + Testing Library | Built-in + 17.x |

## Architecture: Vertical Slices

Read `.agents/documentation/vertical-slice-architecture.md` before creating or modifying any feature code.

```
src/app/
├── shared/      # Reusable code — NO business logic, extracted only after 3+ features use it
├── layouts/     # Layout components (shell, auth layout)
├── features/    # Self-contained vertical slices — each owns its components/, services/, models/, guards/, [feature].routes.ts
```

**Import rules:** Routes lazy-load feature routes. Features import from `shared/`.
Features can import each other's services directly for data access. `shared/` NEVER imports from features.

**Page responsibility:** Routes are THIN — they lazy-load feature components, not
implement logic. Components fetch data via services and signals. Types live in
feature `models/`, not in components.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:4200)
pnpm build            # Production build
ng generate component features/[name]/components/[name]  # Scaffold component

# Code Quality
pnpm lint             # Biome check (TS/JS only, not templates)
pnpm format           # Biome format

# Testing
pnpm test             # Run tests (watch)
pnpm test:run         # Run once (CI)

# Supabase
supabase start        # Local Supabase
supabase db reset     # Reset with migrations
supabase gen types typescript --local > src/app/shared/types/database.types.ts
```

## Angular Patterns

### Standalone Components (Default)

All components are standalone. No NgModules.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [],  // Import other components, directives, pipes here
  template: `<h1>Example</h1>`,
})
export class ExampleComponent {}
```

### Signals (Primary State Model)

Use signals for all component state. Angular 21 is zoneless — signals drive change detection.

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ double() }}</p>
    <button (click)="increment()">+1</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}
```

### Signal Inputs and Outputs

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="rounded-lg border p-4">
      <h2>{{ title() }}</h2>
      <button (click)="closed.emit()">Close</button>
    </div>
  `,
})
export class CardComponent {
  title = input.required<string>();
  subtitle = input('');  // Optional with default
  closed = output();
}
```

### httpResource for Reactive Data Fetching

Use `httpResource` for GET requests that react to signal changes. Use `HttpClient` for mutations.

```typescript
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    @if (users.isLoading()) {
      <p>Loading...</p>
    }
    @if (users.value(); as data) {
      @for (user of data; track user.id) {
        <div>{{ user.name }}</div>
      }
    }
    @if (users.error()) {
      <p>Error loading users</p>
    }
  `,
})
export class UserListComponent {
  filter = signal('');

  users = httpResource<User[]>(() => ({
    url: '/api/users',
    params: { filter: this.filter() },
  }));
}
```

### Dependency Injection with inject()

Use the `inject()` function, not constructor injection.

```typescript
import { Component, inject } from '@angular/core';
import { SupabaseService } from '@app/shared/services/supabase.service';

@Component({ /* ... */ })
export class MyComponent {
  private readonly supabase = inject(SupabaseService);
}
```

### Control Flow

```typescript
// @if / @else
@if (user(); as u) {
  <p>Welcome, {{ u.name }}</p>
} @else {
  <p>Please log in</p>
}

// @for with required track
@for (item of items(); track item.id) {
  <app-item-card [item]="item" />
} @empty {
  <p>No items found</p>
}

// @switch
@switch (status()) {
  @case ('loading') { <app-spinner /> }
  @case ('error') { <app-error /> }
  @default { <app-content /> }
}
```

### Forms — Signal Forms

This template uses **Signal Forms** (`@angular/forms/signals`) as its only forms
paradigm. Reactive Forms (`FormGroup`/`FormBuilder`/`formControlName`) is not used —
don't add `ReactiveFormsModule`.

**On-demand reference:** before building or modifying a form (binding with `[formField]`,
schema validation, cross-field rules, custom value controls, splitting a form across
components, load/reset), invoke the `angular-forms` skill. The one principle that frames
everything: your `signal<Model>` is the single source of truth, `form()` wraps it, and a
control is a *view* of a field — never the owner of its value or validity.

```typescript
import { Component, computed, signal } from '@angular/core';
import { form, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
});
interface CreateItemModel { title: string; description: string; }

@Component({
  selector: 'app-item-form',
  standalone: true,
  template: `
    <form (submit)="$event.preventDefault(); onSubmit()">
      <input [formField]="form.title" placeholder="Title" />
      @if (form.title().touched() && form.title().invalid()) {
        <p>{{ form.title().errors()[0].message }}</p>
      }
      <textarea [formField]="form.description"></textarea>
      <button type="submit" [disabled]="!canSubmit()">Save</button>
    </form>
  `,
})
export class ItemFormComponent {
  private readonly model = signal<CreateItemModel>({ title: '', description: '' });
  protected readonly form = form(this.model, (p) => validateStandardSchema(p, createItemSchema));
  protected readonly canSubmit = computed(() => this.form().valid() && this.form().dirty());

  protected onSubmit() {
    if (!this.form().valid()) return;
    // this.model() is the validated value
  }
}
```

### Functional Route Guards

```typescript
import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@app/shared/services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  const { data, error } = await supabase.client.auth.getUser();

  if (error || !data.user) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

### Lazy Loading Features

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },
];

// features/dashboard/dashboard.routes.ts
export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
];
```

## Supabase Patterns

### Service Usage

```typescript
import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '@app/shared/services/supabase.service';

@Component({ /* ... */ })
export class ItemsComponent {
  private readonly supabase = inject(SupabaseService);
  items = signal<Item[]>([]);

  async loadItems() {
    const { data, error } = await this.supabase.client
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    this.items.set(data);
  }
}
```

### Auth — Always Use getUser()

```typescript
// CORRECT — verifies with Supabase Auth server
const { data, error } = await supabase.client.auth.getUser();

// WRONG — reads from local JWT, can be stale/tampered
const { data } = await supabase.client.auth.getSession();
```

### RLS Gotchas

- RLS returns **empty array**, not an error, when access is denied
- Always enable RLS on new tables
- Index all columns used in RLS policies
- Test with different user roles

## Code Patterns

### TypeScript
```typescript
// No `any` — use `unknown` if type is truly unknown
// Explicit return types for public methods
// Use z.infer<typeof schema> for types from Zod
// Use `inject()` — never constructor injection
```

### Component Structure
```typescript
@Component({
  selector: 'app-[name]',
  standalone: true,
  imports: [/* dependencies */],
  template: `...`,      // Inline for small templates
  templateUrl: './...',  // External for large templates
})
export class NameComponent {
  // 1. Injected services
  private readonly service = inject(MyService);

  // 2. Inputs and outputs
  title = input.required<string>();
  saved = output<Item>();

  // 3. State signals
  items = signal<Item[]>([]);
  loading = signal(false);

  // 4. Computed signals
  count = computed(() => this.items().length);

  // 5. Methods
  async loadItems() { /* ... */ }
}
```

## Testing

**On-demand reference:** For test strategy (mocking, async/signal timing, Material
harness escapes, contract-vs-construction judgment), invoke the `angular-testing`
skill. The fluent scoped-query test harness lives at `src/testing/test-harness.ts`
(`createTestHarness(fixture.debugElement)`).

### Per-Phase Testing

| Phase | Run Tests? | Command |
|-------|------------|---------|
| Services | **YES** | `ng test --include='**/services/**'` |
| Components | **YES** | `ng test --include='**/components/**'` |
| Guards | **YES** | `ng test --include='**/guards/**'` |
| Routes | Verify | `pnpm build` |

### TestBed Pattern

```typescript
import { TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();
  });

  it('should render', () => {
    const fixture = TestBed.createComponent(MyComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('expected text');
  });
});
```

### Testing Library Usage

```typescript
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './my.component';

it('should handle click', async () => {
  const user = userEvent.setup();
  await render(MyComponent, {
    inputs: { title: 'Test' },
  });

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeTruthy();
});
```

## Common Gotchas

### Zoneless (Angular 21 Default)
- Angular 21 is zoneless by default — no Zone.js
- Change detection is driven by signals, `async` pipe, and `markForCheck()`
- Use signals for all component state — direct property mutation won't trigger updates
- Third-party libraries that depend on Zone.js patching (e.g., some RxJS-heavy libs) may need `provideZoneChangeDetection()` added back

### httpResource
- `httpResource` is for **reads only** — it auto-refetches when input signals change
- For mutations (POST, PUT, DELETE), use `HttpClient` directly
- Do not call `httpResource` inside lifecycle hooks — declare at class level

### Signals
- Use `.set()` or `.update()` — never mutate signal values directly
- `computed()` is read-only and lazy — it only recalculates when read and a dependency changed
- `effect()` runs in an injection context by default — use `inject()` inside effects

### Biome
- Biome does **not** lint Angular HTML templates
- Template errors are caught by Angular's strict template compiler
- Biome handles TS/JS formatting and linting only

### Supabase
- RLS returns empty array, not error, when access is denied
- Run `supabase gen types` after EVERY migration
- Always use `getUser()` not `getSession()` for auth verification

### Environment Variables
- Angular uses `environment.ts` files, **not** `.env`
- `setup.sh` writes development values to `environment.development.ts`
- `angular.json` handles file replacement between dev/prod

### Tailwind v4
- No `tailwind.config.js` — use `@theme` in CSS for customization
- PostCSS handles compilation via `.postcssrc.json`

## Planning Workflow

AI-assisted dev artifacts live in `.agents/` (self-contained workspace). See `.agents/README.md` for layout.

**Product (source of truth)**: `/create-prd` → writes `.agents/PRD.md`. Required first step in a fresh repo; the PRD is authoritative for all subsequent plans.

**Feature**: `/generate-plan "<feature description>"` → writes `.agents/plans/<feature>.md` aligned to the PRD

**Execute**: `/execute-plan .agents/plans/<feature>.md`

**Commit**: `/commit` — atomic conventional commit with AI-context tracking

## UX Best Practices
- **Simple component trees** — Prefer flat, readable structures over deep nesting
- **Make aesthetic choices** — Colors, transitions, and typography should feel intentional, not stock
- **Consistent spacing** — Use Tailwind spacing scale consistently (p-4, gap-4, etc.)
- **Loading states** — Show skeletons for async content, disable buttons during submission
- **Error states** — Display inline errors near the problem, not just toasts
- **Mobile first** — Start with mobile layout, add responsive breakpoints as needed
- **Accessible by default** — Use semantic HTML, proper labels, keyboard navigation

## Code Philosophy

- **Don't over-engineer** — Solve the current problem, not hypothetical future ones
- **No premature abstractions** — Duplicate code is fine until a pattern emerges 3+ times
- **Minimal indirection** — Prefer inline logic over layers of helpers and utilities
- **Delete aggressively** — Remove unused code, don't comment it out "just in case"

## Environment Variables

Angular uses `environment.ts` files, not `.env`. Values are compile-time, not runtime.

| Variable | File | Description |
|----------|------|-------------|
| `supabaseUrl` | `src/environments/environment.ts` | Supabase API URL |
| `supabaseKey` | `src/environments/environment.ts` | Supabase anon/public key |
| `production` | `src/environments/environment.ts` | Production flag |
