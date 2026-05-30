import { useMemo } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import PageHeader from '../components/PageHeader.jsx'

// Een product telt als "bijna op" zolang de totale voorraad hier of lager zit.
const BIJNA_OP_DREMPEL = 5

function StockBadge({ magazijn, schap }) {
  return (
    <div className="flex shrink-0 gap-1.5 text-[11px]">
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">Mag. {magazijn}</span>
      <span className={`rounded-full px-2 py-0.5 ${schap > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
        Schap {schap}
      </span>
    </div>
  )
}

function ProductRij({ product }) {
  const store = getStore(product.storeId)
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-800">{product.naam}</p>
        <p className="truncate text-xs text-slate-500">
          {product.merk} · {store?.naam} · {product.schaplocatie?.label}
        </p>
      </div>
      <StockBadge magazijn={product.magazijnVoorraad} schap={product.schapVoorraad} />
    </div>
  )
}

export default function DashboardPage() {
  const { allProductsLive } = useStore()

  const { uit, bijna } = useMemo(() => {
    const uit = []
    const bijna = []
    for (const p of allProductsLive) {
      const totaal = p.magazijnVoorraad + p.schapVoorraad
      if (totaal === 0) uit.push(p)
      else if (totaal <= BIJNA_OP_DREMPEL) bijna.push(p)
    }
    const totaalVan = (p) => p.magazijnVoorraad + p.schapVoorraad
    uit.sort((a, b) => a.naam.localeCompare(b.naam))
    bijna.sort((a, b) => totaalVan(a) - totaalVan(b))
    return { uit, bijna }
  }, [allProductsLive])

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Voorraadbewaking voor personeel" />

      <div className="space-y-5 px-4 py-4">
        {/* Samenvatting */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
            <p className="text-3xl font-bold text-rose-600">{uit.length}</p>
            <p className="text-xs font-medium text-rose-700">Uit voorraad</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
            <p className="text-3xl font-bold text-amber-600">{bijna.length}</p>
            <p className="text-xs font-medium text-amber-700">Bijna op (≤ {BIJNA_OP_DREMPEL})</p>
          </div>
        </div>

        {/* Uit voorraad */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Uit voorraad</h2>
          {uit.length ? (
            <div className="space-y-2">
              {uit.map((p) => (
                <ProductRij key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
              Alles is nog op voorraad.
            </p>
          )}
        </section>

        {/* Bijna op */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Bijna op</h2>
          {bijna.length ? (
            <div className="space-y-2">
              {bijna.map((p) => (
                <ProductRij key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
              Geen producten die bijna op zijn.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
