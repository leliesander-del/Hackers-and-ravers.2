import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, getAccounts } from '../context/StoreContext.jsx'
import { stores, getStore } from '../data/stores.js'
import { getManager } from '../data/managers.js'
import StoreLogo from '../components/StoreLogo.jsx'
import {
  clearLoginAttempts,
  getLoginLockout,
  recordFailedLogin,
  verifyPassword,
} from '../lib/security.js'
import { AuthLayout, Button, Field, Select, Input, Card } from '../components/ui/index.js'

export default function ManagerLoginPage() {
  const { managerLogin } = useStore()
  const navigate = useNavigate()
  const [storeId, setStoreId] = useState(stores[0]?.id || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedStore = getStore(storeId)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    const lockout = getLoginLockout()
    if (lockout.locked) {
      setError(`Too many attempts. Try again in ${lockout.secondsLeft} seconds.`)
      return
    }

    setLoading(true)
    try {
      const accounts = getAccounts()
      let matchedManager = null
      for (const account of Object.values(accounts)) {
        if (account.role !== 'manager' || account.storeId !== storeId) continue
        if (!(await verifyPassword(password.trim(), account.password))) continue
        matchedManager = getManager(account.managerId)
        if (matchedManager) break
      }

      if (!matchedManager) {
        recordFailedLogin()
        setError('Incorrect store or password.')
        return
      }

      clearLoginAttempts()
      managerLogin(matchedManager.id)
      navigate('/manage')
    } finally {
      setLoading(false)
    }
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Field>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <Button type="submit" size="lg" pill disabled={loading} className="w-full">
            {loading ? 'Working…' : 'Log in as manager'}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  )
}
