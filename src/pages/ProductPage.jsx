import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { rankAlternatives, findZelfdeProductAndereWinkels } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import AlternativeCard from '../components/AlternativeCard.jsx'
import Floorplan from '../components/Floorplan.jsx'
import { useFloorplan } from '../lib/useFloorplan.js'

function VoorraadBadge({ status }) {
  if (status === 'rekken') {
    return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Op voorraad</span>
  }
  if (status === 'magazijn') {
    return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Niet op rekken</span>
  }
  return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">Niet op voorraad</span>
}

export default function ProductPage() {
  const { id, pid } = useParams()
  const { activeProfile, inCart, addToCart, removeFromCart, getProductLive, allProductsLive, productsByStoreLive } = useStore()

  const store = getStore(id)
  const product = getProductLive(pid)
  const { hasPlan } = useFloorplan(id)

  const volledigOp = product?.voorraadStatus === 'op'

  const alternatieven = useMemo(
    () => (product && volledigOp ? rankAlternatives(product, allProductsLive, activeProfile) : []),
    [product, volledigOp, activeProfile, allProductsLive],
  )

  const zelfdeProductAndereWinkels = useMemo(
    () => (product && volledigOp ? findZelfdeProductAndereWinkels(product, allProductsLive) : []),
    [product, volledigOp, allProductsLive],
  )

  if (!store || !product) return <Navigate to={`/store/${id}`} replace />

  const zit = inCart(product.id)
  const opRekken = product.voorraadStatus === 'rekken'
  const inMagazijn = product.voorraadStatus === 'magazijn'
  return (
    <div>
      <PageHeader title={product.naam} subtitle={`${product.merk} · ${store.naam}`} back />

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800">€ {product.prijs.toFixed(2)}</p>
              <p className="text-sm text-slate-500">{product.rekkenlocatie?.label}</p>
            </div>
            <VoorraadBadge status={product.voorraadStatus} />
          </div>

          {inMagazijn && (
            <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Dit product ligt niet op de rekken, maar er is nog voorraad in het magazijn. Vraag een medewerker om het
              voor je bij te halen.
            </div>
          )}

          {product.dieet.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.dieet.map((d) => (
                <span key={d} className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-600">
                  {d}
                </span>
              ))}
            </div>
          )}

          {opRekken && (
            <button
              onClick={() => (zit ? removeFromCart(product.id) : addToCart(product.id))}
              className={`mt-4 w-full rounded-full py-3 text-sm font-semibold transition active:scale-[0.98] ${
                zit ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              }`}
            >
              {zit ? '✓ In je mandje — tik om te verwijderen' : '+ Voeg toe aan mandje'}
            </button>
          )}
        </div>

        {opRekken && hasPlan && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Route naar de rekken</h2>
            <Floorplan
              storeId={store.id}
              products={productsByStoreLive(id)}
              highlightId={product.id}
              highlight={product.rekkenlocatie}
            />
          </div>
        )}

        {opRekken && store.heeftPlattegrond && !hasPlan && (
          <Link to="/mandje" className="block rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-700">
            🗺️ Voeg toe aan je mandje en bekijk daar de route langs al je producten →
          </Link>
        )}

        {volledigOp && (
          <div className="space-y-4">
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
              Dit product is op in deze winkel — zowel op rekken als in het magazijn.
            </div>

            {alternatieven.length > 0 && (
              <section>
                <h2 className="mb-2 text-sm font-semibold text-slate-500">
                  {activeProfile.type === 'gast'
                    ? 'Vergelijkbare producten in deze winkel'
                    : 'Alternatieven in deze winkel die bij jou passen'}
                </h2>
                <div className="space-y-2">
                  {alternatieven.map((p) => (
                    <AlternativeCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {zelfdeProductAndereWinkels.length > 0 && (
              <section>
                <h2 className="mb-2 text-sm font-semibold text-slate-500">Hetzelfde product bij andere winkels</h2>
                <div className="space-y-2">
                  {zelfdeProductAndereWinkels.map((p) => (
                    <AlternativeCard key={p.id} product={p} andereWinkel />
                  ))}
                </div>
              </section>
            )}

            {alternatieven.length === 0 && zelfdeProductAndereWinkels.length === 0 && (
              <p className="text-sm text-slate-400">Geen alternatieven gevonden.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
