import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from '../components/icons.jsx'
import { useStore, getAccounts } from '../context/StoreContext.jsx'
import { AuthLayout, AuthLogo, Button, Input, Card } from '../components/ui/index.js'

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
    <AuthLayout
      logo={
        <AuthLogo>
          <Compass className="h-7 w-7" strokeWidth={1.8} />
        </AuthLogo>
      }
      title="Never Lost"
      subtitle="Jouw gepersonaliseerde winkel-navigator"
      footer={
        <span className="space-x-3">
          <Link to="/personeel/login" className="underline underline-offset-2 transition hover:text-brand-600">
            Personeel inloggen
          </Link>
          <Link to="/beheer/login" className="underline underline-offset-2 transition hover:text-brand-600">
            Winkelbeheerder inloggen
          </Link>
        </span>
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 rounded-full bg-slate-100 p-1">
        <button className="flex-1 rounded-full bg-white py-2.5 text-sm font-semibold text-brand-700 shadow-sm">
          Inloggen
        </button>
        <Link
          to="/signup"
          className="flex-1 rounded-full py-2.5 text-center text-sm font-semibold text-slate-500 transition hover:text-slate-700"
        >
          Account aanmaken
        </Link>
      </div>

      {/* Form */}
      <Card className="space-y-3 p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mailadres"
            aria-label="E-mailadres"
            autoComplete="email"
          />
          <Input
            type="password"
            required
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="Wachtwoord"
            aria-label="Wachtwoord"
            autoComplete="current-password"
          />

          {fout && (
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
              {fout}
            </div>
          )}

          <Button type="submit" size="lg" disabled={laden} className="w-full">
            {laden ? 'Bezig…' : 'Inloggen'}
          </Button>
        </form>
      </Card>

      {/* Demo hints */}
      <Card className="space-y-1.5 px-4 py-3.5">
        <p className="mb-2 text-xs font-medium text-slate-400">Demo accounts</p>
        <p className="font-mono text-xs text-slate-500">sander@neverlost.be / sander123</p>
        <p className="font-mono text-xs text-slate-500">marc@neverlost.be / marc123</p>
        <p className="font-mono text-xs text-slate-500">gast@neverlost.be / gast</p>
      </Card>
    </AuthLayout>
  )
}
