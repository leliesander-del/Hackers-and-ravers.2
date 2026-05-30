import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import PageHeader from '../components/PageHeader.jsx'
import StoreLogo from '../components/StoreLogo.jsx'

export default function ListPage() {
  const { cart, removeFromCart } = useStore()

  // Groepeer het mandje per winkel zodat "toon route" per winkel kan.
  const perWinkel = {}
  for (const p of cart) {
    ;(perWinkel[p.storeId] ||= []).push(p)
  }

  return (
    <div>
      <PageHeader title="Boodschappen" subtitle={`${cart.length} ${cart.length === 1 ? 'product' : 'producten'} in je mandje`} />

      <div className="space-y-5 px-4 py-4">
        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-4xl">📝</p>
            <p className="mt-3 text-slate-500">Je boodschappenlijst is leeg. Voeg producten toe in een winkel.</p>
            <Link to="/kaart" className="mt-4 inline-block rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white">
              Bekijk winkels
            </Link>
          </div>
        ) : (
          Object.entries(perWinkel).map(([storeId, lijst]) => {
            const store = getStore(storeId)
            return (
              <section key={storeId}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-semibold text-slate-700">
                    <StoreLogo store={store} sizeClass="h-7 w-7" emojiClass="text-sm" />
                    {store.naam}
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
                        onClick={() => removeFromCart(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500"
                        aria-label="Verwijderen"
                      >
                        ✕
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
