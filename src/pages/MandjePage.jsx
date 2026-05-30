import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import PageHeader from '../components/PageHeader.jsx'
import StoreLogo from '../components/StoreLogo.jsx'

// Het mandje is je volledige boodschappenlijst: ingrediënten die je via
// ✨ Sparren toevoegde én concrete producten die je in een winkel aanklikte.
// Onderaan kies je een winkel om de route te starten.
export default function MandjePage() {
  const { cart, winkelsVoorLijst, getProductLive, removeFromCart, clearCart, isAfgevinkt, toggleAfgevinkt } =
    useStore()
  const navigate = useNavigate()

  const totaal = cart
    .filter((it) => it.kind === 'product')
    .map((it) => getProductLive(it.key))
    .filter(Boolean)
    .reduce((som, p) => som + p.prijs, 0)

  if (cart.length === 0) {
    return (
      <div>
        <PageHeader title="Mandje" subtitle="0 items" />
        <div className="space-y-5 px-4 py-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-5xl">🛍️</p>
            <p className="mt-3 text-slate-500">Je lijst is nog leeg.</p>
            <p className="mt-1 text-xs text-slate-400">
              Voeg producten toe in een winkel of stel je lijst samen via ✨ Sparren.
            </p>
          </div>
          <HandmatigToevoegen />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Mandje"
        subtitle={`${cart.length} ${cart.length === 1 ? 'item' : 'items'} op je lijst`}
      />

      <div className="space-y-5 px-4 py-4">
        {/* De volledige lijst: ingrediënten + concrete producten, afvinkbaar. */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <ul className="space-y-1">
            {cart.map((it) => {
              const af = isAfgevinkt(it.key)
              const product = it.kind === 'product' ? getProductLive(it.key) : null
              const store = product ? getStore(product.storeId) : null
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
                  <div className="min-w-0 flex-1">
                    <span className={`block truncate text-sm ${af ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {it.label}
                    </span>
                    {product && (
                      <span className="block truncate text-xs text-slate-400">
                        {[product.merk, store?.naam, product.schaplocatie?.label].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>
                  {product && (
                    <span className="shrink-0 text-sm font-semibold text-slate-600">€ {product.prijs.toFixed(2)}</span>
                  )}
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

        {/* Winkelkeuze: pas hier wordt de route gemaakt. We lichten de winkel uit
            waar je de meeste producten van je lijst in één keer kunt halen. */}
        {winkelsVoorLijst.length === 0 ? (
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="mb-1 font-bold text-slate-800">Waar ga je naartoe?</p>
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
              Nog geen winkel gevonden die deze lijst kan leveren.
            </p>
          </section>
        ) : (
          <>
            {(() => {
              const beste = winkelsVoorLijst[0]
              return (
                <section className="rounded-2xl bg-white p-4 shadow-sm ring-2 ring-violet-200">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-500">
                    Meeste producten in één winkel
                  </p>
                  <div className="flex items-center gap-3">
                    <StoreLogo store={beste.store} sizeClass="h-12 w-12" emojiClass="text-xl" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-800">{beste.store.naam}</p>
                      <p className="text-xs text-slate-500">
                        {beste.aantal} van {beste.totaal} items hier · ± € {beste.totaalPrijs.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/store/${beste.store.id}`)}
                      className="flex-1 rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
                    >
                      Open winkel →
                    </button>
                    {beste.store.heeftPlattegrond && (
                      <button
                        onClick={() => navigate(`/store/${beste.store.id}?plan=1`)}
                        className="flex-1 rounded-full bg-violet-100 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-200 active:scale-[0.98]"
                      >
                        🗺️ Bekijk winkelplan
                      </button>
                    )}
                  </div>
                </section>
              )
            })()}

            {winkelsVoorLijst.length > 1 && (
              <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="mb-3 text-xs font-semibold text-slate-500">Andere winkels</p>
                <div className="space-y-2">
                  {winkelsVoorLijst.slice(1).map(({ store, aantal, totaal: aantalTotaal, totaalPrijs }) => (
                    <button
                      key={store.id}
                      onClick={() => navigate(`/store/${store.id}`)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left ring-1 ring-slate-100 transition hover:ring-violet-300 active:scale-[0.98]"
                    >
                      <StoreLogo store={store} sizeClass="h-10 w-10" emojiClass="text-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-800">{store.naam}</p>
                        <p className="text-xs text-slate-400">
                          {aantal} van {aantalTotaal} items · ± € {totaalPrijs.toFixed(2)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-violet-600">→</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {totaal > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <span className="text-slate-500">Totaal (producten)</span>
            <span className="text-xl font-bold text-violet-700">€ {totaal.toFixed(2)}</span>
          </div>
        )}

        <button
          onClick={clearCart}
          className="w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-[0.98]"
        >
          Lijst leegmaken
        </button>
      </div>
    </div>
  )
}

// Laat de klant zelf producten opzoeken in het assortiment en handmatig aan de
// lijst toevoegen. We zoeken in alle winkels op naam, merk en categorie.
function HandmatigToevoegen() {
  const { allProductsLive, addToCart, inCart } = useStore()
  const [zoek, setZoek] = useState('')

  const resultaten = useMemo(() => {
    const term = zoek.trim().toLowerCase()
    if (!term) return []
    return allProductsLive
      .filter((p) => !inCart(p.id))
      .filter((p) => [p.naam, p.merk, p.categorie].some((v) => v?.toLowerCase().includes(term)))
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
          <button onClick={() => setZoek('')} aria-label="Wissen" className="text-slate-300 transition hover:text-slate-500">
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
