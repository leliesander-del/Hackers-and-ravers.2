import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getPersoneelWinkelId } from '../lib/staffAccess.js'
import { useStaffAantal } from '../lib/staffAantal.js'
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
        actief ? 'bg-brand-100 ring-brand-400' : 'bg-slate-50 ring-slate-100 hover:bg-brand-50'
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
  const [melding, setMelding] = useState(null)

  const winkelProducten = useMemo(
    () => (winkelId ? productsByStoreLive(winkelId) : []),
    [productsByStoreLive, winkelId],
  )

  const { uit, legeRekken, rekkenBijnaOp, veel } = useMemo(
    () => groepeerVoorraadPerRekken(winkelProducten),
    [winkelProducten],
  )

  const geselecteerd = geselecteerdId ? getProductLive(geselecteerdId) : null
  const maxMagazijn = geselecteerd?.magazijnVoorraad ?? 0
  const { parseAantal, resetAantal, aantalInputProps } = useStaffAantal(maxMagazijn)

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
    const max = product.magazijnVoorraad ?? 0
    return (
      <StaffProductActiePaneel
        product={product}
        variant="violet"
        modus="bijvullen"
        inputId={`rek-aantal-${product.id}`}
        {...aantalInputProps(verplaatsNaarRekkenActie)}
        maxAantal={max}
        toonDoelRekken
        actieLabel={`${aantal} stuks magazijn → rekken`}
        onActie={verplaatsNaarRekkenActie}
        actieDisabled={max === 0}
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
            <p className="text-2xl font-bold text-rose-600">{uit.length}</p>
            <p className="text-[10px] font-medium text-rose-700">Uit voorraad</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
            <p className="text-2xl font-bold text-orange-600">{legeRekken.length}</p>
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

        <CollapsibleSection titel="Uit voorraad" aantal={uit.length} kleur="rose" standaardOpen={uit.length > 0}>
          <p className="px-1 text-[11px] font-medium text-slate-500">Rekken en magazijn leeg</p>
          {uit.length ? (
            uit.map(renderProductMetActies)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">Geen producten die overal uit voorraad zijn.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          titel="Rekken leeg"
          aantal={legeRekken.length}
          kleur="orange"
          standaardOpen={legeRekken.length > 0}
        >
          <p className="px-1 text-[11px] font-medium text-slate-500">Magazijn heeft nog voorraad</p>
          {legeRekken.length ? (
            legeRekken.map(renderProductMetActies)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">Geen lege rekken met magazijnvoorraad.</p>
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
