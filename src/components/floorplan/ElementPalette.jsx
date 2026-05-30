import { floorplanTypes } from '../../data/floorplanTypes.js'

function PalettePreview({ preview }) {
  if (preview === 'line') {
    return <div className="h-1.5 w-14 bg-slate-800" />
  }
  if (preview === 'shelf-dark') {
    return <div className="h-9 w-9 border border-[#5b21b6] bg-[#7c3aed] shadow-sm" />
  }
  if (preview === 'shelf-light') {
    return <div className="h-9 w-9 border border-[#7c3aed] bg-[#a78bfa]" style={{ borderWidth: '1px' }} />
  }
  if (preview === 'kassa') {
    return <div className="flex h-9 w-12 items-center justify-center border border-[#4c1d95] bg-[#5b21b6] text-[7px] font-bold text-white">KASSA</div>
  }
  if (preview === 'ingang') {
    return (
      <span className="border border-emerald-600 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
        Ingang
      </span>
    )
  }
  if (preview === 'uitgang') {
    return (
      <span className="border border-red-600 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
        Uitgang
      </span>
    )
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
        <p className="mt-0.5 text-xs text-slate-500">Sleep muur, rekken, kassa, ingang of uitgang naar je winkel</p>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {floorplanTypes.map((item) => (
          <li key={item.type}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="flex cursor-grab items-center gap-3 border border-slate-100 bg-[#f6f4fc] px-3 py-3 transition hover:border-violet-200 hover:bg-violet-50 active:cursor-grabbing"
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
