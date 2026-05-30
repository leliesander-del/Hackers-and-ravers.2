import { formatCategoryLabel } from '../lib/productCategories.js'

export default function RouteOverviewPanel({
  orderedStops,
  currentIndex,
  visitedIds,
  kassaLabel,
  endLabel,
  onSelectStop,
  onMarkVisited,
  onResetProgress,
  compact = false,
}) {
  const total = orderedStops.length
  const done = visitedIds.size
  const pct = total ? Math.round((done / total) * 100) : 0

  if (!total) {
    return (
      <aside className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs text-slate-500">Geen producten in je mandje voor deze winkel.</p>
      </aside>
    )
  }

  return (
    <aside
      className={`flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${
        compact ? 'max-h-44' : 'max-h-[min(70vh,520px)]'
      }`}
    >
      <div className="border-b border-slate-100 px-3 py-2">
        <h3 className="text-xs font-bold text-slate-800">Jouw route</h3>
        <p className="mt-0.5 text-[10px] text-slate-500">
          {done}/{total} rekken
          {kassaLabel ? ` · ${kassaLabel}` : ''} · {endLabel}
        </p>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-violet-600 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className={`flex-1 space-y-0.5 overflow-y-auto p-1.5 ${compact ? 'text-[11px]' : 'text-sm'}`}>
        {orderedStops.map((stop, i) => {
          const isCurrent = i === currentIndex && !visitedIds.has(stop.rackId)
          const isDone = visitedIds.has(stop.rackId)
          return (
            <li key={stop.rackId}>
              <button
                type="button"
                onClick={() => onSelectStop?.(i)}
                className={`flex w-full items-start gap-1.5 rounded-lg px-2 py-1.5 text-left transition ${
                  isCurrent
                    ? 'bg-violet-100 ring-1 ring-violet-400'
                    : isDone
                      ? 'bg-emerald-50 text-slate-500'
                      : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold leading-tight ${isDone ? 'line-through' : 'text-slate-800'}`}>
                    {stop.label}
                  </span>
                  {!compact && (
                    <span className="block text-[11px] text-slate-400">{stop.categorieën.map(formatCategoryLabel).join(' · ')}</span>
                  )}
                  <ul className="mt-0.5 space-y-0">
                    {stop.products.map((p) => (
                      <li key={p.id} className="truncate text-[10px] text-slate-600">
                        · {p.naam}
                      </li>
                    ))}
                  </ul>
                </span>
              </button>
            </li>
          )
        })}
        {kassaLabel && (
          <li className="rounded-lg border border-dashed border-violet-200 bg-violet-50 px-2 py-1.5 text-[10px] font-medium text-violet-800">
            🛒 {kassaLabel}
          </li>
        )}
        <li className="rounded-lg border border-dashed border-red-200 bg-red-50 px-2 py-1.5 text-[10px] font-medium text-red-700">
          🚪 {endLabel}
        </li>
      </ol>

      <div className="space-y-1 border-t border-slate-100 p-1.5">
        {currentIndex < total && !visitedIds.has(orderedStops[currentIndex]?.rackId) && (
          <button
            type="button"
            onClick={onMarkVisited}
            className="w-full rounded-full bg-violet-600 py-1.5 text-[11px] font-semibold text-white hover:bg-violet-700"
          >
            Rek {currentIndex + 1} afgevinkt
          </button>
        )}
        {done > 0 && (
          <button
            type="button"
            onClick={onResetProgress}
            className="w-full rounded-full bg-slate-100 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
          >
            Voortgang resetten
          </button>
        )}
      </div>
    </aside>
  )
}
