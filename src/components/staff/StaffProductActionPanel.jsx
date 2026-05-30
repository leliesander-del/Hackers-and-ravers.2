import { useEffect, useRef } from 'react'
import StockBadge from './StockBadge.jsx'

// One violet brand accent for both staff flows (restock and sell).
const THEMES = {
  emerald: {
    border: 'border-brand-300',
    bg: 'bg-brand-50',
    restock: 'bg-brand-600 text-white',
    remove: 'bg-brand-600 text-white',
  },
  violet: {
    border: 'border-brand-300',
    bg: 'bg-brand-50',
    restock: 'bg-brand-600 text-white',
    remove: 'bg-brand-600 text-white',
  },
}

/** @typedef {'restock' | 'remove'} StaffActionMode */

export default function StaffProductActionPanel({
  product,
  variant = 'emerald',
  mode,
  inputId,
  quantityText,
  onQuantityChange,
  onQuantityBlur,
  onQuantityKeyDown,
  onChangeQuantity,
  actionLabel,
  onAction,
  actionDisabled = false,
  maxQuantity,
  showShelfTarget = false,
  onClose,
}) {
  const panelRef = useRef(null)
  const theme = THEMES[variant] ?? THEMES.emerald
  const buttonClass = mode === 'restock' ? theme.restock : theme.remove
  const currentQuantity = parseInt(quantityText, 10) || 1
  const hasMax = maxQuantity != null && maxQuantity > 0
  const atMinimum = currentQuantity <= 1
  const atMaximum = hasMax && currentQuantity >= maxQuantity

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [product.id])

  return (
    <section
      ref={panelRef}
      className={`mt-1 rounded-xl border-2 ${theme.border} ${theme.bg} p-3`}
      aria-label={`Actions for ${product.name}`}
    >
      <p className="text-xs font-medium text-slate-500">Selected</p>
      <p className="font-bold text-slate-800">{product.name}</p>
      <p className="text-xs text-slate-500">
        {product.brand} · {product.shelfLocation?.label}
      </p>
      <div className="mt-2">
        <StockBadge warehouse={product.warehouseStock} shelves={product.shelfStock} />
      </div>

      {showShelfTarget && (
        <p className="mt-2 text-xs text-slate-600">
          Shelf target: <strong>{product.targetShelfStock}</strong> · Restock from{' '}
          <strong>{Math.ceil(product.targetShelfStock / 2)}</strong>
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <label htmlFor={inputId} className="text-sm text-slate-600">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeQuantity(-1)}
            disabled={atMinimum || maxQuantity === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-600 shadow-sm disabled:opacity-40"
          >
            −
          </button>
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            value={quantityText}
            onChange={onQuantityChange}
            onBlur={onQuantityBlur}
            onKeyDown={onQuantityKeyDown}
            disabled={maxQuantity === 0}
            className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-sm font-bold shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
          />
          <button
            type="button"
            onClick={() => onChangeQuantity(1)}
            disabled={atMaximum || maxQuantity === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-600 shadow-sm disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={actionDisabled}
        className={`mt-3 w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50 ${buttonClass}`}
      >
        {actionLabel}
      </button>

      {onClose && (
        <button type="button" onClick={onClose} className="mt-2 w-full text-center text-xs text-slate-500">
          Close
        </button>
      )}
    </section>
  )
}
