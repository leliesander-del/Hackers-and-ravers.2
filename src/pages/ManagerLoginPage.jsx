import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores, getStore } from '../data/stores.js'
import { findManagerByCredentials } from '../data/managers.js'
import StoreLogo from '../components/StoreLogo.jsx'
import { AuthLayout, Button, Field, Select, Input, Card } from '../components/ui/index.js'

export default function ManagerLoginPage() {
  const { managerLogin } = useStore()
  const navigate = useNavigate()
  const [storeId, setStoreId] = useState(stores[0]?.id || '')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const geselecteerdeWinkel = getStore(storeId)

  function inloggen(e) {
    e.preventDefault()
    const manager = findManagerByCredentials(storeId, wachtwoord.trim())
    if (!manager) {
      setFout('Onjuiste winkel of wachtwoord.')
      return
    }
    setFout('')
    managerLogin(manager.id)
    navigate('/beheer')
  }

  return (
    <AuthLayout
      logo={
        geselecteerdeWinkel ? (
          <StoreLogo store={geselecteerdeWinkel} sizeClass="h-14 w-14" emojiClass="text-2xl" />
        ) : (
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
            🏪
          </span>
        )
      }
      title="Winkelbeheer"
      subtitle="Log in om de plattegrond van je winkel aan te maken. Klanten zien deze daarna in de app."
      footer={
        <Link to="/login" className="underline underline-offset-2 transition hover:text-brand-600">
          ← Terug naar klantenlogin
        </Link>
      }
    >
      <Card className="p-6">
        <form onSubmit={inloggen} className="space-y-4">
          <Field label="Jouw winkel">
            <Select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.naam}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Wachtwoord">
            <Input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              placeholder="Demo-wachtwoord"
            />
          </Field>

          {fout && <p className="text-sm text-rose-600">{fout}</p>}

          <Button type="submit" size="lg" pill className="w-full">
            Inloggen als beheerder
          </Button>
        </form>

        <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-medium text-slate-600">Demo-wachtwoorden</summary>
          <ul className="mt-2 space-y-1">
            <li>AH XL Gent → <code className="text-brand-600">ahxl</code></li>
            <li>MediaMarkt → <code className="text-brand-600">media</code></li>
            <li>Decathlon → <code className="text-brand-600">sport</code></li>
            <li>HEMA → <code className="text-brand-600">hema</code></li>
            <li>Delhaize → <code className="text-brand-600">delhaize</code></li>
          </ul>
        </details>
      </Card>
    </AuthLayout>
  )
}
