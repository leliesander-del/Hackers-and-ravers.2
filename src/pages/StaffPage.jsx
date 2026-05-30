import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { stores } from '../data/stores.js'
import { products } from '../data/products.js'
import { parseProductQr, productQrPayload } from '../lib/inventory.js'
import { fuzzyZoekProducten } from '../lib/fuzzySearch.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'

function StockBadge({ magazijn, schap }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">Magazijn: {magazijn}</span>
      <span className={`rounded-full px-2 py-0.5 ${schap > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
        Schap: {schap}
      </span>
    </div>
  )
}

export default function StaffPage() {
  const {
    productsByStoreLive,
    getProductLive,
    verplaatsNaarSchap,
    verkoopVanSchap,
    staffLog,
  } = useStore()

  const [winkelId, setWinkelId] = useState('ah-xl')
  const [modus, setModus] = useState('aanvullen')
  const [qrInput, setQrInput] = useState('')
  const [zoek, setZoek] = useState('')
  const [geselecteerdId, setGeselecteerdId] = useState(null)
  const [aantalTekst, setAantalTekst] = useState('1')
  const [melding, setMelding] = useState(null)

  const winkelsMetProducten = useMemo(() => stores.filter((s) => products.some((p) => p.storeId === s.id)), [])
  const geselecteerd = geselecteerdId ? getProductLive(geselecteerdId) : null

  const gefilterdeProducten = useMemo(() => {
    const lijst = productsByStoreLive(winkelId)
    return fuzzyZoekProducten(lijst, zoek)
  }, [productsByStoreLive, winkelId, zoek])

  function parseAantal(tekst = aantalTekst) {
    const n = parseInt(tekst, 10)
    return Number.isFinite(n) && n >= 1 ? n : 1
  }

  function resetAantal() {
    setAantalTekst('1')
  }

  function wijzigAantal(delta) {
    setAantalTekst(String(Math.max(1, parseAantal() + delta)))
  }

  function blokkeerOngeldigeAantalToets(e) {
    if (['e', 'E', '-', '+', '.', ','].includes(e.key)) e.preventDefault()
  }

  function toonMelding(tekst, type = 'info') {
    setMelding({ tekst, type })
    setTimeout(() => setMelding(null), 3500)
  }

  function kiesProduct(id) {
    setGeselecteerdId(id)
    setQrInput('')
    resetAantal()
  }

  function scanQr() {
    const id = parseProductQr(qrInput)
    if (!id) {
      toonMelding('QR niet herkend. Scan opnieuw of kies een product hieronder.', 'fout')
      return
    }
    const product = getProductLive(id)
    if (!product) {
      toonMelding('Product niet gevonden.', 'fout')
      return
    }
    if (product.storeId !== winkelId) {
      toonMelding(`Dit product hoort bij een andere winkel.`, 'fout')
      return
    }
    kiesProduct(id)
    toonMelding(`${product.naam} geselecteerd`, 'ok')
  }

  function voerActieUit() {
    if (!geselecteerdId) {
      toonMelding('Selecteer eerst een product.', 'fout')
      return
    }

    const aantal = parseAantal()

    const result =
      modus === 'aanvullen'
        ? verplaatsNaarSchap(geselecteerdId, aantal)
        : verkoopVanSchap(geselecteerdId, aantal)

    if (result.ok) {
      toonMelding(modus === 'aanvullen' ? 'Naar schap verplaatst!' : 'Verkoop geregistreerd!', 'ok')
      setQrInput('')
      resetAantal()
    } else {
      toonMelding(result.fout, 'fout')
    }
  }

  return (
    <div>
      <PageHeader title="Voorraad" subtitle="Magazijn ↔ schap" />

      <div className="space-y-4 px-4 py-4">
        {melding && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              melding.type === 'ok'
                ? 'bg-emerald-50 text-emerald-800'
                : melding.type === 'fout'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-violet-50 text-violet-800'
            }`}
          >
            {melding.tekst}
          </div>
        )}

        {/* Winkelkeuze */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-medium text-slate-400">Winkel</p>
          <select
            value={winkelId}
            onChange={(e) => {
              setWinkelId(e.target.value)
              setGeselecteerdId(null)
              setZoek('')
              resetAantal()
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800"
          >
            {winkelsMetProducten.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} {s.naam}
              </option>
            ))}
          </select>
        </section>

        {/* Modus */}
        <div className="flex gap-2 rounded-2xl bg-white p-1 shadow-sm">
          <button
            onClick={() => {
              setModus('aanvullen')
              resetAantal()
            }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              modus === 'aanvullen' ? 'bg-violet-600 text-white' : 'text-slate-500'
            }`}
          >
            📦 Magazijn → schap
          </button>
          <button
            onClick={() => {
              setModus('verkoop')
              resetAantal()
            }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              modus === 'verkoop' ? 'bg-violet-600 text-white' : 'text-slate-500'
            }`}
          >
            💳 Verkoop (betaald)
          </button>
        </div>

        {/* QR / scan simulatie */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-slate-700">QR-code scannen</p>
          <p className="mb-3 text-xs text-slate-400">Scan de product-QR, of druk op het product hieronder.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && scanQr()}
              placeholder="Scan QR-code…"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
            <button
              onClick={scanQr}
              className="shrink-0 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-semibold text-violet-700"
            >
              Scan
            </button>
          </div>
        </section>

        {/* Geselecteerd product + actie */}
        {geselecteerd && (
          <section className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
            <p className="font-bold text-slate-800">{geselecteerd.naam}</p>
            <p className="text-xs text-slate-500">{geselecteerd.merk} · {geselecteerd.schaplocatie?.label}</p>
            <div className="mt-2">
              <StockBadge magazijn={geselecteerd.magazijnVoorraad} schap={geselecteerd.schapVoorraad} />
            </div>
            <p className="mt-2 break-all text-[10px] text-slate-400">QR: {productQrPayload(geselecteerd.id)}</p>

            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="staff-aantal" className="text-sm text-slate-600">
                Aantal
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => wijzigAantal(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-600 shadow-sm"
                >
                  −
                </button>
                <input
                  id="staff-aantal"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={aantalTekst}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '' || /^\d+$/.test(v)) setAantalTekst(v)
                  }}
                  onBlur={() => setAantalTekst(String(parseAantal()))}
                  onKeyDown={(e) => {
                    blokkeerOngeldigeAantalToets(e)
                    if (e.key === 'Enter') voerActieUit()
                  }}
                  onPaste={(e) => {
                    e.preventDefault()
                    const cijfers = e.clipboardData.getData('text').replace(/\D/g, '')
                    if (cijfers) setAantalTekst(cijfers.replace(/^0+/, '') || '1')
                  }}
                  className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-sm font-bold text-slate-800 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => wijzigAantal(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-600 shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={voerActieUit}
              className="mt-4 w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white"
            >
              {modus === 'aanvullen'
                ? `${parseAantal()} stuks naar schap verplaatsen`
                : `${parseAantal()} stuks van schap afboeken (klant betaald)`}
            </button>
          </section>
        )}

        {/* Productlijst */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Producten</h2>
          <SearchBar value={zoek} onChange={setZoek} placeholder="Zoek op naam, merk of locatie…" />
          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
            {gefilterdeProducten.length ? (
              gefilterdeProducten.map((p) => (
                <button
                  key={p.id}
                  onClick={() => kiesProduct(p.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left shadow-sm transition ${
                    geselecteerdId === p.id ? 'bg-violet-100 ring-2 ring-violet-400' : 'bg-white'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">📦</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-slate-800">{p.naam}</p>
                    <p className="text-xs text-slate-500">{p.merk} · {p.schaplocatie?.label}</p>
                    <div className="mt-1">
                      <StockBadge magazijn={p.magazijnVoorraad} schap={p.schapVoorraad} />
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
                Geen producten gevonden voor &quot;{zoek}&quot;.
              </p>
            )}
          </div>
        </section>

        {/* Activiteitenlog */}
        {staffLog.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Recente acties</h2>
            <div className="space-y-1 rounded-2xl bg-white p-3 shadow-sm">
              {staffLog.slice(0, 8).map((item) => (
                <p key={item.id} className="text-xs text-slate-600">
                  <span className="text-slate-400">{item.tijd}</span> · {item.tekst}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
