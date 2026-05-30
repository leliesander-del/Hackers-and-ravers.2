import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Compass } from '../components/icons.jsx'
import { useStore, getAccounts, saveAccount } from '../context/StoreContext.jsx'
import { Button, Input } from '../components/ui/index.js'
import {
  RECEPTEN,
  THEMAS,
  MAALTIJDEN,
  BASIS_INGREDIENTEN,
  KOOKTIJD_OPTIES,
  rangschikRecepten,
  ingredientenVoorGerechten,
} from '../lib/assistent.js'

const DIEET_OPTIES = ['Glutenvrij', 'Lactosevrij', 'Vegetarisch', 'Veganistisch', 'Suikervrij']
const PRIJS_OPTIES = ['Budget', 'Middenklasse', 'Premium']

// Stap 2 — voor hoeveel personen kook je? (breed, één keuze)
const PERSONEN_OPTIES = [
  { id: '1', label: 'Voor mezelf', sub: '1 persoon', emoji: '🧑' },
  { id: '2', label: "Met z'n tweeën", sub: '2 personen', emoji: '👫' },
  { id: '3-4', label: 'Klein gezin', sub: '3 – 4 personen', emoji: '👨‍👩‍👧' },
  { id: '5+', label: 'Groot gezin', sub: '5+ personen', emoji: '👨‍👩‍👧‍👦' },
]

// Stap 2 — hoe vaak kook je per week? (één keuze)
const FREQUENTIE_OPTIES = [
  { id: '1-2', label: '1 – 2×', sub: 'per week', emoji: '🗓️' },
  { id: '3-4', label: '3 – 4×', sub: 'per week', emoji: '📅' },
  { id: '5-7', label: '5 – 7×', sub: 'bijna dagelijks', emoji: '🔥' },
]

const WINKELS = [
  { id: 'colruyt', naam: 'Colruyt', emoji: '🛒', kleur: 'bg-red-600' },
  { id: 'delhaize', naam: 'Delhaize', emoji: '🦁', kleur: 'bg-green-600' },
  { id: 'carrefour', naam: 'Carrefour', emoji: '🛍️', kleur: 'bg-blue-600' },
  { id: 'aldi', naam: 'Aldi', emoji: '🏷️', kleur: 'bg-slate-600' },
  { id: 'lidl', naam: 'Lidl', emoji: '🌻', kleur: 'bg-yellow-500' },
]

const STAP_TITELS = [
  'Account',
  'Huishouden',
  'Kooktijd',
  'Keukenstijl',
  'Maaltijd',
  'Ingrediënten',
  'Vermijden',
  'Dieet & prijs',
  'Gerechten',
  'Winkels',
]
const AANTAL_STAPPEN = STAP_TITELS.length
// Vaste merk-accentkleur (violet) voor nieuwe accounts.
const ACCENT_KLEUR = '#7c3aed'
const DEMO_EMAILS = ['sander@neverlost.be', 'marc@neverlost.be', 'gast@neverlost.be']

function CheckBadge() {
  return (
    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600">
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
    </span>
  )
}

// Sectiekop binnen een stap.
function VeldKop({ titel }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{titel}</p>
}

// Herbruikbaar raster van keuzekaarten met emoji + label (+ optioneel subtekst).
// `enkel` = één keuze (radio-gedrag), anders meervoudige selectie.
function KaartGrid({ opties, geselecteerd, onToggle, kolommen = 2, enkel = false }) {
  const isAan = (id) => (enkel ? geselecteerd === id : geselecteerd.includes(id))
  return (
    <div className={`grid gap-2 ${kolommen === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {opties.map((o) => {
        const aan = isAan(o.id)
        return (
          <button
            key={o.id}
            onClick={() => onToggle(o.id)}
            className={`relative rounded-xl px-3 py-4 text-left transition active:scale-[0.97] ${
              aan ? 'bg-brand-50 ring-2 ring-brand-400' : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {aan && <CheckBadge />}
            <span className="mb-1.5 block text-2xl">{o.emoji}</span>
            <span className="block text-sm font-medium leading-tight text-slate-800">{o.label}</span>
            {o.sub && <span className="mt-0.5 block text-xs text-slate-400">{o.sub}</span>}
          </button>
        )
      })}
    </div>
  )
}

