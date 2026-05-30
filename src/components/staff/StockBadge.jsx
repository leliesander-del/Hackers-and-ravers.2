export default function StockBadge({ magazijn, rekken, compact = false }) {
  if (compact) {
    return (
      <div className="flex shrink-0 gap-1.5 text-[11px]">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">Mag. {magazijn}</span>
        <span className={`rounded-full px-2 py-0.5 ${rekken > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
          Rekken {rekken}
        </span>
      </div>
    )
  }

  return (
    <div className="flex gap-2 text-[11px]">
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">Magazijn: {magazijn}</span>
      <span className={`rounded-full px-2 py-0.5 ${rekken > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
        Rekken: {rekken}
      </span>
    </div>
  )
}
