import { NavLink } from 'react-router-dom'
import { Home, Search, LayoutGrid, Star, Users, ChevronDown } from 'lucide-react'

export default function Navbar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 z-50 flex w-[180px] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)]">
      {/* Logo */}
      <div className="px-4 pt-4 pb-2">
        <img src="/logo-light-mode-1000x270.webp" alt="Gebeya Dala" className="h-8 w-auto" />
      </div>

      {/* Workspace */}
      <button className="mx-3 mt-2 mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-[var(--color-bg-hover)] transition-colors">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-accent)] text-[10px] font-bold text-white">
          M
        </div>
        <span className="flex-1 truncate text-[12px] font-medium text-[var(--color-text-primary)]">
          Martin's Studio
        </span>
        <ChevronDown className="h-3 w-3 text-[var(--color-text-muted)]" />
      </button>

      {/* Main nav */}
      <nav className="flex-1 px-3">
        <div className="space-y-0.5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] ${
                isActive
                  ? 'active'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] ${
                isActive
                  ? 'active'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
            <span>Search</span>
          </NavLink>
        </div>

        {/* Projects section */}
        <div className="mt-6">
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Projects
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/library"
              end
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] ${
                  isActive
                    ? 'active'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
              <span>All projects</span>
            </NavLink>
            <button className="sidebar-link flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <Star className="h-4 w-4" strokeWidth={1.5} />
              <span>Starred</span>
            </button>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] ${
                  isActive
                    ? 'active'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              <Users className="h-4 w-4" strokeWidth={1.5} />
              <span>Shared with me</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  )
}
