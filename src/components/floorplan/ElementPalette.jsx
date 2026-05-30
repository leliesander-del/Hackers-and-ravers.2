import { floorplanTypes } from '../../data/floorplanTypes.js'

function PalettePreview({ preview }) {
  if (preview === 'line') {
    return <div className="h-1.5 w-14 rounded-sm bg-slate-800" />
  }
  if (preview === 'shelf-dark') {
    return (
      <div className="flex h-8 w-14 flex-col justify-center gap-0.5 rounded-lg bg-gradient-to-b from-violet-500 to-violet-800 px-1 shadow-sm">
        <div className="h-px w-full bg-violet-300/60" />
        <div className="h-px w-full bg-violet-300/60" />
      </div>
    )
  }
  if (preview === 'shelf-light') {
    return (
      <div className="flex h-8 w-14 flex-col justify-center gap-0.5 rounded-lg border border-dashed border-violet-300 bg-gradient-to-b from-violet-100 to-violet-200 px-1">
        <div className="h-px w-full bg-violet-400/50" />
        <div className="h-px w-full bg-violet-400/50" />
      </div>
    )
  }
  if (preview === 'kassa') {
    return (
      <div className="flex h-9 w-12 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-700 shadow-sm">
        <div className="mb-0.5 h-3 w-8 rounded-sm bg-white" />
        <span className="text-[8px] font-bold text-white">KASSA</span>
      </div>
    )
  }
  if (preview === 'ingang') {
    return <span className="text-sm font-semibold text-emerald-600">Ingang</span>
  }
  if (preview === 'uitgang') {
    return <span className="text-sm font-semibold text-red-600">Uitgang</span>
  }
  return null
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
        <h2 className="text-sm font-bold text-slate-800">Elementen</h2>
        <p className="mt-0.5 text-xs text-slate-500">Sleep naar je winkel</p>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {floorplanTypes.map((item) => (
          <li key={item.type}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="flex cursor-grab items-center gap-3 rounded-xl border border-slate-100 bg-[#f6f4fc] px-3 py-3 transition hover:border-violet-200 hover:bg-violet-50 active:cursor-grabbing"
            >
              <div className="flex h-10 w-16 shrink-0 items-center justify-center">
                <PalettePreview preview={item.preview} />
              </div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
