import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores, afstandTotGebruiker } from '../data/stores.js'
import StoreLogo from '../components/StoreLogo.jsx'
import {
  KOK_BEGROETING,
  KOK_VRAGEN,
  kokReactie,
  herkenKeuzes,
  rangschikRecepten,
  ingredientenVoorGerechten,
  verwerkBericht,
} from '../lib/assistent.js'
import { useSpraak } from '../lib/useSpraak.js'

// Kleine hulp: "a, b en c".
function lijstZin(items) {
  const arr = (items || []).filter(Boolean)
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  return `${arr.slice(0, -1).join(', ')} en ${arr[arr.length - 1]}`
}

// De home: bovenaan een keuze tussen de winkels (op afstand), daarnaast de kok —
// een gesprek dat je voorkeuren uitvraagt en je lijst samenstelt. De lijst zelf
// (ingrediënten + producten) leeft op de Mandje-pagina.
export default function ListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('winkels')

  return (
    <div className="px-4 pb-6 pt-7">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Home</h1>

      {/* Tab-switcher (pill-stijl) */}
      <div className="mb-5 flex gap-1 rounded-full bg-slate-100 p-1">
        {[
          { id: 'winkels', label: 'Winkels' },
          { id: 'kok', label: '✨ Kok' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'winkels' && <WinkelsTab />}
      {tab === 'kok' && <KokTab naarLijst={() => navigate('/mandje')} />}
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
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-brand-300 active:scale-[0.98]"
        >
          <StoreLogo store={s} sizeClass="h-12 w-12" emojiClass="text-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-800">{s.naam}</p>
            <p className="truncate text-xs text-slate-500">{s.straat}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-brand-600">{s._afstand} km</p>
            <p className="text-[11px] text-slate-400">{s.type}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// De kok: één gesprek dat de vroegere vragenlijst én het sparren samenbrengt.
// De kok vraagt stap voor stap door (tijd → personen → keuken → moment →
// ingrediënten → vermijden), stelt dan passende echte recepten voor en zet de
// ingrediënten op je lijst. Je kan altijd zelf vrij typen of inspreken; de kok
// herkent gerechten/ingrediënten én blijft doorvragen.
function KokTab({ naarLijst }) {
  const { activeProfile, addIngredients } = useStore()

  const [berichten, setBerichten] = useState(() => [
    { rol: 'ai', tekst: KOK_BEGROETING },
    { rol: 'ai', tekst: KOK_VRAGEN[0].vraag },
  ])
  const [antwoorden, setAntwoorden] = useState({})
  const [vraagIndex, setVraagIndex] = useState(0)
  const [fase, setFase] = useState('vragen') // 'vragen' | 'gerechten' | 'klaar'
  const [pendingMulti, setPendingMulti] = useState([])
  const [voorgesteld, setVoorgesteld] = useState([])
  const [gekozenGerechten, setGekozenGerechten] = useState([])
  const [aantalToegevoegd, setAantalToegevoegd] = useState(0)
  const [invoer, setInvoer] = useState('')
  const [voorlezen, setVoorlezen] = useState(false)
  const scrollRef = useRef(null)

  const huidigeVraag = fase === 'vragen' ? KOK_VRAGEN[vraagIndex] : null

  // Sla een antwoord op, reageer als een kok en ga door naar de volgende vraag
  // of (na de laatste vraag) naar de gerechtenvoorstellen. Pusht zelf géén
  // gebruikersbubbel — de aanroeper doet dat (chip-keuze of vrije tekst).
  function verwerkAntwoord(vraag, ids) {
    const labels = ids.map((id) => vraag.opties.find((o) => o.id === id)?.label).filter(Boolean)
    const nieuw = { ...antwoorden, [vraag.key]: vraag.multi ? ids : ids[0] || '' }
    setAntwoorden(nieuw)
    setPendingMulti([])

    const reactie = kokReactie(vraag.key, labels)
    setBerichten((b) => [...b, { rol: 'ai', tekst: reactie }])

    const volgende = vraagIndex + 1
    if (volgende < KOK_VRAGEN.length) {
      setVraagIndex(volgende)
      setBerichten((b) => [...b, { rol: 'ai', tekst: KOK_VRAGEN[volgende].vraag }])
      if (voorlezen) spreek(`${reactie} ${KOK_VRAGEN[volgende].vraag}`)
    } else {
      toonGerechten(nieuw)
      if (voorlezen) spreek(reactie)
    }
  }

  // Stel concrete recepten voor op basis van de antwoorden + dieet/prijs uit het
  // profiel, via dezelfde rangschik-functie als de aanmeldvragenlijst.
  function toonGerechten(antw) {
    const lijst = rangschikRecepten({
      ...antw,
      dieet: activeProfile?.voorkeuren?.dieet || [],
      prijsklasse: activeProfile?.voorkeuren?.prijsklasse || '',
    }).slice(0, 6)
    setVoorgesteld(lijst)
    setVraagIndex(KOK_VRAGEN.length)
    setFase('gerechten')
    const tekst = lijst.length
      ? 'Op basis van je antwoorden zou ik dit aanraden. Tik aan wat je lekker lijkt, dan zet ik de ingrediënten op je lijst:'
      : 'Hmm, met deze combinatie vind ik niets passends. Begin gerust opnieuw en versoepel een keuze.'
    setBerichten((b) => [...b, { rol: 'ai', tekst }])
  }

  function toggleGerecht(naam) {
    setGekozenGerechten((prev) => (prev.includes(naam) ? prev.filter((x) => x !== naam) : [...prev, naam]))
  }

  function bevestigGerechten() {
    const gekozen = voorgesteld.filter((r) => gekozenGerechten.includes(r.naam))
    if (!gekozen.length) return
    const { termen } = ingredientenVoorGerechten(gekozen)
    if (termen.length) {
      addIngredients(termen)
      setAantalToegevoegd((n) => n + termen.length)
    }
    const namen = gekozen.map((r) => r.naam)
    const tekst = `Top! Voor ${lijstZin(namen)} zette ik ${termen.length} ${
      termen.length === 1 ? 'ingrediënt' : 'ingrediënten'
    } op je lijst. Smakelijk! 🍳`
    setBerichten((b) => [...b, { rol: 'gebruiker', tekst: lijstZin(namen) }, { rol: 'ai', tekst }])
    setFase('klaar')
    if (voorlezen) spreek(tekst)
  }

  function herbegin() {
    setAntwoorden({})
    setPendingMulti([])
    setVoorgesteld([])
    setGekozenGerechten([])
    setVraagIndex(0)
    setFase('vragen')
    setBerichten([{ rol: 'ai', tekst: KOK_VRAGEN[0].vraag }])
  }

  // Eén plek waar elk vrij bericht (getypt of ingesproken) doorheen gaat.
  function stuur(rauweTekst) {
    const tekst = (rauweTekst ?? '').trim()
    if (!tekst) return
    setInvoer('')
    setBerichten((b) => [...b, { rol: 'gebruiker', tekst }])

    if (fase === 'vragen' && huidigeVraag) {
      // 1. Past het antwoord op de huidige vraag? ("snel", "iets met kip")
      const herkend = herkenKeuzes(huidigeVraag.opties, tekst)
      if (herkend.length) {
        verwerkAntwoord(huidigeVraag, herkend.map((o) => o.id))
        return
      }
      // 2. Noemt de klant spontaan een gerecht/ingrediënt? Voeg toe en vraag verder.
      const res = verwerkBericht(tekst)
      if (res.items.length) {
        addIngredients(res.items.map((i) => i.key))
        setAantalToegevoegd((n) => n + res.items.length)
        setBerichten((b) => [...b, { rol: 'ai', tekst: `${res.antwoord} ${huidigeVraag.vraag}` }])
        if (voorlezen) spreek(res.antwoord)
        return
      }
      // 3. Niets herkend — vriendelijk de vraag herhalen.
      setBerichten((b) => [...b, { rol: 'ai', tekst: `Dat snap ik even niet. ${huidigeVraag.vraag}` }])
      return
    }

    // Fase 'gerechten'/'klaar': vrij toevoegen via de assistent-herkenning.
    const res = verwerkBericht(tekst)
    if (res.items.length) {
      addIngredients(res.items.map((i) => i.key))
      setAantalToegevoegd((n) => n + res.items.length)
    }
    setBerichten((b) => [...b, { rol: 'ai', tekst: res.antwoord }])
    if (voorlezen) spreek(res.antwoord)
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

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 13rem)' }}>
      {/* Gesprek */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3">
        {berichten.map((m, i) => (
          <Bericht key={i} bericht={m} />
        ))}

        {luistert && (
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-100 px-4 py-2.5 text-sm italic text-brand-500">
            {tussentijds || 'Aan het luisteren…'}
          </div>
        )}
      </div>

      {/* Interactief paneel: quick-replies bij de huidige vraag, of de
          gerechtenkeuze, of de afrondingsknoppen. */}
      {fase === 'vragen' && huidigeVraag && (
        <QuickReplies
          vraag={huidigeVraag}
          pending={pendingMulti}
          onKies={(id) => {
            setBerichten((b) => [...b, { rol: 'gebruiker', tekst: huidigeVraag.opties.find((o) => o.id === id)?.label }])
            verwerkAntwoord(huidigeVraag, [id])
          }}
          onToggle={(id) =>
            setPendingMulti((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
          }
          onKlaar={() => {
            const labels = pendingMulti.map((id) => huidigeVraag.opties.find((o) => o.id === id)?.label)
            setBerichten((b) => [...b, { rol: 'gebruiker', tekst: labels.length ? lijstZin(labels) : 'Geen voorkeur' }])
            verwerkAntwoord(huidigeVraag, pendingMulti)
          }}
        />
      )}

      {fase === 'gerechten' && (
        <div className="mb-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            {voorgesteld.map((r) => {
              const aan = gekozenGerechten.includes(r.naam)
              return (
                <button
                  key={r.naam}
                  onClick={() => toggleGerecht(r.naam)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ring-1 transition active:scale-95 ${
                    aan
                      ? 'bg-brand-600 text-white ring-brand-600'
                      : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-300'
                  }`}
                >
                  {r.emoji} {r.naam} · {r.tijd}m
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={bevestigGerechten}
              disabled={!gekozenGerechten.length}
              className="flex-1 rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-40"
            >
              {gekozenGerechten.length ? `Zet op mijn lijst (${gekozenGerechten.length})` : 'Kies een gerecht'}
            </button>
            <button
              onClick={herbegin}
              className="rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-95"
            >
              Opnieuw
            </button>
          </div>
        </div>
      )}

      {fase === 'klaar' && (
        <div className="mb-2 flex gap-2">
          <button
            onClick={naarLijst}
            className="flex-1 rounded-full bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 active:scale-[0.98]"
          >
            ✓ {aantalToegevoegd} toegevoegd · bekijk je lijst →
          </button>
          <button
            onClick={herbegin}
            className="rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-95"
          >
            Nog een gerecht
          </button>
        </div>
      )}

      {/* "Bekijk lijst"-snelkoppeling zodra er iets is toegevoegd tijdens het gesprek */}
      {fase !== 'klaar' && aantalToegevoegd > 0 && (
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
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-brand-300"
        >
          <input
            value={invoer}
            onChange={(e) => setInvoer(e.target.value)}
            placeholder="Typ je antwoord of wat je wil eten…"
            aria-label="Bericht aan de kok"
            className="flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!invoer.trim()}
            aria-label="Versturen"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 active:scale-95 disabled:opacity-40"
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
                : 'bg-white text-brand-600 ring-1 ring-slate-200 hover:ring-brand-300'
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
            className="h-3.5 w-3.5 accent-brand-600"
          />
          Antwoorden voorlezen
        </label>
        {!ondersteund && <span className="text-xs text-slate-300">Spraak niet ondersteund in deze browser</span>}
      </div>
    </div>
  )
}

// Quick-reply-chips voor de huidige kok-vraag. Bij één keuze antwoordt een tik
// meteen; bij meerdere keuzes verzamel je eerst en bevestig je met "Klaar".
function QuickReplies({ vraag, pending, onKies, onToggle, onKlaar }) {
  return (
    <div className="mb-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        {vraag.opties.map((o) => {
          const aan = vraag.multi && pending.includes(o.id)
          return (
            <button
              key={o.id}
              onClick={() => (vraag.multi ? onToggle(o.id) : onKies(o.id))}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition active:scale-95 ${
                aan
                  ? 'bg-brand-600 text-white ring-brand-600'
                  : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-300'
              }`}
            >
              {o.emoji} {o.label}
            </button>
          )
        })}
      </div>
      {vraag.multi && (
        <button
          onClick={onKlaar}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
        >
          {pending.length ? `Klaar (${pending.length})` : vraag.overslaan ? 'Sla over' : 'Geen voorkeur'}
        </button>
      )}
    </div>
  )
}

function Bericht({ bericht }) {
  if (bericht.rol === 'gebruiker') {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm text-white">
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
    </div>
  )
}
