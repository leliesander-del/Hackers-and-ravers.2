import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores as alleStores, userLocation } from '../data/stores.js'
import { rankStores } from '../lib/personalization.js'
import MapView from '../components/MapView.jsx'
import MembershipCard from '../components/MembershipCard.jsx'
import StoreGrid from '../components/StoreGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'

export default function HomePage() {
  const { activeProfile } = useStore()
  const navigate = useNavigate()
  const [zoek, setZoek] = useState('')

  const gesorteerd = useMemo(
    () => rankStores(alleStores, activeProfile, userLocation),
    [activeProfile],
  )

  const getoond = zoek
    ? gesorteerd.filter((s) => s.naam.toLowerCase().includes(zoek.toLowerCase()))
    : gesorteerd

  const isGast = activeProfile.type === 'gast'

  return (
    <div>
      {/* Header */}
      <div className="px-4 pb-3 pt-7">
        <p className="text-sm font-medium text-violet-500">
          {isGast ? 'Welkom' : 'Goedemorgen,'}
        </p>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
          {isGast ? 'Ontdek winkels dichtbij' : activeProfile.naam}
        </h1>
        <SearchBar value={zoek} onChange={setZoek} placeholder="Zoek een winkel" />
      </div>

      {/* Kaart */}
      <div className="mx-4 overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-100">
        <MapView
          stores={gesorteerd}
          userLocation={userLocation}
          onSelectStore={(id) => navigate(`/store/${id}`)}
        />
      </div>

      <div className="space-y-5 px-4 py-4">
        {isGast && (
          <Link
            to="/login"
            className="block rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-700"
          >
            💳 Log in met je klantenkaart voor persoonlijke aanbevelingen →
          </Link>
        )}

        <MembershipCard profile={activeProfile} />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Winkels voor jou</h2>
            {!isGast && <span className="text-xs text-slate-400">op jouw voorkeur</span>}
          </div>
          {getoond.length ? (
            <StoreGrid stores={getoond} />
          ) : (
            <p className="text-sm text-slate-400">Geen winkels gevonden voor "{zoek}".</p>
          )}
        </section>
      </div>
    </div>
  )
}
