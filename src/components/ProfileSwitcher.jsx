import { useStore } from '../context/StoreContext.jsx'
import { profiles } from '../data/profiles.js'

// Snel wisselen tussen profielen — hét demo-moment: de hele app verandert mee.
export default function ProfileSwitcher() {
  const { activeProfile, login } = useStore()

  // Personeel zit in een volledig gescheiden gedeelte; toon hier enkel klantprofielen.
  const klantprofielen = profiles.filter((p) => p.type !== 'bediende')

  return (
    <div className="grid grid-cols-3 gap-2">
      {klantprofielen.map((p) => {
        const actief = activeProfile.id === p.id
        return (
          <button
            key={p.id}
            onClick={() => login(p.id)}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition ${
              actief ? 'border-violet-500 bg-violet-50' : 'border-transparent bg-white'
            }`}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: p.kleur }}
            >
              {p.naam[0]}
            </span>
            <span className="text-sm font-semibold text-slate-700">{p.naam}</span>
            <span className="text-[10px] leading-tight text-slate-400">{p.omschrijving}</span>
          </button>
        )
      })}
    </div>
  )
}
