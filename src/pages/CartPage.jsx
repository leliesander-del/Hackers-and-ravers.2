import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import PageHeader from '../components/PageHeader.jsx'

export default function CartPage() {
  const { cart, cartTotaal, removeFromCart, clearCart } = useStore()

  return (
    <div>
      <PageHeader title="Mijn mandje" subtitle={`${cart.length} ${cart.length === 1 ? 'product' : 'producten'}`} back />

      <div className="space-y-4 px-4 py-4">
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
            <div className="space-y-2">
              {cart.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">🛒</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{p.naam}</p>
                    <p className="text-xs text-slate-500">
                      {p.merk} · {getStore(p.storeId)?.naam}
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

            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <span className="text-slate-500">Totaal</span>
              <span className="text-xl font-bold text-slate-800">€ {cartTotaal.toFixed(2)}</span>
            </div>

            <button
              onClick={clearCart}
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
