import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getPersoneelWinkelId } from '../lib/staffAccess.js'
import { parseProductQr } from '../lib/inventory.js'
import { fuzzyZoekProducten } from '../lib/fuzzySearch.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StockBadge from '../components/staff/StockBadge.jsx'
import StaffProductActiePaneel from '../components/staff/StaffProductActiePaneel.jsx'

export default function StaffVerkoopPage() {
  const { activeProfile, productsByStoreLive, getProductLive, verkoopVanRekken, staffLog } = useStore()

  const winkelId = getPersoneelWinkelId(activeProfile)
  const winkel = winkelId ? getStore(winkelId) : null
  const [qrInput, setQrInput] = useState('')
  const [zoek, setZoek] = useState('')
  const [geselecteerdId, setGeselecteerdId] = useState(null)
  const [aantalTekst, setAantalTekst] = useState('1')
  const [melding, setMelding] = useState(null)

  const geselecteerd = geselecteerdId ? getProductLive(geselecteerdId) : null

  const gefilterdeProducten = useMemo(() => {
    if (!winkelId) return []
    const lijst = productsByStoreLive(winkelId)
    return fuzzyZoekProducten(lijst, zoek)
  }, [productsByStoreLive, winkelId, zoek])

  const verkoopLog = useMemo(() => staffLog.filter((item) => item.tekst.includes('verkocht')), [staffLog])

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

  function aantalInputProps(actie) {
    return {
      aantalTekst,
      onAantalChange: (e) => {
        const v = e.target.value
        if (v === '' || /^\d+$/.test(v)) setAantalTekst(v)
      },
      onAantalBlur: () => setAantalTekst(String(parseAantal())),
      onAantalKeyDown: (e) => {
        blokkeerOngeldigeAantalToets(e)
        if (e.key === 'Enter') actie()
      },
      onWijzigAantal: wijzigAantal,
    }
  }

  function toonMelding(tekst, type = 'info') {
    setMelding({ tekst, type })
    setTimeout(() => setMelding(null), 3500)
  }

  function kiesProduct(id) {
    setGeselecteerdId((huidig) => (huidig === id ? null : id))
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
      toonMelding('Dit product hoort bij een andere winkel.', 'fout')
      return
    }
    kiesProduct(id)
    toonMelding(`${product.naam} geselecteerd`, 'ok')
  }

  function registreerVerkoop() {
    if (!geselecteerdId) {
      toonMelding('Selecteer eerst een product.', 'fout')
      return
    }
    const result = verkoopVanRekken(geselecteerdId, parseAantal())
    if (result.ok) {
      toonMelding('Verkoop geregistreerd!', 'ok')
      setQrInput('')
      resetAantal()
      setGeselecteerdId(null)
    } else {
      toonMelding(result.fout, 'fout')
    }
  }

  const geselecteerdInLijst = geselecteerdId && gefilterdeProducten.some((p) => p.id === geselecteerdId)

  function actiePaneel(product, inputPrefix) {
    const aantal = parseAantal()
    return (
      <StaffProductActiePaneel
        product={product}
        variant="violet"
        modus="verwijderen"
        inputId={`${inputPrefix}-aantal-${product.id}`}
        {...aantalInputProps(registreerVerkoop)}
        actieLabel={`${aantal} stuks verkocht (uit rekken)`}
        onActie={registreerVerkoop}
        actieDisabled={product.rekkenVoorraad === 0 || aantal > product.rekkenVoorraad}
        onSluiten={() => setGeselecteerdId(null)}
      />
    )
  }

  if (!winkelId || !winkel) {
    return (
      <div className="px-4 py-8 text-center text-sm text-slate-500">
        Geen winkel toegewezen aan dit personeelsaccount.
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Kassamedewerker" subtitle={winkel.naam} />

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

        <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
          Registreer verkopen bij <strong>{winkel.naam}</strong>: tik op een product en boek de verkoop af van de
          rekken. Alleen op dit kassascherm kun je voorraad van de rekken halen.
        </p>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
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
              className="shrink-0 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-800"
            >
              Scan
            </button>
          </div>
        </section>

        {geselecteerd && !geselecteerdInLijst && actiePaneel(geselecteerd, 'kassa-qr')}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Producten</h2>
          <SearchBar value={zoek} onChange={setZoek} placeholder="Zoek op naam, merk of locatie…" />
          <div className="mt-2 max-h-[min(70vh,32rem)] space-y-2 overflow-y-auto">
            {gefilterdeProducten.length ? (
              gefilterdeProducten.map((p) => {
                const actief = geselecteerdId === p.id
                const live = actief && geselecteerd ? geselecteerd : p

                return (
                  <div key={p.id}>
                    <button
                      type="button"
                      onClick={() => kiesProduct(p.id)}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left shadow-sm ring-1 transition ${
                        actief ? 'bg-violet-100 ring-violet-400' : 'bg-white ring-slate-100'
                      }`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                        🛒
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800">{p.naam}</p>
                        <p className="text-xs text-slate-500">
                          {p.merk} · {p.rekkenlocatie?.label}
                        </p>
                        <div className="mt-1">
                          <StockBadge magazijn={p.magazijnVoorraad} rekken={p.rekkenVoorraad} />
                        </div>
                      </div>
                    </button>

                    {actief && geselecteerd && actiePaneel(live, 'kassa')}
                  </div>
                )
              })
            ) : (
              <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
                Geen producten gevonden voor &quot;{zoek}&quot;.
              </p>
            )}
          </div>
        </section>

        {verkoopLog.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Recente verkopen</h2>
            <div className="space-y-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              {verkoopLog.slice(0, 8).map((item) => (
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
