import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores, getStore } from '../data/stores.js'
import { findManagerByCredentials, MANAGER_DEMO_HINTS } from '../data/managers.js'
import StoreLogo from '../components/StoreLogo.jsx'
import { clearLoginAttempts, getLoginLockout, recordFailedLogin } from '../lib/security.js'
import { AuthLayout, Button, Field, Select, Input, Card } from '../components/ui/index.js'

export default function ManagerLoginPage() {
  const { managerLogin } = useStore()
  const navigate = useNavigate()
  const [storeId, setStoreId] = useState(stores[0]?.id || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const selectedStore = getStore(storeId)

  function handleLogin(e) {
    e.preventDefault()

    const lockout = getLoginLockout()
    if (lockout.locked) {
      setError(`Too many attempts. Try again in ${lockout.secondsLeft} seconds.`)
      return
    }

    const manager = findManagerByCredentials(storeId, password.trim())
    if (!manager) {
      recordFailedLogin()
      setError('Incorrect store or password.')
      return
    }

    clearLoginAttempts()
    setError('')
    managerLogin(manager.id)
    navigate('/manage')
  }

  return (
    <AuthLayout
      logo={
        selectedStore ? (
          <StoreLogo store={selectedStore} sizeClass="h-14 w-14" emojiClass="text-2xl" />
        ) : (
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
            🏪
          </span>
        )
      }
      title="Store management"
      subtitle="Log in to build your store's floor plan. Customers then see it in the app."
      footer={
        <Link to="/login" className="underline underline-offset-2 transition hover:text-brand-600">
          ← Back to customer login
        </Link>
      }
    >
      <Card className="p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <Field label="Your store">
            <Select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Demo password"
              autoComplete="current-password"
            />
          </Field>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <Button type="submit" size="lg" pill className="w-full">
            Log in as manager
          </Button>
        </form>

        <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-medium text-slate-600">Demo passwords</summary>
          <ul className="mt-2 space-y-1">
            {MANAGER_DEMO_HINTS.map(({ label, hint }) => (
              <li key={label}>
                {label} → <code className="text-brand-600">{hint}</code>
              </li>
            ))}
          </ul>
        </details>
      </Card>
    </AuthLayout>
  )
}
