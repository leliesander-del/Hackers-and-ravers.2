import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
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

// Het centrale scherm van de app: je boodschappenlijst, met daarnaast de kok —
// een gesprek dat je voorkeuren uitvraagt en je lijst samenstelt. De lijst is
// winkel-onafhankelijk; `winkelsVoorLijst` (uit de context) berekent pas bij het
// tonen welke winkels de lijst kunnen leveren — de koppeling gebeurt bij "Start route".
export default function ListPage() {
  const { cart, winkelsVoorLijst, removeFromCart, clearCart, isAfgevinkt, toggleAfgevinkt } = useStore()
  const [tab, setTab] = useState('lijst')

  return (
    <div className="px-4 pb-6 pt-7">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Boodschappenlijst</h1>

      {/* Tab-switcher (pill-stijl) */}
      <div className="mb-5 flex gap-1 rounded-full bg-slate-100 p-1">
        {[
          { id: 'lijst', label: 'Lijst' },
          { id: 'kok', label: '✨ Kok' },
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

      {tab === 'lijst' && (
        <LijstTab
          cart={cart}
          winkels={winkelsVoorLijst}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          isAfgevinkt={isAfgevinkt}
          toggleAfgevinkt={toggleAfgevinkt}
          naarKok={() => setTab('kok')}
        />
      )}
      {tab === 'kok' && <KokTab naarLijst={() => setTab('lijst')} />}
    </div>
  )
}

function LijstTab({ cart, winkels, removeFromCart, clearCart, isAfgevinkt, toggleAfgevinkt, naarKok }) {
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <p className="text-5xl">📝</p>
          <p className="mt-3 text-slate-500">Je lijst is nog leeg.</p>
          <button
            onClick={naarKok}
            className="mt-5 w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            Praat met de kok
          </button>
          <button
            onClick={() => navigate('/store/ah-xl')}
            className="mt-2 w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200 active:scale-[0.98]"
          >
            Of blader door een winkel
          </button>
        </div>

        {/* Zelf producten opzoeken en toevoegen — ook handig als startpunt. */}
        <HandmatigToevoegen />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Eén platte boodschappenlijst van ingrediënten — nog niet aan een winkel
          gekoppeld. Producten/prijzen verschijnen pas bij de winkelkeuze. */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="mb-3 text-xs text-slate-400">
          {cart.length} {cart.length === 1 ? 'item' : 'items'} op je lijst
        </p>
        <ul className="space-y-1">
          {cart.map((it) => {
            const af = isAfgevinkt(it.key)
            return (
              <li key={it.key} className="flex items-center gap-3 py-1.5">
                <button
                  onClick={() => toggleAfgevinkt(it.key)}
                  aria-label={af ? 'Vink af' : 'Markeer als gepakt'}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                    af ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 text-transparent'
                  }`}
                >
                  ✓
                </button>
                <span className={`flex-1 text-sm ${af ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {it.label}
                </span>
                <button
                  onClick={() => removeFromCart(it.key)}
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

      {/* Zelf producten opzoeken en aan de lijst toevoegen. */}
      <HandmatigToevoegen />

      {/* Winkelkeuze: pas hier wordt de route gemaakt. De klant kiest waar hij
          naartoe gaat; StorePage bouwt dan de route uit zijn lijst voor die winkel. */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="mb-1 font-bold text-slate-800">Waar ga je naartoe?</p>
        <p className="mb-3 text-xs text-slate-400">
          Kies een winkel — dan matchen we je lijst met het assortiment en maken we de route.
        </p>
        {winkels.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
            Nog geen winkel gevonden die deze lijst kan leveren.
          </p>
        ) : (
          <div className="space-y-2">
            {winkels.map(({ store, aantal, totaal, totaalPrijs }) => (
              <button
                key={store.id}
                onClick={() => navigate(`/store/${store.id}`)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left ring-1 ring-slate-100 transition hover:ring-violet-300 active:scale-[0.98]"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: `${store.kleur}1a`, color: store.kleur }}
                >
                  {store.emoji}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{store.naam}</p>
                  <p className="text-xs text-slate-400">
                    {aantal} van {totaal} items beschikbaar · ± € {totaalPrijs.toFixed(2)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-violet-600">Start route →</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={clearCart}
        className="w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-[0.98]"
      >
        Lijst leegmaken
      </button>
    </div>
  )
}

// Laat de klant zelf producten opzoeken in het assortiment en handmatig aan de
// lijst toevoegen — naast de kok. We zoeken in alle winkels op naam, merk en
// categorie; toevoegen gebruikt dezelfde cart-logica, zodat de route- en
// winkelkeuze gewoon blijven werken.
function HandmatigToevoegen() {
  const { allProductsLive, addToCart, inCart } = useStore()
  const [zoek, setZoek] = useState('')

  const resultaten = useMemo(() => {
    const term = zoek.trim().toLowerCase()
    if (!term) return []
    return allProductsLive
      .filter((p) => !inCart(p.id))
      .filter((p) =>
        [p.naam, p.merk, p.categorie].some((v) => v?.toLowerCase().includes(term)),
      )
      .slice(0, 6)
  }, [zoek, allProductsLive, inCart])

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="mb-1 font-bold text-slate-800">Zelf iets toevoegen</p>
      <p className="mb-3 text-xs text-slate-400">Zoek een product en tik om het op je lijst te zetten.</p>

      <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-200 focus-within:ring-violet-300">
        <span className="text-slate-400">🔍</span>
        <input
          value={zoek}
          onChange={(e) => setZoek(e.target.value)}
          placeholder="Bijv. melk, pasta, kipfilet…"
          className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        {zoek && (
          <button
            onClick={() => setZoek('')}
            aria-label="Wissen"
            className="text-slate-300 transition hover:text-slate-500"
          >
            ✕
          </button>
        )}
      </div>

      {zoek.trim() && (
        <ul className="mt-3 space-y-1">
          {resultaten.length === 0 ? (
            <li className="px-1 py-2 text-sm text-slate-400">Geen product gevonden voor “{zoek.trim()}”.</li>
          ) : (
            resultaten.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    addToCart(p.id)
                    setZoek('')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left ring-1 ring-slate-100 transition hover:ring-violet-300 active:scale-[0.98]"
                >
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-800">{p.naam}</span>
                    <span className="block text-xs text-slate-400">
                      {p.merk} · € {p.prijs.toFixed(2)}
                    </span>
                  </span>
                  <span className="shrink-0 text-lg font-semibold text-violet-600">＋</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </section>
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
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-violet-100 px-4 py-2.5 text-sm italic text-violet-500">
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
                      ? 'bg-violet-600 text-white ring-violet-600'
                      : 'bg-white text-slate-600 ring-slate-200 hover:ring-violet-300'
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
              className="flex-1 rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98] disabled:opacity-40"
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
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-violet-300"
        >
          <input
            value={invoer}
            onChange={(e) => setInvoer(e.target.value)}
            placeholder="Typ je antwoord of wat je wil eten…"
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
                  ? 'bg-violet-600 text-white ring-violet-600'
                  : 'bg-white text-slate-600 ring-slate-200 hover:ring-violet-300'
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
          className="w-full rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98]"
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
    </div>
  )
}
