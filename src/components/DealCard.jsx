// Eén actie/deal in de Wallet.
export default function DealCard({ deal }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
        style={{ backgroundColor: deal.kleur }}
      >
        {deal.korting}
      </span>
      <div className="flex-1">
        <p className="font-medium leading-tight text-slate-800">{deal.titel}</p>
        <p className="text-xs text-slate-500">{deal.winkel}</p>
      </div>
      <span className="text-violet-400">›</span>
    </div>
  )
}
