import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getPersoneelWinkelId } from '../lib/staffAccess.js'
import { getStore } from '../data/stores.js'

const PERSONEEL_TABS = [
  { to: '/personeel', label: 'Rekkenvuller', end: true },
  { to: '/personeel/kassa', label: 'Kassamedewerker', end: true },
]

// Volledig gescheiden layout voor winkelpersoneel. Geen klant-onderbalk,
// een eigen (groene) personeelskop. Klanten komen hier nooit binnen.
export default function StaffShell() {
  const { isIngelogd, isGekwalificeerdeBediende, activeProfile, logout } = useStore()
  const navigate = useNavigate()
  const winkel = getStore(getPersoneelWinkelId(activeProfile))

  if (!isIngelogd) return <Navigate to="/personeel/login" replace />
  // Een ingelogde klant hoort niet in het personeelsgedeelte.
  if (!isGekwalificeerdeBediende) return <Navigate to="/" replace />

  function uitloggen() {
    logout()
    navigate('/personeel/login')
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-slate-50 pb-10 shadow-[0_0_60px_rgba(76,29,149,0.1)] ring-1 ring-black/5">
      <header className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg">🏪</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Personeel</p>
            <p className="text-[11px] text-white/70">
              {activeProfile?.naam}
              {winkel ? ` · ${winkel.naam}` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={uitloggen}
          className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium transition hover:bg-white/25"
        >
          Uitloggen
        </button>
      </header>
      <nav className="flex gap-1 border-b border-slate-200 bg-white px-4">
        {PERSONEEL_TABS.map((t) => (
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
