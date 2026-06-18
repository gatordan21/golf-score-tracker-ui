# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start dev server (hot reload at http://localhost:5173)
npm run dev

# Type-check + production build
npm run build

# Lint
npm run lint

# Preview the production build
npm run preview
```

## Adding shadcn/ui Components

```bash
# Add a new component (e.g. dialog, table, select)
echo y | npx shadcn@4.9.0 add <component>
```

Use version `4.9.0` specifically — newer versions have a Windows backup-file bug that fails init/add in this environment.

## Environment

Copy `.env` and adjust if the API runs on a different port:

```
VITE_API_URL=http://127.0.0.1:8000
```

The variable is read in `src/api/client.ts` and falls back to `http://127.0.0.1:8000`.

## Architecture

### Data flow

```
pages/          ← thin route components, no fetch calls
  └─ hooks/     ← TanStack Query wrappers (useQuery / useMutation)
       └─ api/  ← raw fetch functions, pure TypeScript, no React
```

Pages never call `fetch` directly. They import custom hooks from `hooks/`, which call functions in `api/`. This keeps the API layer reusable (including for React Native later).

### Key files

| File | Role |
|---|---|
| `src/api/client.ts` | Base `apiFetch<T>` wrapper; throws `ApiError` on non-OK responses; handles 204 (no body) |
| `src/lib/utils.ts` | `cn()` (Tailwind class merge), `formatStat()` (null → "—"), `formatScoreVsPar()` (0 → "E", positive → "+N") |
| `src/lib/queryClient.ts` | Shared `QueryClient` instance imported by `App.tsx` |
| `src/App.tsx` | `QueryClientProvider` + `BrowserRouter` + all `<Route>` declarations |
| `components.json` | shadcn/ui config — controls where generated components land (`src/components/ui/`) |

### TypeScript config split

`tsconfig.json` (project references root) → `tsconfig.app.json` (browser code) + `tsconfig.node.json` (Vite config).
`erasableSyntaxOnly: true` is on — TypeScript parameter property shorthand (`public x: T` in constructors) is not allowed; declare properties explicitly.

### Styling

Tailwind v4 via `@tailwindcss/vite` plugin — no `tailwind.config.ts` file. Theme tokens and CSS variables are defined entirely in `src/index.css` (shadcn generates and owns this file). Use `cn()` from `src/lib/utils.ts` for conditional class merging.

### Forms

Forms use `react-hook-form` with `zodResolver`. Schemas live in `src/schemas/` and types are inferred with `z.infer<>`. shadcn `Select` components are not compatible with `register` — always wrap them in a `<Controller>` from react-hook-form. Use `setValueAs` on `register()` to coerce number inputs from strings.

Toast notifications use `sonner` — call `toast.error()` / `toast.success()` from the `'sonner'` package.

### Round logging flow

`/rounds/new` is a two-step wizard: Step 1 collects `RoundHeaderForm` data, Step 2 collects per-hole scores via `HoleScoreEntry`. Rounds **cannot be edited** — the UI exposes a "relog" pattern: navigate to `/rounds/new` with `location.state = { relogRound: Round }` to pre-populate the form; on successful save the original round is deleted.

### Auth

`AuthContext` and `RouteGuard` are stubs — both are hardcoded to pass through. `golferId` in context is always `null` until real auth is wired. Do not build features that depend on auth being real yet.

### Backend

This UI targets the FastAPI golf tracker at `../golf-tracker-basic-api`. All TypeScript types in `src/types/` mirror the Pydantic schemas in `schemas.py`. If the backend schema changes, update the corresponding file in `src/types/` and the matching Zod schema in `src/schemas/`.
