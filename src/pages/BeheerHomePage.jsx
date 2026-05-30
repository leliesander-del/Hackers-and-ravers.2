import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import BeheerHeader from '../components/BeheerHeader.jsx'

const TEGELS = [
  {
    to: '/beheer/plattegrond',
    emoji: '🗺️',
    titel: 'Plattegrond bewerken',
    tekst: 'Maak of pas de plattegrond van je winkel aan.',
  },
  {
    to: '/beheer/catalogus',
    emoji: '📦',
    titel: 'Catalogus',
    tekst: 'Bekijk producten met live voorraad van je winkel.',
  },
  {
    to: '/beheer/connecties',
    emoji: '🔌',
    titel: 'Connecties',
    tekst: "Koppel andere systemen via custom API's.",
  },
]

export default function BeheerHomePage() {
  const { activeManager, isManagerIngelogd } = useStore()
  const store = activeManager ? getStore(activeManager.storeId) : null

  if (!isManagerIngelogd || !store) return <Navigate to="/beheer/login" replace />

  return (
    <div className="min-h-screen bg-[#f6f4fc]">
      <BeheerHeader store={store} titel="Winkelbeheer" subtitel={store.naam} />

      <main className="mx-auto max-w-md px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Wat wil je doen?</h2>

        <div className="space-y-3">
          {TEGELS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl">
                {t.emoji}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">{t.titel}</p>
                <p className="text-sm text-slate-500">{t.tekst}</p>
              </div>
              <span className="ml-auto text-violet-400">→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
