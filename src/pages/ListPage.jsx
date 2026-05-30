import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import PageHeader from '../components/PageHeader.jsx'

export default function ListPage() {
  const { activeProfile, inCart, addToCart, getProductLive } = useStore()
  const items = activeProfile.boodschappenlijst.map(getProductLive).filter(Boolean)

  // Groepeer per winkel zodat "toon route" per winkel kan.
  const perWinkel = {}
  for (const p of items) {
    ;(perWinkel[p.storeId] ||= []).push(p)
  }

  return (
    <div>
      <PageHeader title="Boodschappen" subtitle={activeProfile.type === 'gast' ? 'Gast' : activeProfile.naam} />

      <div className="space-y-5 px-4 py-4">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-4xl">📝</p>
            <p className="mt-3 text-slate-500">
              {activeProfile.type === 'gast'
                ? 'Als gast heb je geen opgeslagen lijst. Log in met een klantenkaart.'
                : 'Je lijst is leeg.'}
            </p>
            {activeProfile.type === 'gast' && (
              <Link to="/meer" className="mt-4 inline-block rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white">
                Wissel profiel
              </Link>
            )}
          </div>
        ) : (
          Object.entries(perWinkel).map(([storeId, lijst]) => {
            const store = getStore(storeId)
            return (
              <section key={storeId}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-700">
                    {store.emoji} {store.naam}
                  </h2>
                  {store.heeftPlattegrond && (
                    <Link to={`/store/${storeId}`} className="text-xs font-medium text-violet-600">
                      Toon route →
                    </Link>
                  )}
                </div>
                <div className="space-y-2">
                  {lijst.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">🛒</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{p.naam}</p>
                        <p className="text-xs text-slate-500">
                          {p.merk} · {p.schaplocatie?.label} · € {p.prijs.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(p.id)}
                        disabled={inCart(p.id)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                          inCart(p.id) ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-600'
                        }`}
                      >
                        {inCart(p.id) ? '✓' : '+'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}
