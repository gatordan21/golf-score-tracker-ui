import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/golfers', label: 'Golfers' },
  { to: '/courses', label: 'Courses' },
  { to: '/rounds', label: 'Rounds' },
  { to: '/stats', label: 'Stats' },
]

export function NavBar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center gap-1">
          <span className="mr-4 font-semibold text-foreground">⛳ Golf Tracker</span>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
