import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import StoreLogo from './StoreLogo.jsx'

// Gedeelde kop voor alle winkelbeheer-schermen, zodat ze er overal hetzelfde
// uitzien: winkellogo + titel/subtitel links, navigatie + paginaknoppen
// (children) + uitloggen rechts.
export default function BeheerHeader({ store, titel, subtitel, onUitloggen, children }) {
  const { managerLogout } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // De terug-pijl alleen op subpagina's (/beheer/...), niet op de beheer-home.
  const opSubpagina = pathname !== '/beheer'

  function uitloggen() {
    if (onUitloggen) onUitloggen()
    else managerLogout()
    navigate('/beheer/login')
  }

  return (
    <header className="relative z-20 shrink-0 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <StoreLogo store={store} sizeClass="h-10 w-10" emojiClass="text-lg" />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-800">{titel}</h1>
            {subtitel != null && <p className="truncate text-sm text-slate-500">{subtitel}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {opSubpagina && (
            <Link
              to="/beheer"
              title="Terug naar beheer"
              className="rounded-lg px-3 py-2 text-base font-bold text-violet-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              ←
            </Link>
          )}
          {children}
          <button
            type="button"
            onClick={uitloggen}
            className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </header>
  )
}
