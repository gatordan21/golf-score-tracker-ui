import type { ReactNode } from 'react'

interface RouteGuardProps {
  children: ReactNode
  isAuthenticated?: boolean
}

// Stub: always passes through. Wire isAuthenticated to a real auth check when ready.
export function RouteGuard({ children, isAuthenticated = true }: RouteGuardProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Sign in required</h2>
        <p className="text-sm text-muted-foreground">
          You need to be signed in to view this page.
        </p>
      </div>
    )
  }
  return <>{children}</>
}
