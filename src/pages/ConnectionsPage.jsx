import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import StoreLogo from '../components/StoreLogo.jsx'
import {
  loadConnections,
  saveConnection,
  deleteConnection,
  toggleConnection,
} from '../lib/connectionsStorage.js'

const LEEG_FORMULIER = {
  id: null,
  naam: '',
  baseUrl: '',
  method: 'GET',
  authHeader: '',
  apiKey: '',
  actief: true,
  demo: false,
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export default function ConnectionsPage() {
  const { activeManager, isManagerIngelogd, managerLogout, syncVoorraadVanConnectie } = useStore()
  const navigate = useNavigate()
  const store = activeManager ? getStore(activeManager.storeId) : null

  const [connecties, setConnecties] = useState([])
  const [formulier, setFormulier] = useState(LEEG_FORMULIER)
  const [toonFormulier, setToonFormulier] = useState(false)
  const [fout, setFout] = useState('')
  // Sync-status per connectie-id: { bezig, ok, tekst }.
  const [syncStatus, setSyncStatus] = useState({})

  async function synchroniseer(connectie) {
    setSyncStatus((s) => ({ ...s, [connectie.id]: { bezig: true } }))
    const r = await syncVoorraadVanConnectie(store.id, connectie.id)
    setSyncStatus((s) => ({
      ...s,
      [connectie.id]: {
        bezig: false,
        ok: r.ok,
        tekst: r.ok
          ? `✓ ${r.herkend} producten gesynchroniseerd (${r.gewijzigd} aangepast)`
          : `✕ ${r.fout}`,
      },
    }))
  }

  useEffect(() => {
    if (store) setConnecties(loadConnections(store.id))
  }, [store])

  if (!isManagerIngelogd || !store) return <Navigate to="/beheer/login" replace />

  const bewerkt = !!formulier.id

  function start(connectie) {
    setFout('')
    setFormulier(connectie ? { ...connectie } : LEEG_FORMULIER)
    setToonFormulier(true)
  }

  function annuleer() {
    setToonFormulier(false)
    setFormulier(LEEG_FORMULIER)
    setFout('')
  }

  function opslaan(e) {
    e.preventDefault()
    if (!formulier.naam.trim()) {
      setFout('Geef de connectie een naam.')
      return
    }
    // Een demo-databron heeft geen URL nodig; een echte API wel.
    if (!formulier.demo) {
      if (!formulier.baseUrl.trim()) {
        setFout('Vul een API-URL in (of kies een demo-databron).')
        return
      }
      try {
        // eslint-disable-next-line no-new
        new URL(formulier.baseUrl.trim())
      } catch {
        setFout('De API-URL is geen geldige URL (begin met https://).')
        return
      }
    }
    saveConnection(store.id, {
      ...formulier,
      naam: formulier.naam.trim(),
      baseUrl: formulier.baseUrl.trim(),
    })
    setConnecties(loadConnections(store.id))
    annuleer()
  }

  function verwijder(id) {
    deleteConnection(store.id, id)
    setConnecties(loadConnections(store.id))
  }

  function wissel(id) {
    toggleConnection(store.id, id)
    setConnecties(loadConnections(store.id))
  }

  function set(veld, waarde) {
    setFormulier((f) => ({ ...f, [veld]: waarde }))
  }

  return (
    <div className="min-h-screen bg-[#f6f4fc]">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/beheer" className="text-slate-400 hover:text-slate-700">
              ←
            </Link>
            <StoreLogo store={store} sizeClass="h-10 w-10" emojiClass="text-lg" />
            <div>
              <h1 className="text-lg font-bold text-slate-800">Connecties</h1>
              <p className="text-sm text-slate-500">{store.naam}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              managerLogout()
              navigate('/beheer/login')
            }}
            className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Koppel de databank van je winkel via een custom API en synchroniseer de voorraad,
            zodat de inventaris in de app klopt.
          </p>
          {!toonFormulier && (
            <button
              type="button"
              onClick={() => start(null)}
              className="shrink-0 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              + Nieuwe connectie
            </button>
          )}
        </div>

        {toonFormulier && (
          <form
            onSubmit={opslaan}
            className="mb-8 space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-slate-800">
              {bewerkt ? 'Connectie bewerken' : 'Nieuwe connectie'}
            </h2>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Naam</label>
              <input
                value={formulier.naam}
                onChange={(e) => set('naam', e.target.value)}
                placeholder="bv. Voorraadsysteem"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="grid grid-cols-[7rem_1fr] gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Methode</label>
                <select
                  value={formulier.method}
                  onChange={(e) => set('method', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">API-URL</label>
                <input
                  value={formulier.baseUrl}
                  onChange={(e) => set('baseUrl', e.target.value)}
                  placeholder="https://api.voorbeeld.be/v1/voorraad"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Auth-header (optioneel)
                </label>
                <input
                  value={formulier.authHeader}
                  onChange={(e) => set('authHeader', e.target.value)}
                  placeholder="Authorization"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  API-sleutel (optioneel)
                </label>
                <input
                  type="password"
                  value={formulier.apiKey}
                  onChange={(e) => set('apiKey', e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formulier.actief}
                  onChange={(e) => set('actief', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                Connectie actief
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formulier.demo}
                  onChange={(e) => set('demo', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                Demo-databron (gesimuleerde winkeldatabank — werkt zonder echte server)
              </label>
            </div>

            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              Deze connectie haalt de voorraad uit de databank van je winkel. Verwachte JSON:
              een lijst met per product een <code className="text-brand-600">sku</code> (= product-id),{' '}
              <code className="text-brand-600">magazijn</code> en{' '}
              <code className="text-brand-600">rekken</code>. Synchroniseren werkt de live
              inventaris bij (zichtbaar in catalogus en personeelsdashboard).
            </p>

            {fout && <p className="text-sm text-red-600">{fout}</p>}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {bewerkt ? 'Opslaan' : 'Toevoegen'}
              </button>
              <button
                type="button"
                onClick={annuleer}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                Annuleren
              </button>
            </div>
          </form>
        )}

        {connecties.length === 0 && !toonFormulier ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
            <p className="text-3xl">🔌</p>
            <p className="mt-2 font-medium text-slate-700">Nog geen connecties</p>
            <p className="mt-1 text-sm text-slate-500">
              Voeg een custom API toe om dit systeem aan andere systemen te koppelen.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {connecties.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
               <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                    c.actief ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  🔌
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-slate-800">{c.naam}</p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                      {c.method}
                    </span>
                    {!c.actief && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
                        inactief
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-slate-500">{c.baseUrl}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => wissel(c.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
                  >
                    {c.actief ? 'Pauzeer' : 'Activeer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => start(c)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                  >
                    Bewerk
                  </button>
                  <button
                    type="button"
                    onClick={() => verwijder(c.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Verwijder
                  </button>
                </div>
               </div>

                {c.actief ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => synchroniseer(c)}
                      disabled={syncStatus[c.id]?.bezig}
                      className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                    >
                      {syncStatus[c.id]?.bezig ? 'Synchroniseren…' : '🔄 Voorraad synchroniseren'}
                    </button>
                    {c.demo && (
                      <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600">
                        demo-databron
                      </span>
                    )}
                    {syncStatus[c.id]?.tekst && (
                      <span
                        className={`text-xs font-medium ${
                          syncStatus[c.id].ok ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {syncStatus[c.id].tekst}
                      </span>
                    )}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
