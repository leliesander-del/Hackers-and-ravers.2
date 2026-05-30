import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getPersoneelWinkelId } from '../lib/staffAccess.js'
import { groepeerVoorraadPerRekken } from '../lib/staffStock.js'
import PageHeader from '../components/PageHeader.jsx'
import StockBadge from '../components/staff/StockBadge.jsx'
import CollapsibleSection from '../components/staff/CollapsibleSection.jsx'
import StaffProductActiePaneel from '../components/staff/StaffProductActiePaneel.jsx'

function ProductRij({ product, actief, onClick }) {
  const doel = product.doelRekkenVoorraad
  return (
    <button
      type="button"
      onClick={() => onClick(product.id)}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1 transition ${
        actief ? 'bg-emerald-100 ring-emerald-400' : 'bg-slate-50 ring-slate-100 hover:bg-emerald-50'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-800">{product.naam}</p>
        <p className="truncate text-xs text-slate-500">
          {product.merk} · {product.rekkenlocatie?.label} · doel {doel} op rekken
        </p>
      </div>
      <StockBadge magazijn={product.magazijnVoorraad} rekken={product.rekkenVoorraad} compact />
    </button>
  )
}

export default function DashboardPage() {
  const { activeProfile, productsByStoreLive, getProductLive, verplaatsNaarRekken } = useStore()

  const winkelId = getPersoneelWinkelId(activeProfile)
  const winkel = winkelId ? getStore(winkelId) : null

  const [geselecteerdId, setGeselecteerdId] = useState(null)
  const [aantalTekst, setAantalTekst] = useState('1')
  const [melding, setMelding] = useState(null)

  const winkelProducten = useMemo(
    () => (winkelId ? productsByStoreLive(winkelId) : []),
    [productsByStoreLive, winkelId],
  )

  const { uit, legeRekken, rekkenGeenMagazijn, rekkenBijnaOp, veel } = useMemo(
    () => groepeerVoorraadPerRekken(winkelProducten),
    [winkelProducten],
  )

  const geselecteerd = geselecteerdId ? getProductLive(geselecteerdId) : null

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
    resetAantal()
  }

  function verplaatsNaarRekkenActie() {
    if (!geselecteerdId) return
    const result = verplaatsNaarRekken(geselecteerdId, parseAantal())
    if (result.ok) {
      toonMelding('Naar rekken verplaatst!', 'ok')
      resetAantal()
      setGeselecteerdId(null)
    } else {
      toonMelding(result.fout, 'fout')
    }
  }

  function actiePaneelVoorProduct(product) {
    const aantal = parseAantal()
    return (
      <StaffProductActiePaneel
        product={product}
        variant="emerald"
        modus="bijvullen"
        inputId={`rek-aantal-${product.id}`}
        {...aantalInputProps(verplaatsNaarRekkenActie)}
        toonDoelRekken
        actieLabel={`${aantal} stuks magazijn → rekken`}
        onActie={verplaatsNaarRekkenActie}
        actieDisabled={product.magazijnVoorraad === 0}
        onSluiten={() => setGeselecteerdId(null)}
      />
    )
  }

  function renderProductMetActies(product) {
    const actief = geselecteerdId === product.id
    return (
      <div key={product.id}>
        <ProductRij product={product} actief={actief} onClick={kiesProduct} />
        {actief && geselecteerd && actiePaneelVoorProduct(geselecteerd)}
      </div>
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
      <PageHeader title="Rekkenvuller" subtitle={winkel.naam} />

      <div className="space-y-4 px-4 py-4">
        {melding && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              melding.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {melding.tekst}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-rose-50 p-3 ring-1 ring-rose-100">
            <p className="text-2xl font-bold text-rose-600">{rekkenGeenMagazijn.length}</p>
            <p className="text-[10px] font-medium text-rose-700">Uit voorraad</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
            <p className="text-2xl font-bold text-orange-600">{uit.length + legeRekken.length}</p>
            <p className="text-[10px] font-medium text-orange-800">Rekken leeg</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
            <p className="text-2xl font-bold text-amber-600">{rekkenBijnaOp.length}</p>
            <p className="text-[10px] font-medium text-amber-700">Rekken bijna op</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
            <p className="text-2xl font-bold text-emerald-600">{veel.length}</p>
            <p className="text-[10px] font-medium text-emerald-700">Veel op rekken</p>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Tik op een product om vanuit het magazijn bij te vullen op de rekken. De actie verschijnt direct onder het
          gekozen product.
        </p>

        <CollapsibleSection
          titel="Uit voorraad"
          aantal={rekkenGeenMagazijn.length}
          kleur="rose"
          standaardOpen={rekkenGeenMagazijn.length > 0}
        >
          <p className="px-1 text-[11px] font-medium text-slate-500">Op rekken, magazijn uit voorraad</p>
          {rekkenGeenMagazijn.length ? (
            rekkenGeenMagazijn.map(renderProductMetActies)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">Alles op rekken heeft nog magazijnvoorraad.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          titel="Rekken leeg"
          aantal={uit.length + legeRekken.length}
          kleur="orange"
          standaardOpen={uit.length + legeRekken.length > 0}
        >
          {legeRekken.length > 0 && (
            <>
              <p className="px-1 text-[11px] font-medium text-slate-500">Magazijn heeft nog voorraad</p>
              {legeRekken.map(renderProductMetActies)}
            </>
          )}
          {legeRekken.length > 0 && uit.length > 0 && <hr className="border-slate-100" />}
          {uit.length > 0 && (
            <>
              <p className="px-1 text-[11px] font-medium text-slate-500">Overal uit voorraad</p>
              {uit.map(renderProductMetActies)}
            </>
          )}
          {uit.length + legeRekken.length === 0 && (
            <p className="py-2 text-center text-xs text-slate-400">Geen lege rekken.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          titel="Rekken bijna op"
          aantal={rekkenBijnaOp.length}
          kleur="amber"
          standaardOpen={rekkenBijnaOp.length > 0}
        >
          {rekkenBijnaOp.length ? (
            rekkenBijnaOp.map(renderProductMetActies)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">Alles op rekken boven de helft van het doel.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection titel="Veel op rekken" aantal={veel.length} kleur="emerald">
          {veel.length ? (
            veel.map(renderProductMetActies)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">Geen producten met veel rekkenvoorraad.</p>
          )}
        </CollapsibleSection>
      </div>
    </div>
  )
}
