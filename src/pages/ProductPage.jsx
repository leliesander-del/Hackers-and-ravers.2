import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { rankAlternatives } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import AlternativeCard from '../components/AlternativeCard.jsx'

export default function ProductPage() {
  const { id, pid } = useParams()
  const { activeProfile, inCart, addToCart, removeFromCart, getProductLive, allProductsLive } = useStore()

  const store = getStore(id)
  const product = getProductLive(pid)

  const alternatieven = useMemo(
    () => (product && !product.opVoorraad ? rankAlternatives(product, allProductsLive, activeProfile) : []),
    [product, activeProfile, allProductsLive],
  )

  if (!store || !product) return <Navigate to={`/store/${id}`} replace />

  const zit = inCart(product.id)

  return (
    <div>
      <PageHeader title={product.naam} subtitle={`${product.merk} · ${store.naam}`} back />

      <div className="space-y-4 px-4 py-4">
        {/* Productkaart */}
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
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
              className={`mt-4 w-full rounded-full py-3 text-sm font-semibold transition active:scale-[0.98] ${
                zit ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              }`}
            >
              {zit ? '✓ In je mandje — tik om te verwijderen' : '+ Voeg toe aan mandje'}
            </button>
          )}
        </div>

        {/* Op voorraad -> tip dat de route in het mandje zit */}
        {product.opVoorraad && store.heeftPlattegrond && (
          <Link to="/mandje" className="block rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-700">
            🗺️ Voeg toe aan je mandje en bekijk daar de route langs al je producten →
          </Link>
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
