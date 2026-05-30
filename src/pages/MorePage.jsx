import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'

const DEPARTMENTS = ['groceries', 'electronics', 'sport', 'toys']
const DEPARTMENT_LABELS = { groceries: 'Groceries', electronics: 'Electronics', sport: 'Sport', toys: 'Toys' }
const DIETS = ['gluten-free', 'lactose-free', 'vegetarian', 'vegan', 'nut-free']
const PRICE_TIERS = ['budget', 'mid', 'premium']
const PRICE_TIER_LABELS = { budget: 'Budget', mid: 'Mid', premium: 'Premium' }

function toggle(arr, x) {
  return arr.includes(x) ? arr.filter((y) => y !== x) : [...arr, x]
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
      <input
        type={type}
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400"
      />
    </label>
  )
}

export default function MorePage() {
  const { activeProfile, updateProfile, logout } = useStore()
  const navigate = useNavigate()
  const [newBrand, setNewBrand] = useState('')

  const isGuest = activeProfile.type === 'guest'
  const v = activeProfile.preferences
  const person = activeProfile.person || {}

  function addBrand() {
    const m = newBrand.trim()
    if (!m || v.brands.includes(m)) return setNewBrand('')
    updateProfile({ preferences: { brands: [...v.brands, m] } })
    setNewBrand('')
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Personal details & preferences" />

      <div className="space-y-5 px-4 py-4">
        {/* Profile header */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          {!isGuest ? (
            <Link to="/profile-photo" className="shrink-0 transition active:scale-95" aria-label="Change profile photo">
              <ProfileAvatar profile={activeProfile} size="md" />
            </Link>
          ) : (
            <ProfileAvatar profile={activeProfile} size="md" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800">{activeProfile.name}</p>
            <p className="text-xs text-slate-500">{activeProfile.description}</p>
            {!isGuest && (
              <Link to="/profile-photo" className="mt-1 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700">
                Change profile photo →
              </Link>
            )}
          </div>
        </div>

        {!v ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
            {isGuest
              ? 'As a guest we don\'t store any data and personalize nothing. Log in with a loyalty card to set up your profile.'
              : 'This profile has no personal preferences to configure.'}
          </div>
        ) : (
          <>
            {/* Personal details */}
            <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Personal details</h2>
              <Field label="Name" value={activeProfile.name} onChange={(x) => updateProfile({ name: x })} />
              <Field label="Email" type="email" value={person.email} onChange={(x) => updateProfile({ person: { email: x } })} />
              <Field label="Phone" value={person.phone} onChange={(x) => updateProfile({ person: { phone: x } })} />
              <Field label="Address" value={person.address} onChange={(x) => updateProfile({ person: { address: x } })} />
            </section>

            {/* Departments */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Favorite departments</h2>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((a) => {
                  const on = v.departments.includes(a)
                  return (
                    <button
                      key={a}
                      onClick={() => updateProfile({ preferences: { departments: toggle(v.departments, a) } })}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                        on ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {DEPARTMENT_LABELS[a] || a}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Favorite brands */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Favorite brands</h2>
              <div className="flex flex-wrap gap-2">
                {v.brands.length ? (
                  v.brands.map((m) => (
                    <span key={m} className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-700">
                      {m}
                      <button
                        onClick={() => updateProfile({ preferences: { brands: v.brands.filter((x) => x !== m) } })}
                        className="text-brand-400"
                        aria-label={`Remove ${m}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No brands added yet.</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBrand()}
                  placeholder="Add a brand"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
                <button onClick={addBrand} className="rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-95">
                  +
                </button>
              </div>
            </section>

            {/* Diet */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Dietary preferences</h2>
              <div className="flex flex-wrap gap-2">
                {DIETS.map((d) => {
                  const on = v.diet.includes(d)
                  return (
                    <button
                      key={d}
                      onClick={() => updateProfile({ preferences: { diet: toggle(v.diet, d) } })}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                        on ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Price tier */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Price tier</h2>
              <div className="flex gap-2">
                {PRICE_TIERS.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateProfile({ preferences: { priceTier: p } })}
                    className={`flex-1 rounded-xl py-2 text-sm font-medium ${
                      v.priceTier === p ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {PRICE_TIER_LABELS[p] || p}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="w-full rounded-full bg-brand-100 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-200 active:scale-[0.98]"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
