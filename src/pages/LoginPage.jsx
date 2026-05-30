import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from '../components/icons.jsx'
import { useStore, getAccounts } from '../context/StoreContext.jsx'

const DEMO_ACCOUNTS = [
  { email: 'sander@neverlost.be', wachtwoord: 'sander123', profielId: 'sander' },
  { email: 'marc@neverlost.be', wachtwoord: 'marc123', profielId: 'marc' },
  { email: 'gast@neverlost.be', wachtwoord: 'gast', profielId: 'gast' },
]

export default function LoginPage() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [laden, setLaden] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setFout('')
    setLaden(true)

    setTimeout(() => {
      const emailLower = email.trim().toLowerCase()

      const demo = DEMO_ACCOUNTS.find((u) => u.email === emailLower && u.wachtwoord === wachtwoord)
      if (demo) {
        login(demo.profielId)
        navigate('/')
        return
      }

      const accounts = getAccounts()
      const account = accounts[emailLower]
      if (account && account.wachtwoord === wachtwoord) {
        login(account.profiel)
        navigate('/')
        return
      }

      setFout('E-mail of wachtwoord is onjuist.')
      setLaden(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c24] via-[#1a1240] to-[#2a1463] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-indigo-500 shadow-lg shadow-fuchsia-500/30">
            <Compass className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Never Lost</h1>
            <p className="text-sm text-white/40 mt-0.5">Jouw gepersonaliseerde winkel-navigator</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-white/5 ring-1 ring-white/10 p-1 gap-1">
          <button className="flex-1 rounded-xl py-2.5 text-sm font-medium bg-white/15 text-white shadow-sm">
            Inloggen
          </button>
          <Link
            to="/signup"
            className="flex-1 rounded-xl py-2.5 text-sm font-medium text-center text-white/40 hover:text-white/70 transition"
          >
            Account aanmaken
          </Link>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mailadres"
              className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-fuchsia-400/50 transition"
            />
            <input
              type="password"
              required
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              placeholder="Wachtwoord"
              className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-fuchsia-400/50 transition"
            />

            {fout && (
              <div className="rounded-xl bg-red-500/15 ring-1 ring-red-500/30 px-4 py-3 text-sm text-red-300">
                {fout}
              </div>
            )}

            <button
              type="submit"
              disabled={laden}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition active:scale-[0.98] disabled:opacity-50"
            >
              {laden ? 'Bezig…' : 'Inloggen'}
            </button>
          </form>
        </div>

        {/* Demo hints */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3.5 space-y-1.5">
          <p className="text-xs font-medium text-white/40 mb-2">Demo accounts</p>
          <p className="text-xs text-white/25 font-mono">sander@neverlost.be / sander123</p>
          <p className="text-xs text-white/25 font-mono">marc@neverlost.be / marc123</p>
          <p className="text-xs text-white/25 font-mono">gast@neverlost.be / gast</p>
        </div>

        <p className="text-center text-xs text-white/25 space-x-3">
          <Link to="/personeel/login" className="hover:text-white/50 transition underline underline-offset-2">
            Personeel inloggen
          </Link>
          <Link to="/beheer/login" className="hover:text-white/50 transition underline underline-offset-2">
            Winkelbeheerder inloggen
          </Link>
        </p>
      </div>
    </div>
  )
}
