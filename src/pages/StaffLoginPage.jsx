import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, getAccounts } from '../context/StoreContext.jsx'
import {
  clearLoginAttempts,
  getLoginLockout,
  recordFailedLogin,
  verifyPassword,
} from '../lib/security.js'
import { AuthLayout, Button, Input, Card } from '../components/ui/index.js'

export default function StaffLoginPage() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    const lockout = getLoginLockout()
    if (lockout.locked) {
      setError(`Too many attempts. Try again in ${lockout.secondsLeft} seconds.`)
      return
    }

    setLoading(true)
    const emailLower = email.trim().toLowerCase()

    try {
      const account = getAccounts()[emailLower]
      if (
        !account ||
        account.role !== 'staff' ||
        !account.profileId ||
        !(await verifyPassword(password, account.password))
      ) {
        recordFailedLogin()
        setError('Incorrect staff credentials.')
        return
      }

      clearLoginAttempts()
      login(account.profileId, 'staff')
      navigate('/staff')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      logo={
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-lg shadow-brand-600/25">
          🏪
        </span>
      }
      title="Staff"
      subtitle="Shelf stocker or checkout clerk"
      footer={
        <Link to="/login" className="underline underline-offset-2 transition hover:text-brand-600">
          ← Back to customer login
        </Link>
      }
    >
      <Card className="p-6">
        <form onSubmit={handleLogin} className="space-y-3">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Staff email"
            aria-label="Staff email"
            autoComplete="email"
          />
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
          />

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">{error}</div>
          )}

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? 'Working…' : 'Log in'}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  )
}
