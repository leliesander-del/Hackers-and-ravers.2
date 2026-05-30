import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getProduct, products as alleProducten, productsByStore } from '../data/products.js'
import { rankAlternatives } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import Floorplan from '../components/Floorplan.jsx'
import AlternativeCard from '../components/AlternativeCard.jsx'

export default function ProductPage() {
  const { id, pid } = useParams()
  const { activeProfile, inCart, addToCart, removeFromCart } = useStore()

  const store = getStore(id)
  const product = getProduct(pid)

  const alternatieven = useMemo(
    () => (product && !product.opVoorraad ? rankAlternatives(product, alleProducten, activeProfile) : []),
    [product, activeProfile],
  )

  if (!store || !product) return <Navigate to={`/store/${id}`} replace />

  const zit = inCart(product.id)

  return (
    <div>
      <PageHeader title={product.naam} subtitle={`${product.merk} · ${store.naam}`} back />

      <div className="space-y-4 px-4 py-4">
        {/* Productkaart */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800">€ {product.prijs.toFixed(2)}</p>
              <p className="text-sm text-slate-500">{product.schaplocatie?.label}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                product.opVoorraad ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {product.opVoorraad ? 'Op voorraad' : 'Niet op voorraad'}
            </span>
          </div>

          {product.dieet.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.dieet.map((d) => (
                <span key={d} className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-600">
                  {d}
                </span>
              ))}
            </div>
          )}

          {product.opVoorraad && (
            <button
              onClick={() => (zit ? removeFromCart(product.id) : addToCart(product.id))}
              className={`mt-4 w-full rounded-full py-3 text-sm font-semibold transition ${
                zit ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'
              }`}
            >
              {zit ? '✓ In je mandje — tik om te verwijderen' : '+ Voeg toe aan mandje'}
            </button>
          )}
        </div>

        {/* Op voorraad -> route op plattegrond */}
        {product.opVoorraad && store.heeftPlattegrond && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Route naar het schap</h2>
            <Floorplan products={productsByStore(id)} highlightId={product.id} />
          </div>
        )}

        {/* Niet op voorraad -> gepersonaliseerde alternatieven */}
        {!product.opVoorraad && (
          <div>
            <div className="mb-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Dit product is op.{' '}
              {activeProfile.type === 'gast'
                ? 'Hier zijn vergelijkbare producten:'
                : 'Hier zijn alternatieven die bij jouw profiel passen:'}
            </div>
            <div className="space-y-2">
              {alternatieven.length ? (
                alternatieven.map((p) => <AlternativeCard key={p.id} product={p} />)
              ) : (
                <p className="text-sm text-slate-400">Geen alternatieven gevonden.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
