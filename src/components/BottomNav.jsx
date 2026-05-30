import { NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

// Minimale klant-navigatie: de home (winkelkeuze + lijst) is het centrale scherm.
const tabs = [
  { to: '/', label: 'Home', icon: 'M3 9.5 12 3l9 6.5M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9' },
  {
    to: '/mandje',
    label: 'Mandje',
    badge: true,
    icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H5.1',
  },
  { to: '/profiel', label: 'Profiel', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
]

export default function BottomNav() {
  const { productCount } = useStore()
  const zichtbareTabs = tabs

  return (
    <nav className="fixed bottom-0 left-1/2 z-[1000] w-full max-w-md -translate-x-1/2 border-t border-slate-200/70 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="flex items-stretch justify-around px-2 py-1.5">
        {zichtbareTabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition ${
                isActive ? 'text-brand-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                    isActive ? 'bg-brand-100' : 'bg-transparent'
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                </span>
                {t.badge && productCount > 0 && (
                  <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {productCount}
                  </span>
                )}
                {t.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
