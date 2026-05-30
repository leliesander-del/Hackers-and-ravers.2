import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { deals } from '../data/deals.js'
import { relevantDeals } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import DealCard from '../components/DealCard.jsx'

export default function WalletPage() {
  const { activeProfile } = useStore()
  const isGast = activeProfile.type === 'gast'
  const mijnDeals = relevantDeals(deals, activeProfile)

  return (
    <div>
      <PageHeader title="Wallet" subtitle={isGast ? 'Gast' : activeProfile.naam} />

      <div className="space-y-5 px-4 py-4">
        {/* Saldo-kaart */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 p-5 text-white shadow-lg shadow-violet-200">
          <p className="text-sm text-violet-100">Cashback-saldo</p>
          <p className="text-3xl font-bold">€ {activeProfile.cashbackSaldo.toFixed(2)}</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-violet-100">Loyalty-punten</span>
            <span className="font-semibold">{activeProfile.loyaltyPunten} pt</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-violet-100">Niveau</span>
            <span className="font-semibold">{activeProfile.cashbackTier}</span>
          </div>
        </div>

        <section>
          <h2 className="mb-2 text-lg font-bold text-slate-800">
            {isGast ? 'Acties' : 'Jouw deals'}
          </h2>

          {isGast ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
              <p className="text-3xl">🔒</p>
              <p className="mt-2 text-sm text-slate-500">
                Persoonlijke deals zijn alleen voor leden. Wissel naar een klantenkaart.
              </p>
              <Link to="/meer" className="mt-4 inline-block rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white">
                Wissel profiel
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {mijnDeals.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
              <p className="pt-1 text-center text-xs text-slate-400">
                Alleen acties die passen bij jouw voorkeuren worden getoond.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
