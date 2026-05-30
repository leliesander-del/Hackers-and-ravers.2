import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Compass } from 'lucide-react'
import { useStore, getAccounts, saveAccount } from '../context/StoreContext.jsx'

const DIEET_OPTIES = ['Glutenvrij', 'Lactosevrij', 'Vegetarisch', 'Veganistisch', 'Suikervrij']
const PRIJS_OPTIES = ['Budget', 'Middenklasse', 'Premium']

const GERECHTEN = [
  { id: 'spaghetti', naam: 'Spaghetti bolognese', emoji: '🍝', dieet: [] },
  { id: 'buddha', naam: 'Buddha bowl', emoji: '🥗', dieet: ['Vegetarisch', 'Veganistisch', 'Lactosevrij', 'Suikervrij'] },
  { id: 'pizza', naam: 'Pizza margherita', emoji: '🍕', dieet: ['Vegetarisch'] },
  { id: 'zalm', naam: 'Gegrilde zalm', emoji: '🐟', dieet: ['Glutenvrij', 'Lactosevrij', 'Suikervrij'] },
  { id: 'falafel', naam: 'Falafel wrap', emoji: '🌯', dieet: ['Vegetarisch', 'Veganistisch', 'Lactosevrij'] },
  { id: 'biefstuk', naam: 'Biefstuk met friet', emoji: '🥩', dieet: [] },
  { id: 'miso', naam: 'Miso soep', emoji: '🍜', dieet: ['Vegetarisch', 'Veganistisch', 'Glutenvrij'] },
  { id: 'wortel', naam: 'Wortelsoep', emoji: '🥕', dieet: ['Vegetarisch', 'Veganistisch', 'Glutenvrij', 'Lactosevrij', 'Suikervrij'] },
  { id: 'roerei', naam: 'Roerei met groenten', emoji: '🍳', dieet: ['Vegetarisch', 'Glutenvrij', 'Lactosevrij', 'Suikervrij'] },
  { id: 'curry', naam: 'Groentecurry', emoji: '🫕', dieet: ['Vegetarisch', 'Veganistisch', 'Glutenvrij', 'Lactosevrij'] },
  { id: 'sushi', naam: 'Sushi', emoji: '🍣', dieet: ['Glutenvrij', 'Lactosevrij'] },
  { id: 'avocado', naam: 'Avocadosalade', emoji: '🥑', dieet: ['Vegetarisch', 'Veganistisch', 'Glutenvrij', 'Lactosevrij', 'Suikervrij'] },
  { id: 'quinoa', naam: 'Quinoa bowl', emoji: '🫙', dieet: ['Vegetarisch', 'Veganistisch', 'Glutenvrij', 'Lactosevrij', 'Suikervrij'] },
  { id: 'pannenkoeken', naam: 'Pannenkoeken', emoji: '🥞', dieet: ['Vegetarisch'] },
  { id: 'griekse', naam: 'Griekse salade', emoji: '🥙', dieet: ['Vegetarisch', 'Glutenvrij', 'Suikervrij'] },
]

const WINKELS = [
  { id: 'colruyt', naam: 'Colruyt', emoji: '🛒', kleur: 'bg-red-600' },
  { id: 'delhaize', naam: 'Delhaize', emoji: '🦁', kleur: 'bg-green-600' },
  { id: 'carrefour', naam: 'Carrefour', emoji: '🛍️', kleur: 'bg-blue-600' },
  { id: 'aldi', naam: 'Aldi', emoji: '🏷️', kleur: 'bg-slate-600' },
  { id: 'lidl', naam: 'Lidl', emoji: '🌻', kleur: 'bg-yellow-500' },
]

const STAP_TITELS = ['Account', 'Voorkeuren', 'Gerechten', 'Winkels']
const ACCENT_KLEUREN = ['#7c3aed', '#0ea5e9', '#ec4899', '#f59e0b', '#10b981']
const DEMO_EMAILS = ['sander@neverlost.be', 'marc@neverlost.be', 'gast@neverlost.be']

