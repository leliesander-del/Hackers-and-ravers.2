import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { fuzzyZoekProducten } from '../lib/fuzzySearch.js'
import BeheerNav from '../components/BeheerNav.jsx'
import StoreLogo from '../components/StoreLogo.jsx'

// Een product telt als "bijna op" zodra de totale voorraad hier of lager zit.
const BIJNA_OP_DREMPEL = 5

function statusVan(p) {
  const totaal = p.magazijnVoorraad + p.rekkenVoorraad
  if (totaal === 0) return { label: 'Uit voorraad', kleur: 'bg-rose-100 text-rose-700' }
  if (totaal <= BIJNA_OP_DREMPEL) return { label: 'Bijna op', kleur: 'bg-amber-100 text-amber-700' }
  if (!p.opSchap) return { label: 'Enkel magazijn', kleur: 'bg-slate-100 text-slate-600' }
  return { label: 'Op voorraad', kleur: 'bg-emerald-100 text-emerald-700' }
}

// De catalogus van één winkel: alle producten met live voorraad- en prijsdata.
// Dit is de bron van waarheid over wat de winkel voert; klanten matchen hun
// lijst hiertegen wanneer ze deze winkel kiezen.
export default function CatalogPage() {
  const { activeManager, isManagerIngelogd, managerLogout, productsByStoreLive } = useStore()
  const navigate = useNavigate()
  const store = activeManager ? getStore(activeManager.storeId) : null

  const [zoek, setZoek] = useState('')
  const [categorie, setCategorie] = useState('alle')

  const producten = useMemo(
    () => (store ? productsByStoreLive(store.id) : []),
    [productsByStoreLive, store],
  )

  const categorieen = useMemo(() => {
    const set = new Set(producten.map((p) => p.categorie))
    return ['alle', ...[...set].sort((a, b) => a.localeCompare(b))]
  }, [producten])

  const zichtbaar = useMemo(() => {
    let lijst = categorie === 'alle' ? producten : producten.filter((p) => p.categorie === categorie)
    lijst = fuzzyZoekProducten(lijst, zoek)
    return [...lijst].sort((a, b) => a.naam.localeCompare(b.naam))
  }, [producten, categorie, zoek])

  const samenvatting = useMemo(() => {
    let op = 0
    let bijna = 0
    let uit = 0
    for (const p of producten) {
      const totaal = p.magazijnVoorraad + p.rekkenVoorraad
      if (totaal === 0) uit++
      else if (totaal <= BIJNA_OP_DREMPEL) bijna++
      else op++
    }
    return { totaal: producten.length, op, bijna, uit }
  }, [producten])

  if (!isManagerIngelogd || !store) return <Navigate to="/beheer/login" replace />

  function uitloggen() {
    managerLogout()
    navigate('/beheer/login')
  }

  return (
    <div className="beheer-layout flex flex-col bg-[#f6f4fc]">
      <header className="relative z-20 shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <StoreLogo store={store} sizeClass="h-10 w-10" emojiClass="text-lg" />
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-800">Catalogus</h1>
              <p className="truncate text-sm text-slate-500">{store.naam} · live voorraad</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <BeheerNav />
            <button
              type="button"
              onClick={uitloggen}
              className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-5">
          {/* Samenvatting */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SamenvattingTegel label="Producten" waarde={samenvatting.totaal} kleur="text-slate-800" achtergrond="bg-white" />
            <SamenvattingTegel label="Op voorraad" waarde={samenvatting.op} kleur="text-emerald-600" achtergrond="bg-emerald-50 ring-emerald-100" />
            <SamenvattingTegel label={`Bijna op (≤ ${BIJNA_OP_DREMPEL})`} waarde={samenvatting.bijna} kleur="text-amber-600" achtergrond="bg-amber-50 ring-amber-100" />
            <SamenvattingTegel label="Uit voorraad" waarde={samenvatting.uit} kleur="text-rose-600" achtergrond="bg-rose-50 ring-rose-100" />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={zoek}
              onChange={(e) => setZoek(e.target.value)}
              placeholder="Zoek op naam, merk, categorie of locatie…"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium capitalize text-slate-700 outline-none focus:border-violet-400"
            >
              {categorieen.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c === 'alle' ? 'Alle categorieën' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Tabel */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Product</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Categorie</th>
                  <th className="hidden px-4 py-3 md:table-cell">Locatie</th>
                  <th className="px-4 py-3 text-right">Prijs</th>
                  <th className="px-4 py-3 text-right">Magazijn</th>
                  <th className="px-4 py-3 text-right">Schap</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {zichtbaar.length ? (
                  zichtbaar.map((p) => {
                    const status = statusVan(p)
                    return (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{p.naam}</p>
                          <p className="text-xs text-slate-400">{p.merk}</p>
                        </td>
                        <td className="hidden px-4 py-3 capitalize text-slate-600 sm:table-cell">{p.categorie}</td>
                        <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{p.rekkenlocatie?.label || '—'}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">€ {p.prijs.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-600">{p.magazijnVoorraad}</td>
                        <td className={`px-4 py-3 text-right tabular-nums font-medium ${p.rekkenVoorraad > 0 ? 'text-slate-700' : 'text-rose-500'}`}>
                          {p.rekkenVoorraad}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${status.kleur}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                      Geen producten gevonden{zoek ? ` voor "${zoek}"` : ''}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-slate-400">
            {zichtbaar.length} van {samenvatting.totaal} producten · voorraad werkt live mee met het personeelsscherm
          </p>
        </div>
      </div>
    </div>
  )
}

function SamenvattingTegel({ label, waarde, kleur, achtergrond }) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm ring-1 ring-slate-100 ${achtergrond}`}>
      <p className={`text-2xl font-bold ${kleur}`}>{waarde}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}
