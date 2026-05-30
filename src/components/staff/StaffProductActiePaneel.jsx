import { useEffect, useRef } from 'react'
import StockBadge from './StockBadge.jsx'

// Eén violet merk-accent voor beide personeelsflows (bijvullen én verkopen).
const THEMES = {
  emerald: {
    border: 'border-brand-300',
    bg: 'bg-brand-50',
    bijvullen: 'bg-brand-600 text-white',
    verwijderen: 'bg-brand-600 text-white',
  },
  violet: {
    border: 'border-brand-300',
    bg: 'bg-brand-50',
    bijvullen: 'bg-brand-600 text-white',
    verwijderen: 'bg-brand-600 text-white',
  },
}

/** @typedef {'bijvullen' | 'verwijderen'} PersoneelActieModus */

export default function StaffProductActiePaneel({
  product,
  variant = 'emerald',
  modus,
  inputId,
  aantalTekst,
  onAantalChange,
  onAantalBlur,
  onAantalKeyDown,
  onWijzigAantal,
  actieLabel,
  onActie,
  actieDisabled = false,
  maxAantal,
  toonDoelRekken = false,
  onSluiten,
}) {
  const paneelRef = useRef(null)
  const theme = THEMES[variant] ?? THEMES.emerald
  const knopKlasse = modus === 'bijvullen' ? theme.bijvullen : theme.verwijderen
  const huidigAantal = parseInt(aantalTekst, 10) || 1
  const heeftMax = maxAantal != null && maxAantal > 0
  const bijMinimum = huidigAantal <= 1
  const bijMaximum = heeftMax && huidigAantal >= maxAantal

  useEffect(() => {
    paneelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [product.id])

  return (
    <section
      ref={paneelRef}
      className={`mt-1 rounded-xl border-2 ${theme.border} ${theme.bg} p-3`}
      aria-label={`Acties voor ${product.naam}`}
    >
      <p className="text-xs font-medium text-slate-500">Geselecteerd</p>
      <p className="font-bold text-slate-800">{product.naam}</p>
      <p className="text-xs text-slate-500">
        {product.merk} · {product.rekkenlocatie?.label}
      </p>
      <div className="mt-2">
        <StockBadge magazijn={product.magazijnVoorraad} rekken={product.rekkenVoorraad} />
      </div>

      {toonDoelRekken && (
        <p className="mt-2 text-xs text-slate-600">
          Doel op rekken: <strong>{product.doelRekkenVoorraad}</strong> · Bijvullen vanaf{' '}
          <strong>{Math.ceil(product.doelRekkenVoorraad / 2)}</strong>
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <label htmlFor={inputId} className="text-sm text-slate-600">
          Aantal
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onWijzigAantal(-1)}
            disabled={bijMinimum || maxAantal === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-600 shadow-sm disabled:opacity-40"
          >
            −
          </button>
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            value={aantalTekst}
            onChange={onAantalChange}
            onBlur={onAantalBlur}
            onKeyDown={onAantalKeyDown}
            disabled={maxAantal === 0}
            className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-sm font-bold shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
          />
          <button
            type="button"
            onClick={() => onWijzigAantal(1)}
            disabled={bijMaximum || maxAantal === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-600 shadow-sm disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onActie}
        disabled={actieDisabled}
        className={`mt-3 w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50 ${knopKlasse}`}
      >
        {actieLabel}
      </button>

      {onSluiten && (
        <button type="button" onClick={onSluiten} className="mt-2 w-full text-center text-xs text-slate-500">
          Sluiten
        </button>
      )}
    </section>
  )
}
