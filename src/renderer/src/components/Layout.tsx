import { NavLink, Outlet } from 'react-router'
import { Home, Settings } from 'lucide-react'
import TitleBar from '@/components/TitleBar'
import ToastHost from '@/components/ToastHost'

// Tambah halaman: daftarin di sini (menu) dan di router.tsx (route)
const nav = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/settings', label: 'Settings', Icon: Settings, end: false }
]

export default function Layout() {
  return (
    <div className="flex h-full flex-col">
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        <nav className="flex w-44 shrink-0 flex-col gap-1 border-r border-border bg-surface p-2">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ' +
                (isActive ? 'bg-accent text-white' : 'text-muted hover:bg-fg/10')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="min-w-0 flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>

      <ToastHost />
    </div>
  )
}
