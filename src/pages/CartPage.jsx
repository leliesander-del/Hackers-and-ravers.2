import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { productsByStore } from '../data/products.js'
import PageHeader from '../components/PageHeader.jsx'
import StoreLogo from '../components/StoreLogo.jsx'
import Floorplan from '../components/Floorplan.jsx'

export default function CartPage() {
  const { cart, cartTotaal, removeFromCart, clearCart } = useStore()
  const [openMap, setOpenMap] = useState(null) // storeId waarvan de route open staat

  // Groepeer het mandje per winkel, zodat we per winkel een route kunnen tonen.
  const perWinkel = useMemo(() => {
    const m = new Map()
    for (const p of cart) {
      if (!m.has(p.storeId)) m.set(p.storeId, [])
      m.get(p.storeId).push(p)
    }
    return [...m.entries()]
  }, [cart])

  return (
    <div>
      <PageHeader title="Boodschappen" subtitle={`${cart.length} ${cart.length === 1 ? 'product' : 'producten'} in je mandje`} />

      <div className="space-y-5 px-4 py-4">
        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-4xl">🛍️</p>
            <p className="mt-3 text-slate-500">Je mandje is nog leeg.</p>
            <Link to="/" className="mt-4 inline-block rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white">
              Ontdek winkels
            </Link>
          </div>
        ) : (
          <>
            {perWinkel.map(([storeId, lijst]) => {
              const store = getStore(storeId)
              const mapOpen = openMap === storeId
              return (
                <section key={storeId} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StoreLogo store={store} sizeClass="h-8 w-8" emojiClass="text-base" />
                    <h2 className="flex-1 font-semibold text-slate-700">{store?.naam}</h2>
                  </div>

                  <div className="space-y-2">
                    {lijst.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">🛒</span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{p.naam}</p>
                          <p className="text-xs text-slate-500">
                            {p.merk} · {p.schaplocatie?.label}
                          </p>
                        </div>
                        <span className="font-semibold text-slate-700">€ {p.prijs.toFixed(2)}</span>
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

                  {store?.heeftPlattegrond && (
                    <>
                      <button
                        onClick={() => setOpenMap(mapOpen ? null : storeId)}
                        className="w-full rounded-full bg-violet-100 py-2.5 text-sm font-semibold text-violet-700"
                      >
                        {mapOpen ? 'Verberg route' : `🗺️ Toon route op map (${lijst.length} stops)`}
                      </button>
                      {mapOpen && (
                        <div>
                          <p className="mb-2 text-xs text-slate-400">
                            De snelste route langs je producten — de cijfers tonen de volgorde.
                          </p>
                          <Floorplan products={productsByStore(storeId)} routeIds={lijst.map((p) => p.id)} />
                        </div>
                      )}
                    </>
                  )}
                </section>
              )
            })}

            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <span className="text-slate-500">Totaal</span>
              <span className="text-xl font-bold text-slate-800">€ {cartTotaal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                clearCart()
                setOpenMap(null)
              }}
              className="w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-500"
            >
              Mandje leegmaken
            </button>
          </>
        )}
      </div>
    </div>
  )
}
