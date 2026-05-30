import { useStore } from '../context/StoreContext.jsx'

// Eén alternatief bij een leeg schap, met uitleg waarom het wordt aanbevolen.
export default function AlternativeCard({ product }) {
  const { inCart, addToCart, removeFromCart } = useStore()
  const zit = inCart(product.id)

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg">✅</span>
      <div className="flex-1">
        <p className="font-medium text-slate-800">{product.naam}</p>
        <p className="text-xs text-slate-500">
          {product.merk} · € {product.prijs.toFixed(2)} · {product.schaplocatie?.label}
        </p>
        <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          {product._reden}
        </span>
      </div>
      <button
        onClick={() => (zit ? removeFromCart(product.id) : addToCart(product.id))}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold transition active:scale-90 ${
          zit ? 'bg-violet-600 text-white shadow-sm shadow-violet-300' : 'bg-violet-100 text-violet-600'
        }`}
        aria-label={zit ? 'Verwijder uit mandje' : 'Voeg toe aan mandje'}
      >
        {zit ? '✓' : '+'}
      </button>
    </div>
  )
}
