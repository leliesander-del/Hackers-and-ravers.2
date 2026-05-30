import { useEffect, useState } from 'react'
import { formatCategoryLabel } from '../../lib/productCategories.js'
import { getFloorplanType } from '../../data/floorplanTypes.js'
import { getDefaultStyleForType, isStyleable } from '../../lib/floorplanElementStyle.js'
import { clampSize, format2, isResizable } from '../../lib/floorplanGeometry.js'

function ColorField({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-11 shrink-0 cursor-pointer border border-slate-200 bg-white p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 border border-slate-200 bg-slate-50 px-2 py-1.5 font-mono text-xs uppercase outline-none focus:border-violet-400"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default function EditorPropertiesPanel({
  selected,
  categories = [],
  snapEnabled,
  onSnapToggle,
  onLabelChange,
  onSizeChange,
  onStyleChange,
}) {
  const [draftW, setDraftW] = useState('')
  const [draftH, setDraftH] = useState('')

  useEffect(() => {
    if (!selected) return
    const def = getFloorplanType(selected.type)
    setDraftW(format2(selected.w ?? def?.defaultW ?? 0))
    setDraftH(format2(selected.h ?? def?.defaultH ?? 0))
  }, [selected?.id, selected?.w, selected?.h])

  if (!selected) {
    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-800">Properties</h2>
        <p className="mt-2 text-xs text-slate-500">Select an element to edit it.</p>
        <label className="mt-6 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => onSnapToggle(e.target.checked)}
            className="rounded border-slate-300 text-brand-600"
          />
          Magnetic alignment (snap)
        </label>
      </aside>
    )
  }

  const def = getFloorplanType(selected.type)
  const canLabel = def?.labelable
  const isShelf = selected.type === 'fixed-shelf' || selected.type === 'temp-shelf'
  const canResize = isResizable(selected.type)
  const canStyle = isStyleable(selected.type)
  const styleDefaults = getDefaultStyleForType(selected.type)
  const style = canStyle
    ? {
        fillColor: selected.fillColor || styleDefaults.fillColor,
        strokeColor: selected.strokeColor || styleDefaults.strokeColor,
        textColor: selected.textColor || styleDefaults.textColor,
        textSize: selected.textSize ?? styleDefaults.textSize,
      }
    : null

  function commitW() {
    const w = parseFloat(draftW)
    if (Number.isNaN(w)) return
    const h = parseFloat(draftH) || selected.h || def.defaultH
    onSizeChange(selected.id, clampSize(selected.type, w, h))
  }

  function commitH() {
    const h = parseFloat(draftH)
    if (Number.isNaN(h)) return
    const w = parseFloat(draftW) || selected.w || def.defaultW
    onSizeChange(selected.id, clampSize(selected.type, w, h))
  }

  function patchStyle(patch) {
    onStyleChange(selected.id, patch)
  }

  function resetStyle() {
    if (!styleDefaults) return
    onStyleChange(selected.id, {
      fillColor: styleDefaults.fillColor,
      strokeColor: styleDefaults.strokeColor,
      textColor: styleDefaults.textColor,
      textSize: styleDefaults.textSize,
    })
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-4">
      <h2 className="text-sm font-bold text-slate-800">Properties</h2>
      <p className="mt-0.5 text-xs text-brand-600">{def?.label}</p>

      {canLabel && (
        <div className="mt-4">
          <label htmlFor="el-label" className="mb-1 block text-xs font-medium text-slate-500">
            {selected.type === 'checkout'
              ? 'Checkout text'
              : selected.type === 'entrance' || selected.type === 'exit'
                ? 'Label'
                : 'Shelf category'}
          </label>
          {isShelf ? (
            <select
              id="el-label"
              value={selected.label || ''}
              onChange={(e) => onLabelChange(selected.id, e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">— Choose category —</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryLabel(cat)}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="el-label"
              type="text"
              value={selected.label || ''}
              onChange={(e) => onLabelChange(selected.id, e.target.value)}
              placeholder={
                selected.type === 'checkout'
                  ? 'CHECKOUT'
                  : selected.type === 'entrance'
                    ? 'Entrance'
                    : 'Exit'
              }
              className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          )}
          {isShelf && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              Choose a category from your assortment. Products and ingredients from the cart are routed here.
            </p>
          )}
        </div>
      )}

      {canStyle && style && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Appearance</p>
            <button
              type="button"
              onClick={resetStyle}
              className="text-[10px] font-medium text-violet-600 hover:text-violet-800"
            >
              Default
            </button>
          </div>

          <ColorField
            id="fill-color"
            label="Background"
            value={style.fillColor}
            onChange={(fillColor) => patchStyle({ fillColor })}
          />
          <ColorField
            id="stroke-color"
            label="Border"
            value={style.strokeColor}
            onChange={(strokeColor) => patchStyle({ strokeColor })}
          />
          <ColorField
            id="text-color"
            label="Text color"
            value={style.textColor}
            onChange={(textColor) => patchStyle({ textColor })}
          />

          <div>
            <label htmlFor="text-size" className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-400">
              <span>Text size</span>
              <span className="font-mono normal-case text-slate-600">{style.textSize}</span>
            </label>
            <input
              id="text-size"
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={style.textSize}
              onChange={(e) => patchStyle({ textSize: parseFloat(e.target.value) })}
              className="w-full accent-violet-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      )}

      {canResize && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-500">Dimensions (drag corners on the canvas)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] uppercase text-slate-400">Width</label>
              <input
                type="text"
                inputMode="decimal"
                value={draftW}
                onChange={(e) => setDraftW(e.target.value)}
                onBlur={commitW}
                onKeyDown={(e) => e.key === 'Enter' && commitW()}
                className="w-full border border-slate-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase text-slate-400">Depth</label>
              <input
                type="text"
                inputMode="decimal"
                value={draftH}
                onChange={(e) => setDraftH(e.target.value)}
                onBlur={commitH}
                onKeyDown={(e) => e.key === 'Enter' && commitH()}
                className="w-full border border-slate-200 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <label className="mt-6 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={snapEnabled}
          onChange={(e) => onSnapToggle(e.target.checked)}
          className="rounded border-slate-300 text-brand-600"
        />
        Magnetic alignment (snap)
      </label>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        Choose a category per shelf. Drag corners to scale or type width and depth above.
      </p>
    </aside>
  )
}