function CheckBadge() {
  return (
    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-500">
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
    </span>
  )
}

export default function SignupPage() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [stap, setStap] = useState(1)
  const [fout, setFout] = useState('')

  // Stap 1
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')

  // Stap 2
  const [dieet, setDieet] = useState([])
  const [prijsklasse, setPrijsklasse] = useState('')

  // Stap 3
  const [gerechten, setGerechten] = useState([])

  // Stap 4
  const [winkels, setWinkels] = useState([])

  const gerechtenGefilterd = useMemo(() => {
    if (dieet.length === 0) return GERECHTEN
    return GERECHTEN.filter((g) => dieet.every((d) => g.dieet.includes(d)))
  }, [dieet])

  function toggleDieet(item) {
    setDieet((prev) => (prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]))
  }
  function toggleGerecht(id) {
    setGerechten((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }
  function toggleWinkel(id) {
    setWinkels((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]))
  }

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
    if (stap < 4) { setStap((s) => s + 1); return }
    maakAccount()
  }

  function vorige() {
    setFout('')
    setStap((s) => s - 1)
  }

  function maakAccount() {
    const emailLower = email.trim().toLowerCase()
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
      },
      gerechten,
      geschiedenis: { winkels },
      loyaltyPunten: 0,
      cashbackSaldo: 0,
      cashbackTier: 'Standaard',
    }

    saveAccount(emailLower, { wachtwoord, profiel })
    login(profiel)
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
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  n <= stap ? 'bg-gradient-to-r from-fuchsia-400 to-indigo-500' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-white/40">
            Stap {stap} van 4 &middot;{' '}
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

          {/* Stap 2 — Dieet & prijsklasse */}
          {stap === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Dieet &amp; prijsklasse</h2>
                <p className="text-sm text-white/40 mt-0.5">Selecteer wat op jou van toepassing is</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Dieetvoorkeur</p>
                <div className="flex flex-wrap gap-2">
                  {DIEET_OPTIES.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleDieet(item)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97] ${
                        dieet.includes(item)
                          ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md shadow-fuchsia-500/20'
                          : 'bg-white/10 text-white/60 ring-1 ring-white/10 hover:bg-white/15 hover:text-white/80'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Prijsklasse</p>
                <div className="flex gap-2">
                  {PRIJS_OPTIES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setPrijsklasse(item)}
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

          {/* Stap 3 — Favoriete gerechten */}
          {stap === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Favoriete gerechten</h2>
                {dieet.length > 0 ? (
                  <p className="text-sm text-white/40 mt-0.5">
                    Gefilterd op:{' '}
                    <span className="text-fuchsia-300 font-medium">{dieet.join(', ')}</span>
                  </p>
                ) : (
                  <p className="text-sm text-white/40 mt-0.5">Selecteer je favorieten</p>
                )}
              </div>

              {gerechtenGefilterd.length === 0 ? (
                <p className="text-center text-sm text-white/30 py-6">
                  Geen gerechten gevonden voor je dieetkeuze.<br />Ga terug om je filters aan te passen.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {gerechtenGefilterd.map((g) => {
                    const geselecteerd = gerechten.includes(g.id)
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGerecht(g.id)}
                        className={`relative rounded-xl px-3 py-3.5 text-left transition active:scale-[0.97] ${
                          geselecteerd
                            ? 'bg-white/15 ring-2 ring-fuchsia-400/70'
                            : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        {geselecteerd && <CheckBadge />}
                        <span className="block text-2xl mb-1.5">{g.emoji}</span>
                        <span className="block text-xs text-white/80 font-medium leading-tight">{g.naam}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Stap 4 — Favoriete winkels */}
          {stap === 4 && (
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
            {stap === 4 ? 'Account aanmaken' : 'Volgende'}
            {stap < 4 && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