// Herbruikbare rij van pill-knoppen (meervoudige selectie).
function PillGroep({ opties, geselecteerd, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opties.map((o) => {
        const id = typeof o === 'string' ? o : o.id
        const label = typeof o === 'string' ? o : o.label
        const emoji = typeof o === 'string' ? null : o.emoji
        const aan = geselecteerd.includes(id)
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97] ${
              aan
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
            }`}
          >
            {emoji && <span className="mr-1">{emoji}</span>}
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function SignupPage() {
  const { login, addIngredients } = useStore()
  const navigate = useNavigate()
  const [stap, setStap] = useState(1)
  const [fout, setFout] = useState('')

  // Stap 1 — account
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')

  // Stap 2 — huishouden
  const [personen, setPersonen] = useState('')
  const [frequentie, setFrequentie] = useState('')

  // Stap 3 — hoelang wil je koken?
  const [kooktijd, setKooktijd] = useState('')

  // Stap 4 — keukenstijl (thema's uit de echte recepten)
  const [themas, setThemas] = useState([])

  // Stap 5 — maaltijdmoment
  const [maaltijden, setMaaltijden] = useState([])

  // Stap 6 — met welke ingrediënten
  const [ingredienten, setIngredienten] = useState([])

  // Stap 7 — wat liever vermijden
  const [vermijden, setVermijden] = useState([])

  // Stap 8 — dieet & prijsklasse
  const [dieet, setDieet] = useState([])
  const [prijsklasse, setPrijsklasse] = useState('')

  // Stap 9 — favoriete gerechten
  const [gerechten, setGerechten] = useState([])

  // Stap 10 — favoriete winkels
  const [winkels, setWinkels] = useState([])

  // Gerechten komen rechtstreeks uit de echte recepten via de gedeelde
  // rangschik-functie (assistent.js) — dezelfde die de kok-chat gebruikt.
  const gerechtenGefilterd = useMemo(
    () => rangschikRecepten({ dieet, kooktijd, vermijden, themas, maaltijden, ingredienten, prijsklasse }),
    [dieet, kooktijd, vermijden, themas, maaltijden, ingredienten, prijsklasse],
  )

  function toggleIn(setter) {
    return (item) => setter((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))
  }
  const toggleDieet = toggleIn(setDieet)
  const toggleThema = toggleIn(setThemas)
  const toggleMaaltijd = toggleIn(setMaaltijden)
  const toggleIngredient = toggleIn(setIngredienten)
  const toggleVermijden = toggleIn(setVermijden)
  const toggleGerecht = toggleIn(setGerechten)
  const toggleWinkel = toggleIn(setWinkels)

  function valideerStap() {
    if (stap === 1) {
      if (!naam.trim()) return 'Vul je naam in.'
      if (!email.trim()) return 'Vul je e-mailadres in.'
      if (!wachtwoord) return 'Vul een wachtwoord in.'
      if (wachtwoord.length < 4) return 'Wachtwoord moet minimaal 4 tekens bevatten.'
      const emailLower = email.trim().toLowerCase()
      if (DEMO_EMAILS.includes(emailLower) || getAccounts()[emailLower]) {
        return 'Er bestaat al een account met dit e-mailadres.'
      }
    }
    return null
  }

  function volgende() {
    const foutMsg = valideerStap()
    if (foutMsg) { setFout(foutMsg); return }
    setFout('')
    if (stap < AANTAL_STAPPEN) { setStap((s) => s + 1); return }
    maakAccount()
  }

  function vorige() {
    setFout('')
    setStap((s) => s - 1)
  }

  function maakAccount() {
    const emailLower = email.trim().toLowerCase()

    // Laatste controle: één account per e-mailadres. Voorkomt dat een
    // bestaand account stil overschreven wordt als de flow wordt hervat.
    if (DEMO_EMAILS.includes(emailLower) || getAccounts()[emailLower]) {
      setStap(1)
      setFout('Er bestaat al een account met dit e-mailadres.')
      return
    }

    const omschrijving = [prijsklasse, ...dieet].filter(Boolean).join(' · ') || 'Standaard account'

    const profiel = {
      id: emailLower,
      naam: naam.trim(),
      type: 'lid',
      omschrijving,
      kleur: ACCENT_KLEUR,
      accent: ACCENT_KLEUR,
      persoon: { email: emailLower, telefoon: '', adres: '' },
      voorkeuren: {
        dieet,
        prijsklasse: prijsklasse ? prijsklasse.toLowerCase() : 'budget',
        merken: [],
        afdelingen: [],
        personen,
        frequentie,
        kooktijd,
        themas,
        maaltijden,
        ingredienten,
        vermijden,
      },
      gerechten,
      geschiedenis: { winkels },
      loyaltyPunten: 0,
      cashbackSaldo: 0,
      cashbackTier: 'Standaard',
    }

    saveAccount(emailLower, { wachtwoord, profiel })
    login(profiel)

    // Gekozen gerechten meteen omzetten naar ingrediënten op de boodschappenlijst,
    // via dezelfde recepten-bron als de assistent.
    if (gerechten.length) {
      const gekozenRecepten = RECEPTEN.filter((r) => gerechten.includes(r.naam))
      const { termen } = ingredientenVoorGerechten(gekozenRecepten)
      if (termen.length) addIngredients(termen)
    }

    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-surface px-5 py-8">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/25">
            <Compass className="h-4.5 w-4.5" strokeWidth={1.8} />
          </div>
          <span className="text-base font-bold text-slate-900">Never Lost</span>
        </div>

        {/* Voortgangsbalk */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {Array.from({ length: AANTAL_STAPPEN }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  n <= stap ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Stap {stap} van {AANTAL_STAPPEN} &middot;{' '}
            <span className="text-slate-600">{STAP_TITELS[stap - 1]}</span>
            {naam && stap > 1 && (
              <> &middot; <span className="text-slate-600">{naam}</span></>
            )}
          </p>
        </div>

        {/* Stap inhoud */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

          {/* Stap 1 — Account */}
          {stap === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Maak je account aan</h2>
                <p className="mt-0.5 text-sm text-slate-500">We personaliseren jouw winkelervaring</p>
              </div>
              <div className="space-y-3">
                <Input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Naam" aria-label="Naam" autoComplete="name" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mailadres" aria-label="E-mailadres" autoComplete="email" />
                <Input
                  type="password"
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                  placeholder="Wachtwoord (min. 4 tekens)"
                  aria-label="Wachtwoord"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-sm text-slate-500">
                Al een account?{' '}
                <Link to="/login" className="font-medium text-brand-600 transition hover:text-brand-700">
                  Inloggen
                </Link>
              </p>
            </div>
          )}

          {/* Stap 2 — Huishouden */}
          {stap === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Voor wie kook je?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Zo stemmen we porties en hoeveelheden af</p>
              </div>
              <div>
                <VeldKop titel="Aantal personen" />
                <KaartGrid opties={PERSONEN_OPTIES} geselecteerd={personen} enkel onToggle={(id) => setPersonen((c) => (c === id ? '' : id))} />
              </div>
              <div>
                <VeldKop titel="Hoe vaak kook je?" />
                <KaartGrid opties={FREQUENTIE_OPTIES} geselecteerd={frequentie} enkel kolommen={3} onToggle={(id) => setFrequentie((c) => (c === id ? '' : id))} />
              </div>
            </div>
          )}

          {/* Stap 3 — Hoelang wil je koken? */}
          {stap === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Hoelang wil je koken?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Zo stemmen we de gerechten af op je tijd</p>
              </div>
              <KaartGrid opties={KOOKTIJD_OPTIES} geselecteerd={kooktijd} enkel onToggle={(id) => setKooktijd((c) => (c === id ? '' : id))} />
            </div>
          )}

          {/* Stap 4 — Keukenstijl */}
          {stap === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Welke keuken spreekt aan?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Kies een of meerdere stijlen</p>
              </div>
              <KaartGrid opties={THEMAS} geselecteerd={themas} onToggle={toggleThema} />
            </div>
          )}

          {/* Stap 5 — Maaltijdmoment */}
          {stap === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Wat wil je klaarmaken?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Kies een of meerdere momenten</p>
              </div>
              <KaartGrid opties={MAALTIJDEN} geselecteerd={maaltijden} kolommen={3} onToggle={toggleMaaltijd} />
            </div>
          )}

          {/* Stap 6 — Ingrediënten */}
          {stap === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Waar kook je graag mee?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Selecteer je favoriete basisingrediënten</p>
              </div>
              <PillGroep opties={BASIS_INGREDIENTEN} geselecteerd={ingredienten} onToggle={toggleIngredient} />
            </div>
          )}

          {/* Stap 7 — Vermijden */}
          {stap === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Iets dat je liever vermijdt?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Deze ingrediënten laten we uit je gerechten — sla over als er niets is</p>
              </div>
              <PillGroep opties={BASIS_INGREDIENTEN} geselecteerd={vermijden} onToggle={toggleVermijden} />
            </div>
          )}

          {/* Stap 8 — Dieet & prijsklasse */}
          {stap === 8 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Dieet &amp; prijsklasse</h2>
                <p className="mt-0.5 text-sm text-slate-500">Selecteer wat op jou van toepassing is</p>
              </div>

              <div>
                <VeldKop titel="Dieetvoorkeur" />
                <PillGroep opties={DIEET_OPTIES} geselecteerd={dieet} onToggle={toggleDieet} />
              </div>

              <div>
                <VeldKop titel="Prijsklasse" />
                <div className="flex gap-2">
                  {PRIJS_OPTIES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setPrijsklasse((cur) => (cur === item ? '' : item))}
                      className={`flex-1 rounded-full py-2.5 text-sm font-medium transition active:scale-[0.97] ${
                        prijsklasse === item
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stap 9 — Favoriete gerechten */}
          {stap === 9 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Welke gerechten spreken aan?</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Op maat van je keuzes — de beste matches staan bovenaan
                </p>
              </div>

              {gerechtenGefilterd.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  Geen gerechten gevonden voor deze combinatie.<br />Ga terug om je dieet, kooktijd of vermeden ingrediënten aan te passen.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {gerechtenGefilterd.map((g) => {
                    const geselecteerd = gerechten.includes(g.naam)
                    return (
                      <button
                        key={g.naam}
                        onClick={() => toggleGerecht(g.naam)}
                        className={`relative rounded-xl px-3 py-3.5 text-left transition active:scale-[0.97] ${
                          geselecteerd
                            ? 'bg-brand-50 ring-2 ring-brand-400'
                            : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {geselecteerd && <CheckBadge />}
                        <span className="mb-1.5 block text-2xl">{g.emoji}</span>
                        <span className="block text-xs font-medium capitalize leading-tight text-slate-800">{g.naam}</span>
                        <span className="mt-1 block text-[10px] text-slate-400">{g.tijd} min</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Stap 10 — Favoriete winkels */}
          {stap === 10 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Favoriete winkels</h2>
                <p className="mt-0.5 text-sm text-slate-500">Selecteer je vaste supermarkten</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WINKELS.map((w) => {
                  const geselecteerd = winkels.includes(w.id)
                  return (
                    <button
                      key={w.id}
                      onClick={() => toggleWinkel(w.id)}
                      className={`relative rounded-xl px-3 py-4 text-left transition active:scale-[0.97] ${
                        geselecteerd
                          ? 'bg-brand-50 ring-2 ring-brand-400'
                          : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {geselecteerd && <CheckBadge />}
                      <span className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${w.kleur} text-lg shadow-sm`}>
                        {w.emoji}
                      </span>
                      <span className="block text-sm font-medium text-slate-800">{w.naam}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Foutmelding */}
        {fout && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
            {fout}
          </div>
        )}

        {/* Navigatieknoppen */}
        <div className="flex gap-3">
          {stap > 1 && (
            <Button variant="secondary" size="lg" onClick={vorige} className="px-5">
              <ChevronLeft className="h-4 w-4" />
              Vorige
            </Button>
          )}
          <Button size="lg" onClick={volgende} className="flex-1">
            {stap === AANTAL_STAPPEN ? 'Account aanmaken' : 'Volgende'}
            {stap < AANTAL_STAPPEN && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
