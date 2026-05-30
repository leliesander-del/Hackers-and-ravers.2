import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import PageHeader from '../components/PageHeader.jsx'

// Het mandje toont enkel de concrete producten die je in een winkel hebt
// aangeklikt. De winkel-onafhankelijke boodschappenlijst (ingrediënten) staat
// op het Lijst-tabblad.
export default function MandjePage() {
  const { cart, getProductLive, removeFromCart } = useStore()

  const producten = cart
    .filter((it) => it.kind === 'product')
    .map((it) => getProductLive(it.key))
    .filter(Boolean)

  const totaal = producten.reduce((som, p) => som + p.prijs, 0)

  return (
    <div>
      <PageHeader
        title="Mandje"
        subtitle={`${producten.length} ${producten.length === 1 ? 'product' : 'producten'}`}
      />

      <div className="space-y-4 px-4 py-4">
        {producten.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-5xl">🛍️</p>
            <p className="mt-3 text-slate-500">Je mandje is nog leeg.</p>
            <p className="mt-1 text-xs text-slate-400">
              Tik op een product in een winkel om het hier toe te voegen.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
            >
              Naar je lijst
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {producten.map((p) => {
                const store = getStore(p.storeId)
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                      🛒
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">{p.naam}</p>
                      <p className="truncate text-xs text-slate-500">
                        {[p.merk, store?.naam, p.schaplocatie?.label].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold text-slate-700">€ {p.prijs.toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(p.id)}
                      aria-label="Verwijderen"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <span className="text-slate-500">Totaal</span>
              <span className="text-xl font-bold text-violet-700">€ {totaal.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
