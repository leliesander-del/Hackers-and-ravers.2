import { Link } from 'react-router-dom'

// Eén winkel-tegel in het "Winkels voor jou"-raster.
export default function StoreCard({ store }) {
  return (
    <Link to={`/store/${store.id}`} className="flex flex-col items-center gap-2 text-center">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white shadow-sm"
        style={{ backgroundColor: store.kleur }}
      >
        {store.emoji}
      </span>
      <span className="text-sm font-semibold text-slate-800">{store.naam}</span>
      {store._reden && store._reden !== 'Dichtbij' ? (
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-600">
          {store._reden}
        </span>
      ) : (
        <span className="text-[11px] text-slate-400">{store._km} km · {store.cashback}% cashback</span>
      )}
    </Link>
  )
}
