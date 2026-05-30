import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

// Aparte inlog voor winkelpersoneel — losgekoppeld van de klantenlogin.
const STAFF_ACCOUNTS = [{ email: 'lisa@neverlost.be', wachtwoord: 'lisa123', profielId: 'bediende' }]

export default function StaffLoginPage() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')

  function inloggen(e) {
    e.preventDefault()
    const emailLower = email.trim().toLowerCase()
    const account = STAFF_ACCOUNTS.find((a) => a.email === emailLower && a.wachtwoord === wachtwoord)
    if (!account) {
      setFout('Onjuiste personeelsgegevens.')
      return
    }
    setFout('')
    login(account.profielId)
    navigate('/personeel')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 px-5 py-12">
      <div className="w-full max-w-md space-y-5">
        <div className="mb-2 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-lg">
            🏪
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Personeel</h1>
            <p className="mt-0.5 text-sm text-white/50">Voorraadbeheer · magazijn ↔ rekken</p>
          </div>
        </div>

        <form onSubmit={inloggen} className="space-y-3 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Personeels-e-mail"
            className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-emerald-300/50"
          />
          <input
            type="password"
            required
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="Wachtwoord"
            className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-emerald-300/50"
          />

          {fout && (
            <div className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200 ring-1 ring-red-500/30">{fout}</div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-emerald-800 shadow-lg transition active:scale-[0.98]"
          >
            Inloggen
          </button>
        </form>

        <div className="space-y-1.5 rounded-2xl bg-white/5 px-4 py-3.5 ring-1 ring-white/10">
          <p className="mb-2 text-xs font-medium text-white/40">Demo-account</p>
          <p className="font-mono text-xs text-white/25">lisa@neverlost.be / lisa123</p>
        </div>

        <p className="text-center text-xs text-white/30">
          <Link to="/login" className="underline underline-offset-2 transition hover:text-white/50">
            ← Terug naar klantenlogin
          </Link>
        </p>
      </div>
    </div>
  )
}
