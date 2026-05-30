import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStaffStoreId } from '../lib/staffAccess.js'
import { getStore } from '../data/stores.js'
import { isStaffSession } from '../lib/security.js'

const STAFF_TABS = [
  { to: '/staff', label: 'Shelf stocker', end: true },
  { to: '/staff/checkout', label: 'Cashier', end: true },
]

// Fully separate layout for store staff. No customer bottom bar,
// its own (green) staff header. Customers never end up here.
export default function StaffShell() {
  const { isLoggedIn, isQualifiedStaff, activeProfile, logout } = useStore()
  const navigate = useNavigate()
  const store = getStore(getStaffStoreId(activeProfile))

  if (!isLoggedIn || !isStaffSession()) return <Navigate to="/staff/login" replace />
  // A logged-in customer doesn't belong in the staff area.
  if (!isQualifiedStaff) return <Navigate to="/" replace />

  function handleLogout() {
    logout()
    navigate('/staff/login')
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-slate-50 pb-10 shadow-[0_0_60px_rgba(76,29,149,0.1)] ring-1 ring-black/5">
      <header className="flex items-center gap-3 bg-brand-600 px-4 py-3 text-white">
        <div className="flex flex-1 items-center">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg">🏪</span>
        </div>
        <div className="min-w-0 flex-1 text-center leading-tight">
          <p className="truncate text-sm font-semibold">Staff</p>
          <p className="truncate text-[11px] text-white/75">
            {activeProfile?.name}
            {store ? ` · ${store.name}` : ''}
          </p>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            onClick={handleLogout}
            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium transition hover:bg-white/25"
          >
            Log out
          </button>
        </div>
      </header>
      <nav className="flex gap-1 border-b border-slate-200 bg-white px-4">
        {STAFF_TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `relative py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'text-brand-700 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand-600'
                  : 'text-slate-400 hover:text-slate-600'
              } px-3`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
