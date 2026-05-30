import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import StoreLogo from '../components/StoreLogo.jsx'

export default function BeheerHomePage() {
  const { activeManager, isManagerIngelogd, managerLogout } = useStore()
  const navigate = useNavigate()
  const store = activeManager ? getStore(activeManager.storeId) : null

  if (!isManagerIngelogd || !store) return <Navigate to="/beheer/login" replace />

  function uitloggen() {
    managerLogout()
    navigate('/beheer/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-violet-600 to-violet-500 px-6 py-12">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StoreLogo store={store} sizeClass="h-11 w-11" emojiClass="text-xl" />
            <div>
              <h1 className="text-xl font-bold text-white">Winkelbeheer</h1>
              <p className="text-sm text-violet-100">{store.naam}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={uitloggen}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25"
          >
            Uitloggen
          </button>
        </header>

        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Wat wil je doen?</h2>

          <div className="space-y-3">
            <Link
              to="/beheer/plattegrond"
              className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 transition hover:border-violet-300 hover:bg-violet-100"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl">
                🗺️
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">Plattegrond bewerken</p>
                <p className="text-sm text-slate-500">
                  Maak of pas de plattegrond van je winkel aan.
                </p>
              </div>
              <span className="ml-auto text-violet-400">→</span>
            </Link>

            <Link
              to="/beheer/connecties"
              className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 transition hover:border-violet-300 hover:bg-violet-100"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl">
                🔌
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">Connecties</p>
                <p className="text-sm text-slate-500">
                  Koppel andere systemen via custom API's.
                </p>
              </div>
              <span className="ml-auto text-violet-400">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
