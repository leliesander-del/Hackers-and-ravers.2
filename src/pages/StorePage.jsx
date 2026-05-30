import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { productsByStore } from '../data/products.js'
import { rankProducts } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import ProductRow from '../components/ProductRow.jsx'
import Floorplan from '../components/Floorplan.jsx'

// Iconen + nette labels per categorie.
const CAT_EMOJI = {
  pasta: '🍝', brood: '🍞', zuivel: '🥛', koffie: '☕', frisdrank: '🥤', snacks: '🍿',
  fruit: '🍎', groenten: '🥦', vlees: '🥩', vis: '🐟', ontbijt: '🥣',
  audio: '🎧', accessoires: '🔌', smartphones: '📱', computers: '💻', tv: '📺', gaming: '🎮',
  balsport: '⚽', sportvoeding: '🥨', schoenen: '👟', kleding: '👕', fitness: '🏋️', fietsen: '🚲',
  bouwspeelgoed: '🧱', knuffels: '🧸', spellen: '🎲', hobby: '🎨',
}
const CAT_LABEL = { tv: 'TV & Beeld' }
const catEmoji = (c) => CAT_EMOJI[c] || '🛒'
const catLabel = (c) => CAT_LABEL[c] || c.charAt(0).toUpperCase() + c.slice(1)

export default function StorePage() {
  const { id } = useParams()
  const { activeProfile, cartCount, cart } = useStore()
  const [zoek, setZoek] = useState('')
  const [categorie, setCategorie] = useState(null)
  const [toonMap, setToonMap] = useState(false)

  const store = getStore(id)
  const winkelProducten = useMemo(() => productsByStore(id), [id])

  // Producten uit je mandje die in déze winkel liggen -> route op de plattegrond.
  const mijnStops = useMemo(() => cart.filter((p) => p.storeId === id).map((p) => p.id), [cart, id])

  // Categorieën met aantal producten.
  const categorieen = useMemo(() => {
    const m = new Map()
    for (const p of winkelProducten) m.set(p.categorie, (m.get(p.categorie) || 0) + 1)
    return [...m.entries()].map(([cat, aantal]) => ({ cat, aantal })).sort((a, b) => a.cat.localeCompare(b.cat))
  }, [winkelProducten])

  const zoekActief = zoek.trim().length > 0

  const resultaten = useMemo(() => {
    let lijst = winkelProducten
    if (zoekActief) {
      const q = zoek.toLowerCase()
      lijst = lijst.filter((p) => p.naam.toLowerCase().includes(q) || p.merk.toLowerCase().includes(q))
    } else if (categorie) {
      lijst = lijst.filter((p) => p.categorie === categorie)
    }
    return rankProducts(lijst, activeProfile)
  }, [winkelProducten, zoek, zoekActief, categorie, activeProfile])

  if (!store) return <Navigate to="/" replace />

  // Toon producten zodra er gezocht wordt of een categorie gekozen is.
  const toonProducten = zoekActief || categorie

  return (
    <div>
      <PageHeader
        title={store.naam}
        subtitle={`${store.type} · ${store.cashback}% cashback`}
        back
        right={
          <Link to="/mandje" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            🛍️
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <SearchBar value={zoek} onChange={setZoek} placeholder={`Zoek in ${store.naam}`} />

        {/* Snelkoppeling: rechtstreeks naar de plattegrond */}
        {store.heeftPlattegrond && (
          <button
            onClick={() => setToonMap((v) => !v)}
            className={`w-full rounded-full py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
              toonMap ? 'bg-slate-100 text-slate-500' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
            }`}
          >
            {toonMap ? 'Verberg plattegrond' : '🗺️ Bekijk de plattegrond'}
          </button>
        )}

        {toonMap ? (
          // ---- Plattegrond ----
          <div>
            <p className="mb-2 text-xs text-slate-400">
              {mijnStops.length > 0
                ? 'De snelste route langs de producten uit je mandje — de cijfers tonen de volgorde.'
                : 'Voeg producten toe aan je mandje om de route te zien.'}
            </p>
            <Floorplan products={winkelProducten} routeIds={mijnStops} />
          </div>
        ) : !toonProducten ? (
          // ---- Categorie-overzicht ----
          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-500">Categorieën</h2>
            <div className="grid grid-cols-2 gap-3">
              {categorieen.map(({ cat, aantal }) => (
                <button
                  key={cat}
                  onClick={() => setCategorie(cat)}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-violet-200 active:scale-[0.97]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xl">
                    {catEmoji(cat)}
                  </span>
                  <span>
                    <span className="block font-semibold text-slate-800">{catLabel(cat)}</span>
                    <span className="block text-xs text-slate-400">{aantal} producten</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // ---- Producten (na zoeken of categoriekeuze) ----
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-500">
                {zoekActief ? `Resultaten voor "${zoek}"` : `${catEmoji(categorie)} ${catLabel(categorie)}`}
                {!zoekActief && activeProfile.type !== 'gast' && (
                  <span className="font-normal"> · op jouw voorkeur</span>
                )}
              </h2>
              {!zoekActief && categorie && (
                <button onClick={() => setCategorie(null)} className="text-xs font-medium text-violet-600">
                  ← Categorieën
                </button>
              )}
            </div>
            <div className="space-y-2">
              {resultaten.length ? (
                resultaten.map((p) => <ProductRow key={p.id} product={p} />)
              ) : (
                <p className="text-sm text-slate-400">Niets gevonden.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
