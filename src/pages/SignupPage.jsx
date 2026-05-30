import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Compass } from '../components/icons.jsx'
import { useStore, getAccounts, saveAccount } from '../context/StoreContext.jsx'
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
const ACCENT_KLEUREN = ['#7c3aed', '#0ea5e9', '#ec4899', '#f59e0b', '#10b981']
const DEMO_EMAILS = ['sander@neverlost.be', 'marc@neverlost.be', 'gast@neverlost.be']

function CheckBadge() {
  return (
    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-500">
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
    </span>
  )
}

// Sectiekop binnen een stap.
function VeldKop({ titel }) {
  return <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">{titel}</p>
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
              aan ? 'bg-white/15 ring-2 ring-fuchsia-400/70' : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
            }`}
          >
            {aan && <CheckBadge />}
            <span className="block text-2xl mb-1.5">{o.emoji}</span>
            <span className="block text-sm text-white/80 font-medium leading-tight">{o.label}</span>
            {o.sub && <span className="block text-xs text-white/40 mt-0.5">{o.sub}</span>}
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
                ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md shadow-fuchsia-500/20'
                : 'bg-white/10 text-white/60 ring-1 ring-white/10 hover:bg-white/15 hover:text-white/80'
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

    const accent = ACCENT_KLEUREN[emailLower.charCodeAt(0) % ACCENT_KLEUREN.length]
    const omschrijving = [prijsklasse, ...dieet].filter(Boolean).join(' · ') || 'Standaard account'

    const profiel = {
      id: emailLower,
      naam: naam.trim(),
      type: 'lid',
      omschrijving,
      kleur: accent,
      accent,
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c24] via-[#1a1240] to-[#2a1463] flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-indigo-500 shadow-md shadow-fuchsia-500/25">
            <Compass className="h-4.5 w-4.5 text-white" strokeWidth={1.8} />
          </div>
          <span className="text-base font-bold text-white">Never Lost</span>
        </div>

        {/* Voortgangsbalk */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {Array.from({ length: AANTAL_STAPPEN }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  n <= stap ? 'bg-gradient-to-r from-fuchsia-400 to-indigo-500' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-white/40">
            Stap {stap} van {AANTAL_STAPPEN} &middot;{' '}
            <span className="text-white/60">{STAP_TITELS[stap - 1]}</span>
            {naam && stap > 1 && (
              <> &middot; <span className="text-white/60">{naam}</span></>
            )}
          </p>
        </div>

        {/* Stap inhoud */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">

          {/* Stap 1 — Account */}
          {stap === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Maak je account aan</h2>
                <p className="text-sm text-white/40 mt-0.5">We personaliseren jouw winkelervaring</p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  placeholder="Naam"
                  className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-fuchsia-400/50 transition"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mailadres"
                  className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-fuchsia-400/50 transition"
                />
                <input
                  type="password"
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                  placeholder="Wachtwoord (min. 4 tekens)"
                  className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-fuchsia-400/50 transition"
                />
              </div>
              <p className="text-sm text-white/30">
                Al een account?{' '}
                <Link to="/login" className="text-fuchsia-400 hover:text-fuchsia-300 transition">
                  Inloggen
                </Link>
              </p>
            </div>
          )}

          {/* Stap 2 — Huishouden */}
          {stap === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Voor wie kook je?</h2>
                <p className="text-sm text-white/40 mt-0.5">Zo stemmen we porties en hoeveelheden af</p>
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
                <h2 className="text-lg font-semibold text-white">Hoelang wil je koken?</h2>
                <p className="text-sm text-white/40 mt-0.5">Zo stemmen we de gerechten af op je tijd</p>
              </div>
              <KaartGrid opties={KOOKTIJD_OPTIES} geselecteerd={kooktijd} enkel onToggle={(id) => setKooktijd((c) => (c === id ? '' : id))} />
            </div>
          )}

          {/* Stap 4 — Keukenstijl */}
          {stap === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Welke keuken spreekt aan?</h2>
                <p className="text-sm text-white/40 mt-0.5">Kies een of meerdere stijlen</p>
              </div>
              <KaartGrid opties={THEMAS} geselecteerd={themas} onToggle={toggleThema} />
            </div>
          )}

          {/* Stap 5 — Maaltijdmoment */}
          {stap === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Wat wil je klaarmaken?</h2>
                <p className="text-sm text-white/40 mt-0.5">Kies een of meerdere momenten</p>
              </div>
              <KaartGrid opties={MAALTIJDEN} geselecteerd={maaltijden} kolommen={3} onToggle={toggleMaaltijd} />
            </div>
          )}

          {/* Stap 6 — Ingrediënten */}
          {stap === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Waar kook je graag mee?</h2>
                <p className="text-sm text-white/40 mt-0.5">Selecteer je favoriete basisingrediënten</p>
              </div>
              <PillGroep opties={BASIS_INGREDIENTEN} geselecteerd={ingredienten} onToggle={toggleIngredient} />
            </div>
          )}

          {/* Stap 7 — Vermijden */}
          {stap === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Iets dat je liever vermijdt?</h2>
                <p className="text-sm text-white/40 mt-0.5">Deze ingrediënten laten we uit je gerechten — sla over als er niets is</p>
              </div>
              <PillGroep opties={BASIS_INGREDIENTEN} geselecteerd={vermijden} onToggle={toggleVermijden} />
            </div>
          )}

          {/* Stap 8 — Dieet & prijsklasse */}
          {stap === 8 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Dieet &amp; prijsklasse</h2>
                <p className="text-sm text-white/40 mt-0.5">Selecteer wat op jou van toepassing is</p>
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
                          ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md shadow-fuchsia-500/20'
                          : 'bg-white/10 text-white/60 ring-1 ring-white/10 hover:bg-white/15 hover:text-white/80'
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
                <h2 className="text-lg font-semibold text-white">Welke gerechten spreken aan?</h2>
                <p className="text-sm text-white/40 mt-0.5">
                  Op maat van je keuzes — de beste matches staan bovenaan
                </p>
              </div>

              {gerechtenGefilterd.length === 0 ? (
                <p className="text-center text-sm text-white/30 py-6">
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
                            ? 'bg-white/15 ring-2 ring-fuchsia-400/70'
                            : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        {geselecteerd && <CheckBadge />}
                        <span className="block text-2xl mb-1.5">{g.emoji}</span>
                        <span className="block text-xs text-white/80 font-medium leading-tight capitalize">{g.naam}</span>
                        <span className="block text-[10px] text-white/35 mt-1">{g.tijd} min</span>
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
                <h2 className="text-lg font-semibold text-white">Favoriete winkels</h2>
                <p className="text-sm text-white/40 mt-0.5">Selecteer je vaste supermarkten</p>
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
                          ? 'bg-white/15 ring-2 ring-fuchsia-400/70'
                          : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
                      }`}
                    >
                      {geselecteerd && <CheckBadge />}
                      <span className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${w.kleur} text-lg shadow-sm`}>
                        {w.emoji}
                      </span>
                      <span className="block text-sm text-white/80 font-medium">{w.naam}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Foutmelding */}
        {fout && (
          <div className="rounded-xl bg-red-500/15 ring-1 ring-red-500/30 px-4 py-3 text-sm text-red-300">
            {fout}
          </div>
        )}

        {/* Navigatieknoppen */}
        <div className="flex gap-3">
          {stap > 1 && (
            <button
              onClick={vorige}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-5 py-3.5 text-sm font-medium text-white/70 ring-1 ring-white/10 transition hover:bg-white/15 active:scale-[0.98]"
            >
              <ChevronLeft className="h-4 w-4" />
              Vorige
            </button>
          )}
          <button
            onClick={volgende}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition active:scale-[0.98]"
          >
            {stap === AANTAL_STAPPEN ? 'Account aanmaken' : 'Volgende'}
            {stap < AANTAL_STAPPEN && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
