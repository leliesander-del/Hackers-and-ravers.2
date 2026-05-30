import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores as alleStores, userLocation } from '../data/stores.js'
import { rankStores } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StoreLogo from '../components/StoreLogo.jsx'

export default function MapPage() {
  const { activeProfile } = useStore()
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
      <PageHeader title="Winkels" subtitle={`Alle winkels · ${userLocation.label}`} />

      <div className="space-y-4 px-4 py-4">
        <SearchBar value={zoek} onChange={setZoek} placeholder="Zoek een winkel" />

        <div className="space-y-2">
          {getoond.length ? (
            getoond.map((s) => (
              <Link
                key={s.id}
                to={`/store/${s.id}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
              >
                <StoreLogo store={s} sizeClass="h-12 w-12" emojiClass="text-2xl" />
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{s.naam}</span>
                    {s._reden && s._reden !== 'Dichtbij' && (
                      <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
                        {s._reden}
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {s.type} · {s._km} km · {s.cashback}% cashback
                  </span>
                </span>
                <span className="text-slate-300">›</span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-400">Geen winkels gevonden voor "{zoek}".</p>
          )}
        </div>
      </div>
    </div>
  )
}
