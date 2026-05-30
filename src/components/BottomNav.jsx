import { NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const tabs = [
  { to: '/', label: 'Home', icon: 'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9' },
  { to: '/kaart', label: 'Winkels', icon: 'M4 4h16l1 5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0L4 4ZM5 11v9h14v-9' },
  { to: '/lijst', label: 'Boodschappen', icon: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01' },
  { to: '/wallet', label: 'Wallet', icon: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm14 4h.01M3 9h18' },
  { to: '/personeel', label: 'Personeel', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 11h-6' },
  { to: '/meer', label: 'Meer', icon: 'M5 12h.01M12 12h.01M19 12h.01' },
]

export default function BottomNav() {
  const { cartCount, isGekwalificeerdeBediende } = useStore()
  const zichtbareTabs = tabs.filter((t) => t.to !== '/personeel' || isGekwalificeerdeBediende)

  return (
    <nav className="fixed bottom-0 left-1/2 z-[1000] w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white">
      <div className="flex items-stretch justify-around px-2 py-2">
        {zichtbareTabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 text-[10px] font-medium transition ${
                isActive ? 'text-violet-600' : 'text-slate-400'
              }`
            }
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
            {t.label === 'Boodschappen' && cartCount > 0 && (
              <span className="absolute right-3 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
