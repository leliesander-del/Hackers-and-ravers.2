import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProfileSwitcher from '../components/ProfileSwitcher.jsx'

const AFDELINGEN = ['boodschappen', 'elektronica', 'sport', 'speelgoed']
const DIEETEN = ['glutenvrij', 'lactosevrij', 'vegetarisch', 'veganistisch', 'notenvrij']
const PRIJSKLASSEN = ['budget', 'middel', 'premium']

function toggle(arr, x) {
  return arr.includes(x) ? arr.filter((y) => y !== x) : [...arr, x]
}

function Veld({ label, value, onChange, type = 'text', placeholder }) {
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
  const { activeProfile, updateProfile, isEigenAccount, logout } = useStore()
  const navigate = useNavigate()
  const [nieuwMerk, setNieuwMerk] = useState('')

  const isGast = activeProfile.type === 'gast'
  const v = activeProfile.voorkeuren
  const persoon = activeProfile.persoon || {}

  function voegMerkToe() {
    const m = nieuwMerk.trim()
    if (!m || v.merken.includes(m)) return setNieuwMerk('')
    updateProfile({ voorkeuren: { merken: [...v.merken, m] } })
    setNieuwMerk('')
  }

  return (
    <div>
      <PageHeader title="Profiel" subtitle="Persoonsgegevens & voorkeuren" />

      <div className="space-y-5 px-4 py-4">
        {/* Profielkop */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: activeProfile.kleur }}
          >
            {activeProfile.naam[0]}
          </span>
          <div>
            <p className="font-bold text-slate-800">{activeProfile.naam}</p>
            <p className="text-xs text-slate-500">{activeProfile.omschrijving}</p>
          </div>
        </div>

        {!v ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
            {isGast
              ? 'Als gast bewaren we geen gegevens en personaliseren we niets. Log in met een klantenkaart om je profiel in te stellen.'
              : 'Dit profiel heeft geen persoonlijke voorkeuren om in te stellen.'}
          </div>
        ) : (
          <>
            {/* Persoonsgegevens */}
            <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Persoonsgegevens</h2>
              <Veld label="Naam" value={activeProfile.naam} onChange={(x) => updateProfile({ naam: x })} />
              <Veld label="E-mail" type="email" value={persoon.email} onChange={(x) => updateProfile({ persoon: { email: x } })} />
              <Veld label="Telefoon" value={persoon.telefoon} onChange={(x) => updateProfile({ persoon: { telefoon: x } })} />
              <Veld label="Adres" value={persoon.adres} onChange={(x) => updateProfile({ persoon: { adres: x } })} />
            </section>

            {/* Afdelingen */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Favoriete afdelingen</h2>
              <div className="flex flex-wrap gap-2">
                {AFDELINGEN.map((a) => {
                  const aan = v.afdelingen.includes(a)
                  return (
                    <button
                      key={a}
                      onClick={() => updateProfile({ voorkeuren: { afdelingen: toggle(v.afdelingen, a) } })}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                        aan ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {a}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Favoriete merken */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Favoriete merken</h2>
              <div className="flex flex-wrap gap-2">
                {v.merken.length ? (
                  v.merken.map((m) => (
                    <span key={m} className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-700">
                      {m}
                      <button
                        onClick={() => updateProfile({ voorkeuren: { merken: v.merken.filter((x) => x !== m) } })}
                        className="text-brand-400"
                        aria-label={`Verwijder ${m}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">Nog geen merken toegevoegd.</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={nieuwMerk}
                  onChange={(e) => setNieuwMerk(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && voegMerkToe()}
                  placeholder="Voeg een merk toe"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
                <button onClick={voegMerkToe} className="rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-95">
                  +
                </button>
              </div>
            </section>

            {/* Dieet */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Dieetwensen</h2>
              <div className="flex flex-wrap gap-2">
                {DIEETEN.map((d) => {
                  const aan = v.dieet.includes(d)
                  return (
                    <button
                      key={d}
                      onClick={() => updateProfile({ voorkeuren: { dieet: toggle(v.dieet, d) } })}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                        aan ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Prijsklasse */}
            <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-sm font-semibold text-slate-500">Prijsklasse</h2>
              <div className="flex gap-2">
                {PRIJSKLASSEN.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateProfile({ voorkeuren: { prijsklasse: p } })}
                    className={`flex-1 rounded-xl py-2 text-sm font-medium capitalize ${
                      v.prijsklasse === p ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Wissel profiel — alleen beschikbaar voor de demo-profielen, niet voor
            een echt ingelogd account. Wie met een eigen account is ingelogd,
            wisselt via uitloggen en opnieuw inloggen. */}
        {!isEigenAccount && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Wissel profiel</h2>
            <ProfileSwitcher />
          </section>
        )}

        <button
          onClick={() => {
            if (isEigenAccount) logout()
            navigate('/login')
          }}
          className="w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200 active:scale-[0.98]"
        >
          {isEigenAccount ? 'Uitloggen' : 'Naar inlogscherm'}
        </button>
      </div>
    </div>
  )
}
