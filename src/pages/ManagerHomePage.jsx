import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import ManagerHeader from '../components/ManagerHeader.jsx'

const TILES = [
  {
    to: '/manage/floorplan',
    emoji: '🗺️',
    title: 'Edit floor plan',
    text: "Create or update your store's floor plan.",
  },
  {
    to: '/manage/catalog',
    emoji: '📦',
    title: 'Catalog',
    text: 'View products with live stock for your store.',
  },
  {
    to: '/manage/connections',
    emoji: '🔌',
    title: 'Connections',
    text: 'Connect other systems via custom APIs.',
  },
]

export default function ManagerHomePage() {
  const { activeManager, isManagerLoggedIn } = useStore()
  const store = activeManager ? getStore(activeManager.storeId) : null

  if (!isManagerLoggedIn || !store) return <Navigate to="/manage/login" replace />

  return (
    <div className="min-h-screen bg-[#f6f4fc]">
      <ManagerHeader store={store} title="Store management" subtitle={store.name} />

      <main className="mx-auto max-w-md px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">What would you like to do?</h2>

        <div className="space-y-3">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-2xl">
                {t.emoji}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">{t.title}</p>
                <p className="text-sm text-slate-500">{t.text}</p>
              </div>
              <span className="ml-auto text-brand-400">→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
