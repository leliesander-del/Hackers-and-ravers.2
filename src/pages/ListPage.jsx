import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores, afstandTotGebruiker } from '../data/stores.js'
import StoreLogo from '../components/StoreLogo.jsx'
import {
  BEGROETING,
  THEMAS,
  VOORBEELDEN,
  gerechtenVoorThemas,
  ingredientenVoorGerechten,
  verwerkBericht,
} from '../lib/assistent.js'
import { useSpraak } from '../lib/useSpraak.js'

// Het centrale scherm van de app: je boodschappenlijst, met daarnaast een
// vragenlijst die de lijst voor je samenstelt. De lijst is winkel-onafhankelijk;
// `winkelsVoorLijst` (uit de context) berekent pas bij het tonen welke winkels
// de lijst kunnen leveren — de echte koppeling gebeurt bij "Start route".
export default function ListPage() {
  const { addIngredients } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('winkels')

  return (
    <div className="px-4 pb-6 pt-7">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Home</h1>

      {/* Tab-switcher (pill-stijl) */}
      <div className="mb-5 flex gap-1 rounded-full bg-slate-100 p-1">
        {[
          { id: 'winkels', label: 'Winkels' },
          { id: 'assistent', label: '✨ Sparren' },
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

      {tab === 'winkels' && <WinkelsTab />}
      {tab === 'assistent' && (
        <AssistentTab addIngredients={addIngredients} naarLijst={() => navigate('/mandje')} />
      )}
    </div>
  )
}

// De winkels gesorteerd op afstand tot de gebruiker, met logo, straat en afstand.
// Tik op een winkel om het assortiment te bekijken en een route te starten.
function WinkelsTab() {
  const navigate = useNavigate()
  const gesorteerd = useMemo(
    () =>
      stores
        .map((s) => ({ ...s, _afstand: afstandTotGebruiker(s) }))
        .sort((a, b) => a._afstand - b._afstand),
    [],
  )

  return (
    <div className="space-y-2">
      {gesorteerd.map((s) => (
        <button
          key={s.id}
          onClick={() => navigate(`/store/${s.id}`)}
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-violet-300 active:scale-[0.98]"
        >
          <StoreLogo store={s} sizeClass="h-12 w-12" emojiClass="text-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-800">{s.naam}</p>
            <p className="truncate text-xs text-slate-500">{s.straat}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-violet-600">{s._afstand} km</p>
            <p className="text-[11px] text-slate-400">{s.type}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// Twee brede stappen: eerst een sfeer/thema kiezen, dan concrete gerechten.
// Uit de gekozen gerechten halen we de ingrediënten en zetten die op de lijst.
function VragenlijstTab({ onKlaar }) {
  const [stap, setStap] = useState(0) // 0 = thema's, 1 = gerechten
  const [themas, setThemas] = useState([])
  const [gerechten, setGerechten] = useState([])

  const voorgesteld = useMemo(() => gerechtenVoorThemas(themas), [themas])

  function toggle(lijst, set, item) {
    set(lijst.includes(item) ? lijst.filter((x) => x !== item) : [...lijst, item])
  }

  function rondAf() {
    const gekozenRecepten = voorgesteld.filter((r) => gerechten.includes(r.naam))
    const { termen } = ingredientenVoorGerechten(gekozenRecepten)
    onKlaar(termen)
    setStap(0)
    setThemas([])
    setGerechten([])
  }

  return (
    <div>
      {/* Voortgangsbalk (2 stappen) */}
      <div className="mb-5 flex gap-1.5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stap ? 'bg-violet-600' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <p className="mb-1 text-xs font-medium text-violet-500">Stap {stap + 1} van 2</p>

      {stap === 0 ? (
        <>
          <h2 className="mb-1 text-lg font-bold text-slate-800">Waar heb je deze week zin in?</h2>
          <p className="mb-4 text-sm text-slate-400">Kies één of meer sferen — we stellen er gerechten bij voor.</p>

          <div className="grid grid-cols-2 gap-2">
            {THEMAS.map((t) => {
              const aan = themas.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggle(themas, setThemas, t.id)}
                  className={`flex items-center gap-2.5 rounded-2xl p-4 text-left shadow-sm ring-1 transition active:scale-[0.98] ${
                    aan ? 'bg-violet-600 text-white ring-violet-600' : 'bg-white text-slate-800 ring-slate-100 hover:ring-violet-300'
                  }`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="flex-1 text-sm font-medium">{t.label}</span>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setStap(1)}
            className="mt-5 w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            {themas.length ? 'Toon gerechten →' : 'Toon alle gerechten →'}
          </button>
        </>
      ) : (
        <>
          <h2 className="mb-1 text-lg font-bold text-slate-800">Welke gerechten wil je maken?</h2>
          <p className="mb-4 text-sm text-slate-400">
            Tik de gerechten aan — we voegen automatisch de juiste ingrediënten toe.
          </p>

          <div className="space-y-2">
            {voorgesteld.map((r) => {
              const aan = gerechten.includes(r.naam)
              return (
                <button
                  key={r.naam}
                  onClick={() => toggle(gerechten, setGerechten, r.naam)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left shadow-sm ring-1 transition active:scale-[0.98] ${
                    aan ? 'bg-violet-50 ring-violet-400' : 'bg-white ring-slate-100 hover:ring-violet-300'
                  }`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="flex-1 font-medium capitalize text-slate-800">{r.naam}</span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                      aan ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              )
            })}
          </div>

          <button
            onClick={rondAf}
            disabled={!gerechten.length}
            className="mt-5 w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98] disabled:opacity-40"
          >
            {gerechten.length ? `Voeg ingrediënten toe (${gerechten.length})` : 'Kies eerst een gerecht'}
          </button>

          <button
            onClick={() => setStap(0)}
            className="mt-4 text-sm font-medium text-slate-400 transition hover:text-slate-600"
          >
            ← Andere sfeer
          </button>
        </>
      )}
    </div>
  )
}

// Chat + voice-first assistent. Je typt of spreekt wat je wil eten/koken; de
// assistent zet de bijbehorende ingrediënten automatisch op je lijst.
function AssistentTab({ addIngredients, naarLijst, startVragenlijst, onVragenlijstGestart }) {
  const [berichten, setBerichten] = useState(() => [{ rol: 'ai', tekst: BEGROETING }])
  const [invoer, setInvoer] = useState('')
  const [voorlezen, setVoorlezen] = useState(false)
  const [aantalToegevoegd, setAantalToegevoegd] = useState(0)
  // De vragenlijst leeft nu binnen Sparren: een begeleide manier om de lijst te
  // vullen, naast vrij typen of inspreken.
  const [toonVragenlijst, setToonVragenlijst] = useState(() => Boolean(startVragenlijst))
  const scrollRef = useRef(null)

  // Geopend vanuit de lijst-knop? Meld terug zodat het maar één keer auto-opent.
  useEffect(() => {
    if (startVragenlijst) onVragenlijstGestart?.()
  }, [startVragenlijst, onVragenlijstGestart])

  // Resultaat van de vragenlijst belandt als bevestiging in het gesprek.
  function vragenlijstKlaar(termen) {
    if (termen.length) {
      addIngredients(termen)
      setAantalToegevoegd((n) => n + termen.length)
    }
    setBerichten((b) => [
      ...b,
      { rol: 'gebruiker', tekst: 'Ik heb de vragenlijst ingevuld.' },
      {
        rol: 'ai',
        tekst: termen.length
          ? `Top! Ik heb ${termen.length} ${termen.length === 1 ? 'ingrediënt' : 'ingrediënten'} op je lijst gezet. Wil je er nog iets bij?`
          : 'Er kwamen geen ingrediënten uit die keuzes. Vertel me gerust waar je zin in hebt.',
      },
    ])
    setToonVragenlijst(false)
  }

  // Eén plek waar elk bericht (getypt of ingesproken) doorheen gaat.
  function stuur(rauweTekst) {
    const tekst = (rauweTekst ?? '').trim()
    if (!tekst) return
    setInvoer('')

    const resultaat = verwerkBericht(tekst)
    if (resultaat.items.length) {
      addIngredients(resultaat.items.map((i) => i.key))
      setAantalToegevoegd((n) => n + resultaat.items.length)
    }

    setBerichten((b) => [
      ...b,
      { rol: 'gebruiker', tekst },
      { rol: 'ai', tekst: resultaat.antwoord, items: resultaat.items, suggesties: resultaat.suggesties },
    ])
    if (voorlezen) spreek(resultaat.antwoord)
  }

  const { ondersteund, luistert, tussentijds, startLuisteren, stopLuisteren, spreek, stopSpreken } = useSpraak({
    onResultaat: stuur,
  })

  // Scroll mee met nieuwe berichten.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [berichten, tussentijds])

  // Zet de stem stil als je het tabblad verlaat.
  useEffect(() => () => stopSpreken(), [stopSpreken])

  const laatsteAi = [...berichten].reverse().find((m) => m.rol === 'ai')

  // Begeleide vragenlijst neemt het scherm over zolang ze open staat.
  if (toonVragenlijst) {
    return (
      <div>
        <button
          onClick={() => setToonVragenlijst(false)}
          className="mb-4 text-sm font-medium text-slate-400 transition hover:text-slate-600"
        >
          ← Terug naar sparren
        </button>
        <VragenlijstTab onKlaar={vragenlijstKlaar} />
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 13rem)' }}>
      {/* Gesprek */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3">
        {berichten.map((m, i) => (
          <Bericht key={i} bericht={m} />
        ))}

        {luistert && (
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-violet-100 px-4 py-2.5 text-sm italic text-violet-500">
            {tussentijds || 'Aan het luisteren…'}
          </div>
        )}

        {/* Begeleide vragenlijst als alternatief voor vrij typen/inspreken */}
        {berichten.length === 1 && (
          <button
            onClick={() => setToonVragenlijst(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-violet-50 p-3 text-left ring-1 ring-violet-200 transition hover:bg-violet-100 active:scale-[0.98]"
          >
            <span className="text-xl">📝</span>
            <span className="flex-1 text-sm font-semibold text-violet-700">
              Liever begeleid? Stel je lijst samen met een paar vragen
            </span>
            <span className="text-violet-400">→</span>
          </button>
        )}

        {/* Voorbeelden onder de begroeting */}
        {berichten.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {VOORBEELDEN.map((v) => (
              <button
                key={v}
                onClick={() => stuur(v)}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:ring-violet-300 active:scale-95"
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Snelle vervolg-suggesties van de assistent */}
        {laatsteAi?.suggesties?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {laatsteAi.suggesties.map((s) => (
              <button
                key={s}
                onClick={() => stuur(s)}
                className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-100 active:scale-95"
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {aantalToegevoegd > 0 && (
        <button
          onClick={naarLijst}
          className="mb-2 w-full rounded-full bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 active:scale-[0.98]"
        >
          ✓ {aantalToegevoegd} toegevoegd · bekijk je lijst →
        </button>
      )}

      {/* Invoerbalk */}
      <div className="flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            stuur(invoer)
          }}
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-violet-300"
        >
          <input
            value={invoer}
            onChange={(e) => setInvoer(e.target.value)}
            placeholder="Typ wat je wil eten of nodig hebt…"
            className="flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!invoer.trim()}
            aria-label="Versturen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 active:scale-95 disabled:opacity-40"
          >
            ↑
          </button>
        </form>

        {ondersteund && (
          <button
            onClick={luistert ? stopLuisteren : startLuisteren}
            aria-label={luistert ? 'Stop met luisteren' : 'Spreek in'}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg shadow-sm transition active:scale-95 ${
              luistert
                ? 'animate-pulse bg-rose-500 text-white ring-4 ring-rose-200'
                : 'bg-white text-violet-600 ring-1 ring-slate-200 hover:ring-violet-300'
            }`}
          >
            🎤
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={voorlezen}
            onChange={(e) => {
              setVoorlezen(e.target.checked)
              if (!e.target.checked) stopSpreken()
            }}
            className="h-3.5 w-3.5 accent-violet-600"
          />
          Antwoorden voorlezen
        </label>
        {!ondersteund && <span className="text-xs text-slate-300">Spraak niet ondersteund in deze browser</span>}
      </div>
    </div>
  )
}

function Bericht({ bericht }) {
  if (bericht.rol === 'gebruiker') {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-2.5 text-sm text-white">
        {bericht.tekst}
      </div>
    )
  }
  return (
    <div className="mr-auto max-w-[90%] space-y-2">
      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
        <span className="mr-1.5">✨</span>
        {bericht.tekst}
      </div>
      {bericht.items?.length > 0 && (
        <ul className="ml-1 space-y-1">
          {bericht.items.map((it) => (
            <li key={it.key} className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-500">＋</span>
              {it.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
