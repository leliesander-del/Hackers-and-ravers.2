import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProfileSwitcher from '../components/ProfileSwitcher.jsx'

function Chips({ titel, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-400">{titel}</p>
      <div className="flex flex-wrap gap-1">
        {items.map((x) => (
          <span key={x} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            {x}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function MorePage() {
  const { activeProfile } = useStore()
  const navigate = useNavigate()
  const v = activeProfile.voorkeuren

  return (
    <div>
      <PageHeader title="Meer" subtitle="Profiel & instellingen" />

      <div className="space-y-5 px-4 py-4">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Wissel profiel</h2>
          <ProfileSwitcher />
          <p className="mt-2 text-center text-xs text-slate-400">
            Wissel en zie hoe Home, zoekresultaten en deals meeveranderen.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
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

          {v ? (
            <div className="space-y-3">
              <Chips titel="Afdelingen" items={v.afdelingen} />
              <Chips titel="Favoriete merken" items={v.merken} />
              <Chips titel="Dieet" items={v.dieet} />
              <Chips titel="Prijsklasse" items={[v.prijsklasse]} />
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Als gast personaliseren we niets — winkels worden alleen op afstand getoond.
            </p>
          )}
        </section>

        <button
          onClick={() => navigate('/login')}
          className="w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-600"
        >
          Naar inlogscherm
        </button>
      </div>
    </div>
  )
}
