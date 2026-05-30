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
    <div className="flex min-h-screen flex-col bg-surface px-6 py-12">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StoreLogo store={store} sizeClass="h-11 w-11" emojiClass="text-xl" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Winkelbeheer</h1>
              <p className="text-sm text-slate-500">{store.naam}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={uitloggen}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
          >
            Uitloggen
          </button>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Wat wil je doen?</h2>

          <div className="space-y-3">
            <Link
              to="/beheer/plattegrond"
              className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:border-brand-300 hover:bg-brand-100"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-2xl">
                🗺️
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">Plattegrond bewerken</p>
                <p className="text-sm text-slate-500">
                  Maak of pas de plattegrond van je winkel aan.
                </p>
              </div>
              <span className="ml-auto text-brand-400">→</span>
            </Link>

            <Link
              to="/beheer/connecties"
              className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:border-brand-300 hover:bg-brand-100"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-2xl">
                🔌
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">Connecties</p>
                <p className="text-sm text-slate-500">
                  Koppel andere systemen via custom API's.
                </p>
              </div>
              <span className="ml-auto text-brand-400">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
