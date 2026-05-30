import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { STAPPEN, kiesProducten } from '../lib/vragenlijst.js'

// Het centrale scherm van de app: je boodschappenlijst, met daarnaast een
// vragenlijst die de lijst voor je samenstelt.
export default function ListPage() {
  const { cart, cartTotaal, activeProfile, removeFromCart, clearCart, addManyToCart, isAfgevinkt, toggleAfgevinkt } =
    useStore()
  const [tab, setTab] = useState('lijst')
  const [melding, setMelding] = useState(null)

  // Groepeer de lijst per winkel.
  const perWinkel = useMemo(() => {
    const m = new Map()
    for (const p of cart) {
      if (!m.has(p.storeId)) m.set(p.storeId, [])
      m.get(p.storeId).push(p)
    }
    return [...m.entries()]
  }, [cart])

  function naVragenlijst(ids) {
    addManyToCart(ids)
    setTab('lijst')
    setMelding(
      ids.length
        ? `✓ ${ids.length} ${ids.length === 1 ? 'product' : 'producten'} toegevoegd aan je lijst`
        : 'Geen producten gevonden voor deze keuzes.',
    )
    setTimeout(() => setMelding(null), 4000)
  }

  return (
    <div className="px-4 pb-6 pt-7">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Boodschappenlijst</h1>

      {/* Tab-switcher (pill-stijl) */}
      <div className="mb-5 flex gap-1 rounded-full bg-slate-100 p-1">
        {[
          { id: 'lijst', label: 'Lijst' },
          { id: 'vragenlijst', label: 'Vragenlijst' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {melding && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {melding}
        </div>
      )}

      {tab === 'lijst' ? (
        <LijstTab
          perWinkel={perWinkel}
          cartTotaal={cartTotaal}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          isAfgevinkt={isAfgevinkt}
          toggleAfgevinkt={toggleAfgevinkt}
          naarVragenlijst={() => setTab('vragenlijst')}
        />
      ) : (
        <VragenlijstTab profiel={activeProfile} onKlaar={naVragenlijst} />
      )}
    </div>
  )
}

function LijstTab({ perWinkel, cartTotaal, removeFromCart, clearCart, isAfgevinkt, toggleAfgevinkt, naarVragenlijst }) {
  const navigate = useNavigate()

  if (perWinkel.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
        <p className="text-5xl">📝</p>
        <p className="mt-3 text-slate-500">Je lijst is nog leeg.</p>
        <button
          onClick={naarVragenlijst}
          className="mt-5 w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
        >
          Stel je lijst samen
        </button>
        <button
          onClick={() => navigate('/store/ah-xl')}
          className="mt-2 w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200 active:scale-[0.98]"
        >
          Of blader door een winkel
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {perWinkel.map(([storeId, lijst]) => {
        const store = getStore(storeId)
        return (
          <section key={storeId} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ backgroundColor: `${store?.kleur}1a`, color: store?.kleur }}
              >
                {store?.emoji}
              </span>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{store?.naam}</p>
                <p className="text-xs text-slate-400">
                  {lijst.length} {lijst.length === 1 ? 'product' : 'producten'}
                </p>
              </div>
              <button
                onClick={() => navigate(`/store/${storeId}`)}
                className="shrink-0 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-200 active:scale-95"
              >
                Start route →
              </button>
            </div>

            <ul className="space-y-1">
              {lijst.map((p) => {
                const af = isAfgevinkt(p.id)
                return (
                  <li key={p.id} className="flex items-center gap-3 py-1.5">
                    <button
                      onClick={() => toggleAfgevinkt(p.id)}
                      aria-label={af ? 'Vink af' : 'Markeer als gepakt'}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                        af ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 text-transparent'
                      }`}
                    >
                      ✓
                    </button>
                    <span className={`flex-1 text-sm ${af ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {p.naam}
                    </span>
                    <span className="text-[11px] text-slate-400">{p.schaplocatie?.label}</span>
                    <button
                      onClick={() => removeFromCart(p.id)}
                      aria-label="Verwijderen"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <span className="text-slate-500">Totaal</span>
        <span className="text-xl font-bold text-violet-700">€ {cartTotaal.toFixed(2)}</span>
      </div>

      <button
        onClick={clearCart}
        className="w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-[0.98]"
      >
        Lijst leegmaken
      </button>
    </div>
  )
}

function VragenlijstTab({ profiel, onKlaar }) {
  const [stap, setStap] = useState(0)
  const [keuzes, setKeuzes] = useState(() => STAPPEN.map(() => null))

  function kies(categorieen) {
    const nieuw = [...keuzes]
    nieuw[stap] = categorieen
    setKeuzes(nieuw)

    if (stap < STAPPEN.length - 1) {
      setStap(stap + 1)
    } else {
      const alleCategorieen = nieuw.flat().filter(Boolean)
      onKlaar(kiesProducten(alleCategorieen, profiel))
      setStap(0)
      setKeuzes(STAPPEN.map(() => null))
    }
  }

  const huidige = STAPPEN[stap]

  return (
    <div>
      {/* Voortgangsbalk (4 streepjes) */}
      <div className="mb-5 flex gap-1.5">
        {STAPPEN.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stap ? 'bg-violet-600' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <p className="mb-1 text-xs font-medium text-violet-500">
        Stap {stap + 1} van {STAPPEN.length}
      </p>
      <h2 className="mb-4 text-lg font-bold text-slate-800">{huidige.titel}</h2>

      <div className="space-y-2">
        {huidige.opties.map((opt) => (
          <button
            key={opt.label}
            onClick={() => kies(opt.categorieen)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-violet-300 active:scale-[0.98]"
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="flex-1 font-medium text-slate-800">{opt.label}</span>
            <span className="text-slate-300">→</span>
          </button>
        ))}
      </div>

      {stap > 0 && (
        <button
          onClick={() => setStap(stap - 1)}
          className="mt-4 text-sm font-medium text-slate-400 transition hover:text-slate-600"
        >
          ← Vorige
        </button>
      )}
    </div>
  )
}
