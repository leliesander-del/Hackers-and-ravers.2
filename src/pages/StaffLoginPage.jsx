import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { AuthLayout, Button, Input, Card } from '../components/ui/index.js'

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
    <AuthLayout
      logo={
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-lg shadow-brand-600/25">
          🏪
        </span>
      }
      title="Personeel"
      subtitle="Rekkenvuller of kassamedewerker"
      footer={
        <Link to="/login" className="underline underline-offset-2 transition hover:text-brand-600">
          ← Terug naar klantenlogin
        </Link>
      }
    >
      <Card className="p-6">
        <form onSubmit={inloggen} className="space-y-3">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Personeels-e-mail"
            aria-label="Personeels-e-mail"
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
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">{fout}</div>
          )}

          <Button type="submit" size="lg" className="w-full">
            Inloggen
          </Button>
        </form>
      </Card>

      <Card className="space-y-1.5 px-4 py-3.5">
        <p className="mb-2 text-xs font-medium text-slate-400">Demo-account</p>
        <p className="font-mono text-xs text-slate-500">lisa@neverlost.be / lisa123</p>
      </Card>
    </AuthLayout>
  )
}
