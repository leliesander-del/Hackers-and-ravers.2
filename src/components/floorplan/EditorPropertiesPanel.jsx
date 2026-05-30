import { useEffect, useState } from 'react'
import { getFloorplanType } from '../../data/floorplanTypes.js'
import { clampSize, format2, isResizable, isShelf } from '../../lib/floorplanGeometry.js'

export default function EditorPropertiesPanel({
  selected,
  snapEnabled,
  onSnapToggle,
  onLabelChange,
  onSizeChange,
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
      <aside className="flex w-64 shrink-0 flex-col border-l border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-800">Eigenschappen</h2>
        <p className="mt-2 text-xs text-slate-500">Selecteer een element om te bewerken.</p>
        <label className="mt-6 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => onSnapToggle(e.target.checked)}
            className="rounded border-slate-300 text-brand-600"
          />
          Magnetisch uitlijnen (snap)
        </label>
      </aside>
    )
  }

  const def = getFloorplanType(selected.type)
  const kanLabel = isShelf(selected.type)
  const kanResize = isResizable(selected.type)

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

  return (
    <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-4">
      <h2 className="text-sm font-bold text-slate-800">Eigenschappen</h2>
      <p className="mt-0.5 text-xs text-brand-600">{def?.label}</p>

      {kanLabel && (
        <div className="mt-4">
          <label htmlFor="rek-label" className="mb-1 block text-xs font-medium text-slate-500">
            Naam van het rek
          </label>
          <input
            id="rek-label"
            type="text"
            value={selected.label || ''}
            onChange={(e) => onLabelChange(selected.id, e.target.value)}
            placeholder="bv. Zuivel, Brood…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      )}

      {kanResize && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-slate-500">Afmetingen (sleep hoeken op canvas)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] uppercase text-slate-400">Breedte</label>
              <input
                type="text"
                inputMode="decimal"
                value={draftW}
                onChange={(e) => setDraftW(e.target.value)}
                onBlur={commitW}
                onKeyDown={(e) => e.key === 'Enter' && commitW()}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase text-slate-400">Diepte</label>
              <input
                type="text"
                inputMode="decimal"
                value={draftH}
                onChange={(e) => setDraftH(e.target.value)}
                onBlur={commitH}
                onKeyDown={(e) => e.key === 'Enter' && commitH()}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
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
        Magnetisch uitlijnen (snap)
      </label>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        Tip: sleep de witte hoekpunten om uit te rekken. Afmetingen bevestig je met Enter of door het veld te verlaten.
      </p>
    </aside>
  )
}
