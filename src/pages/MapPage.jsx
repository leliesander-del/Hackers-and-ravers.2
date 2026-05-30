import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores as alleStores, userLocation } from '../data/stores.js'
import { rankStores } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import MapView from '../components/MapView.jsx'

export default function MapPage() {
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

  return (
    <div>
      <PageHeader title="Kaart" subtitle={`Winkels dichtbij · ${userLocation.label}`} />

      <div className="px-4 py-3">
        <SearchBar value={zoek} onChange={setZoek} placeholder="Zoek een winkel" />
      </div>

      <div className="overflow-hidden">
        <MapView
          stores={getoond}
          userLocation={userLocation}
          onSelectStore={(id) => navigate(`/store/${id}`)}
          height={520}
        />
      </div>

      <p className="px-4 py-3 text-center text-xs text-slate-400">
        Tik op een pin om de winkel te openen.
      </p>
    </div>
  )
}
