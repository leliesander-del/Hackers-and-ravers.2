import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores } from '../data/stores.js'
import { findManagerByCredentials } from '../data/managers.js'

export default function ManagerLoginPage() {
  const { managerLogin } = useStore()
  const navigate = useNavigate()
  const [storeId, setStoreId] = useState(stores[0]?.id || '')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')

  function inloggen(e) {
    e.preventDefault()
    const manager = findManagerByCredentials(storeId, wachtwoord.trim())
    if (!manager) {
      setFout('Onjuiste winkel of wachtwoord.')
      return
    }
    setFout('')
    managerLogin(manager.id)
    navigate('/beheer/plattegrond')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-600 to-violet-500 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
            🏪
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Winkelbeheer</h1>
          <p className="mt-1 text-sm text-slate-500">
            Log in om de plattegrond van je winkel aan te maken. Klanten zien deze daarna in de app.
          </p>
        </div>

        <form onSubmit={inloggen} className="space-y-4">
          <div>
            <label htmlFor="store" className="mb-1 block text-xs font-medium text-slate-500">
              Jouw winkel
            </label>
            <select
              id="store"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.naam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pw" className="mb-1 block text-xs font-medium text-slate-500">
              Wachtwoord
            </label>
            <input
              id="pw"
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              placeholder="Demo-wachtwoord"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {fout && <p className="text-sm text-red-600">{fout}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Inloggen als beheerder
          </button>
        </form>

        <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-medium text-slate-600">Demo-wachtwoorden</summary>
          <ul className="mt-2 space-y-1">
            <li>AH XL Gent → <code className="text-violet-600">ahxl</code></li>
            <li>MediaMarkt → <code className="text-violet-600">media</code></li>
            <li>Decathlon → <code className="text-violet-600">sport</code></li>
            <li>HEMA → <code className="text-violet-600">hema</code></li>
            <li>Delhaize → <code className="text-violet-600">delhaize</code></li>
          </ul>
        </details>

        <Link
          to="/login"
          className="mt-6 block text-center text-sm text-violet-600 hover:text-violet-800"
        >
          ← Terug naar klantenlogin
        </Link>
      </div>
    </div>
  )
}
