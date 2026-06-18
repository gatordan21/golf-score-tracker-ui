# Golf Tracker UI

A React single-page application for tracking golf rounds, courses, golfers, and statistics. Pairs with the FastAPI backend at `../golf-tracker-basic-api`.

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 19 + TypeScript 6 |
| Build / dev server | Vite 8 |
| Routing | React Router v7 |
| Data fetching & caching | TanStack Query v5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Component library | shadcn/ui |
| Forms | react-hook-form + zod |
| Charts | Recharts |
| Toasts | Sonner |

## Setup & Installation

**Prerequisites:** Node.js, and the FastAPI backend running (see `../golf-tracker-basic-api`).

```bash
npm install
```

The `.env` file already exists with the default backend URL. Edit it if your API runs on a different port:

```
VITE_API_URL=http://127.0.0.1:8000
```

```bash
# Start dev server with hot reload
npm run dev        # http://localhost:5173

# Type-check + production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Architecture

### Data flow

```
src/pages/      ← thin route components, no fetch calls
src/hooks/      ← TanStack Query wrappers (useQuery / useMutation)
src/api/        ← raw fetch functions, pure TypeScript, no React
```

Pages import hooks; hooks call api functions; api functions call `apiFetch<T>` in `src/api/client.ts`. Nothing in `pages/` calls `fetch` directly.

### Key files

| File | Role |
|---|---|
| `src/api/client.ts` | `apiFetch<T>` base wrapper — throws `ApiError` on non-OK, handles 204 (no body) |
| `src/lib/utils.ts` | `cn()` (Tailwind class merge), `formatStat()` (null → `"—"`), `formatScoreVsPar()` (0 → `"E"`, positive → `"+N"`) |
| `src/lib/queryClient.ts` | Shared `QueryClient` instance |
| `src/App.tsx` | `QueryClientProvider` + `AuthProvider` + `BrowserRouter` + all `<Route>` declarations |
| `src/context/AuthContext.tsx` | Auth stub — always passes through, `golferId` is always `null` |
| `src/components/layout/AppShell.tsx` | Root layout: `NavBar` + `<Outlet>` inside a `max-w-6xl` container |

### Routes

| Path | Page |
|---|---|
| `/` | Home — API connection badge + summary stats |
| `/golfers` | Golfer list with create/edit/delete |
| `/golfers/:id` | Golfer detail — rounds history and per-golfer stats |
| `/courses` | Course list with create/edit/delete |
| `/courses/:id` | Course detail — hole layout editor |
| `/rounds` | Round list with filters (golfer, course, date range) |
| `/rounds/new` | Two-step round logging wizard |
| `/stats` | Stats dashboard — summary tiles, by-course table, driving accuracy chart |

### TypeScript & Zod schemas

`src/types/` holds TypeScript interfaces that mirror the FastAPI Pydantic schemas. `src/schemas/` holds Zod schemas used for form validation; types are inferred with `z.infer<>`. If the backend schema changes, update both.

### Styling

Tailwind v4 is configured via `@tailwindcss/vite` — there is no `tailwind.config.ts`. All theme tokens and CSS variables live in `src/index.css` (owned by shadcn). Use `cn()` from `src/lib/utils.ts` for conditional class merging.

## Key Behaviors & Conventions

### Forms

All forms use `react-hook-form` with `zodResolver`. shadcn `Select` components must be wrapped in a `<Controller>` — they are not compatible with `register()`. Use `setValueAs` on numeric inputs to coerce string values from the DOM.

```tsx
// Correct pattern for shadcn Select + react-hook-form
<Controller
  control={control}
  name="golfer_id"
  render={({ field }) => (
    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
      ...
    </Select>
  )}
/>
```

### Toasts

Use `toast.error()` / `toast.success()` from `'sonner'`. The `<Toaster>` is mounted in `App.tsx`.

### Round logging

`/rounds/new` is a two-step wizard: Step 1 collects round header data, Step 2 collects per-hole scores. Rounds **cannot be edited** after creation. To correct a round, use the "relog" flow: navigate to `/rounds/new` with router state `{ relogRound: Round }` — this pre-populates the form and deletes the original round on successful save.

### Auth

`AuthContext` and `RouteGuard` are stubs. `golferId` is always `null`. Do not build features that depend on real authentication yet.

### Error handling

Each route is wrapped in `<ErrorBoundary>`. API errors surface via `ApiError` (thrown by `apiFetch`) and are caught by TanStack Query, which exposes them through `isError` / `error` on query results.

## Adding shadcn/ui Components

```bash
echo y | npx shadcn@4.9.0 add <component>
```

Pin to `4.9.0` — newer versions have a Windows backup-file bug that breaks `add` in this environment.

## Project Structure

```
src/
├── api/            # Raw fetch functions (golfers, courses, rounds, stats, client)
├── components/
│   ├── auth/       # RouteGuard stub
│   ├── courses/    # CourseForm, HoleLayoutForm
│   ├── golfers/    # GolferForm
│   ├── layout/     # AppShell, NavBar
│   ├── rounds/     # RoundHeaderForm, HoleScoreEntry
│   ├── shared/     # ErrorBoundary, ErrorMessage, LoadingSpinner, EmptyState, ConfirmDialog
│   ├── stats/      # DrivingChart
│   └── ui/         # shadcn-generated components
├── context/        # AuthContext (stub)
├── hooks/          # TanStack Query wrappers
├── lib/            # utils.ts, queryClient.ts
├── pages/          # Route-level components
├── schemas/        # Zod form schemas
└── types/          # TypeScript interfaces mirroring backend schemas
```
