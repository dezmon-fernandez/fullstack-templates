# Vertical Slice Architecture — Angular

## Decision Framework: What Goes Where

```
New code to write?
│
├─ Exists before any features?
│  (config, logging, auth, HTTP interceptors)
│  └─→ core/
│
├─ Used by 3+ features AND identical logic?
│  (base components, shared pipes, common models)
│  └─→ shared/
│
├─ Feature-specific?
│  (business logic, page components, feature services)
│  └─→ Feature slice (app/{feature}/)
│
└─ Used by 1-2 features?
   └─→ Duplicate in each feature. Wait for the third.
```

## Core — Universal Infrastructure

`core/` contains services and configuration that exist **before** features. Everything here is `providedIn: 'root'` singleton.

```
app/core/
├── config.service.ts        # Runtime configuration
├── auth.service.ts          # Authentication state
├── http-error.interceptor.ts # Global HTTP error handling
└── logging.service.ts       # Structured logging
```

**Decision rule:** If removing every feature slice would still require this code, it belongs in `core/`.

## Shared — The Three-Feature Rule

Code moves to `shared/` when **three or more** feature slices use it with identical logic.

```
app/shared/
├── components/              # Reusable presentational components
├── pipes/                   # Shared pipes
├── directives/              # Shared directives
├── models/                  # Common interfaces, types, Zod schemas
└── utils/                   # Generic utilities
```

**Process:**
1. First feature: write it inline
2. Second feature: duplicate it (add `// TODO: extract to shared if used a third time`)
3. Third feature: extract to `shared/` and refactor all three to use it

**Why three?** One instance is feature-specific. Two might be coincidence. Three is a proven pattern worth abstracting.

## Feature Slice — Self-Contained Domains

Each feature slice owns everything needed to understand and modify that feature.

```
app/feature-name/
├── feature-name.component.ts       # Smart/page component
├── feature-name.component.html     # Template
├── feature-name.component.spec.ts  # Component tests
├── feature-name.service.ts         # Business logic
├── feature-name.service.spec.ts    # Service tests
├── feature-name.routes.ts          # Lazy-loaded routes
├── feature-name.model.ts           # Interfaces + Zod schemas
└── components/                     # Presentational child components
    ├── feature-detail/
    └── feature-list/
```

**Flow:** Route → Component → Service → (HTTP/Store) → Component renders

**Rules:**
- Every feature slice MUST have its own routes file for lazy loading
- Smart components inject services. Presentational components use `input()`/`output()`.
- Business logic MUST live in the service, not the component
- Zod schemas and TypeScript interfaces for the feature MUST live in `feature-name.model.ts`

## Cross-Feature Communication

Features can import each other's services directly — especially for data fetching. If Feature A needs data from Feature B, inject Feature B's service.

```typescript
// search/search.service.ts
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly mapService = inject(MapViewService);

  searchLocations(query: string): Observable<Location[]> {
    return this.mapService.getLocations(query);
  }
}
```

Use shared services only for cross-cutting state that belongs to no single feature (e.g., UI selection state, global notifications).

## Adding a New Feature — Checklist

1. Create `app/{feature-name}/` directory
2. Create `feature-name.model.ts` — define interfaces and Zod schemas
3. Create `feature-name.service.ts` — business logic with `inject()` dependencies
4. Create `feature-name.component.ts` — smart component wired to service
5. Create `feature-name.routes.ts` — lazy-loaded route config
6. Register route in `app.routes.ts`
7. Add tests for service and component
8. Run `npm test` and `npm run lint` — MUST pass before done
