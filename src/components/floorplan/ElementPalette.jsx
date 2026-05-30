import { floorplanTypes } from '../../data/floorplanTypes.js'
import { getDefaultStyleForType } from '../../lib/floorplanElementStyle.js'

/** Mini preview — same style as ShelfVisual / checkout / door visuals on the map. */
function PaletteElementPreview({ type }) {
  if (type === 'wall') {
    return (
      <svg viewBox="0 0 56 10" className="h-2.5 w-14" aria-hidden>
        <rect x="0" y="3" width="56" height="4" fill="#1e293b" />
      </svg>
    )
  }

  const def = getDefaultStyleForType(type)
  if (!def) return null

  if (type === 'fixed-shelf' || type === 'temp-shelf') {
    const isTemp = type === 'temp-shelf'
    return (
      <svg viewBox="0 0 56 40" className="h-10 w-14" aria-hidden>
        <rect
          x="8"
          y="4"
          width="40"
          height="32"
          fill={def.fillColor}
          stroke={def.strokeColor}
          strokeWidth={isTemp ? 1.2 : 1.8}
        />
      </svg>
    )
  }

  const label = def.label ?? ''
  return (
    <svg viewBox="0 0 56 36" className="h-9 w-14" aria-hidden>
      <rect
        x="4"
        y="2"
        width="48"
        height="32"
        fill={def.fillColor}
        stroke={def.strokeColor}
        strokeWidth="1.6"
      />
      {label && (
        <text
          x="28"
          y="19"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={type === 'checkout' ? 8 : 9}
          fontWeight="700"
          fill={def.textColor}
        >
          {label}
        </text>
      )}
    </svg>
  )
}

export default function ElementPalette({ onDragStart }) {
  function handleDragStart(e, type) {
    e.dataTransfer.setData('application/x-floorplan-type', type)
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart?.(type)
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-4">
        <h2 className="text-sm font-bold text-slate-800">Elements</h2>
        <p className="mt-0.5 text-xs text-slate-500">Drag a wall, shelves, checkout, entrance or exit onto your store</p>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {floorplanTypes.map((item) => (
          <li key={item.type}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="flex cursor-grab items-center gap-3 rounded-xl border border-slate-100 bg-[#f6f4fc] px-3 py-3 transition hover:border-brand-200 hover:bg-brand-50 active:cursor-grabbing"
            >
              <div className="flex h-10 w-16 shrink-0 items-center justify-center">
                <PaletteElementPreview type={item.type} />
              </div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
