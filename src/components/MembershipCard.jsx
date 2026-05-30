import { Link } from 'react-router-dom'

// De lidmaatschap-/cashbackkaart (zoals het groen omkaderde blok in de screenshot).
export default function MembershipCard({ profile }) {
  const isGast = profile.type === 'gast'

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <Link
        to="/wallet"
        className="flex min-w-[60%] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm"
      >
        <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          ◆
        </div>
        <div>
          <p className="text-xs text-slate-500">Lidmaatschap</p>
          <p className="text-2xl font-bold text-slate-800">{profile.cashbackTier}</p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {isGast ? 'Log in voor cashback' : `€ ${profile.cashbackSaldo.toFixed(2)} cashback`}
          </p>
        </div>
      </Link>

      <div className="flex min-w-[55%] flex-col justify-between rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 p-4 text-white shadow-sm">
        <div className="flex gap-1 text-lg">🛍️</div>
        <div>
          <p className="text-sm font-semibold leading-snug">Klaar voor je volgende aankoop</p>
          <Link to="/kaart" className="mt-1 inline-block text-xs underline">
            Shop nu
          </Link>
        </div>
      </div>
    </div>
  )
}
