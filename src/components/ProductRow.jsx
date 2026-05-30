import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

// Eén regel in de zoekresultaten van een winkel.
export default function ProductRow({ product }) {
  const { inCart, addToCart, removeFromCart } = useStore()
  const zit = inCart(product.id)

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
      <Link to={`product/${product.id}`} className="flex flex-1 items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
          🛒
        </span>
        <span className="flex-1">
          <span className="flex items-center gap-2">
            <span className="font-medium text-slate-800">{product.naam}</span>
            {product._reden && (
              <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
                {product._reden}
              </span>
            )}
          </span>
          <span className="block text-xs text-slate-500">
            {product.merk} · € {product.prijs.toFixed(2)} · {product.schaplocatie?.label}
          </span>
          {product._waarschuwing && (
            <span className="mt-0.5 block text-[11px] text-amber-600">⚠ {product._waarschuwing}</span>
          )}
          {!product.opVoorraad && (
            <span className="mt-0.5 block text-[11px] font-medium text-rose-500">Niet op voorraad</span>
          )}
        </span>
      </Link>

      {product.opVoorraad ? (
        <button
          onClick={() => (zit ? removeFromCart(product.id) : addToCart(product.id))}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
            zit ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-600'
          }`}
          aria-label={zit ? 'Verwijder uit mandje' : 'Voeg toe aan mandje'}
        >
          {zit ? '✓' : '+'}
        </button>
      ) : (
        <Link
          to={`product/${product.id}`}
          className="shrink-0 rounded-full bg-amber-100 px-3 py-2 text-xs font-medium text-amber-700"
        >
          Alternatief
        </Link>
      )}
    </div>
  )
}
