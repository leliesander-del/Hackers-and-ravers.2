import { getFloorplanType } from '../../data/floorplanTypes.js'

function elementSize(el) {
  const def = getFloorplanType(el.type)
  if (!def) return { w: 10, h: 10 }
  if (el.type === 'ingang' || el.type === 'uitgang') return { w: 0, h: 0 }
  return { w: def.defaultW, h: def.defaultH }
}

function rotationDegrees(el) {
  const r = Number(el.rotation) || 0
  return ((r % 360) + 360) % 360
}

function FloorplanElement({ el, selected, onSelect, onPointerDown, onDoubleClick }) {
  const { w, h } = elementSize(el)
  const rot = rotationDegrees(el)

  const handlers = onPointerDown
    ? {
        onPointerDown: (e) => {
          e.stopPropagation()
          onPointerDown(el.id, e)
        },
        onDoubleClick: onDoubleClick
          ? (e) => {
              e.stopPropagation()
              onDoubleClick(el.id)
            }
          : undefined,
        style: { cursor: 'grab' },
      }
    : onSelect
      ? {
          onClick: (e) => {
            e.stopPropagation()
            onSelect(el.id)
          },
          style: { cursor: 'pointer' },
        }
      : {}

  const transform = rot ? `rotate(${rot} ${el.x} ${el.y})` : undefined

  if (el.type === 'muur') {
    return (
      <g transform={transform} {...handlers}>
        <rect
          x={el.x - w / 2}
          y={el.y - h / 2}
          width={w}
          height={h}
          rx={0.4}
          fill="#0f172a"
          stroke={selected ? '#7c3aed' : 'none'}
          strokeWidth={selected ? 0.8 : 0}
        />
      </g>
    )
  }

  if (el.type === 'vast-rek') {
    return (
      <g transform={transform} {...handlers}>
        <rect
          x={el.x - w / 2}
          y={el.y - h / 2}
          width={w}
          height={h}
          rx="2"
          fill="#475569"
          stroke={selected ? '#7c3aed' : '#334155'}
          strokeWidth={selected ? 0.8 : 0.4}
        />
      </g>
    )
  }

  if (el.type === 'tijdelijk-rek') {
    return (
      <g transform={transform} {...handlers}>
        <rect
          x={el.x - w / 2}
          y={el.y - h / 2}
          width={w}
          height={h}
          rx="2"
          fill="#cbd5e1"
          stroke={selected ? '#7c3aed' : '#94a3b8'}
          strokeWidth={selected ? 0.8 : 0.4}
        />
      </g>
    )
  }

  if (el.type === 'kassa') {
    return (
      <g transform={transform} {...handlers}>
        <ellipse
          cx={el.x}
          cy={el.y}
          rx={w / 2}
          ry={h / 2}
          fill="#475569"
          stroke={selected ? '#7c3aed' : '#0f172a'}
          strokeWidth={selected ? 0.8 : 0.5}
          strokeDasharray="1.2 1"
        />
      </g>
    )
  }

  if (el.type === 'ingang') {
    return (
      <g {...handlers}>
        <text
          x={el.x}
          y={el.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="4.5"
          fontWeight="600"
          fill="#16a34a"
        >
          Ingang
        </text>
        {selected && (
          <rect
            x={el.x - 10}
            y={el.y - 4}
            width="20"
            height="8"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="0.5"
            rx="1"
          />
        )}
      </g>
    )
  }

  if (el.type === 'uitgang') {
    return (
      <g {...handlers}>
        <text
          x={el.x}
          y={el.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="4.5"
          fontWeight="600"
          fill="#dc2626"
        >
          Uitgang
        </text>
        {selected && (
          <rect
            x={el.x - 10}
            y={el.y - 4}
            width="20"
            height="8"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="0.5"
            rx="1"
          />
        )}
      </g>
    )
  }

  return null
}

export default function FloorplanRenderer({
  elements = [],
  products = [],
  highlight,
  entrance,
  selectedId,
  onSelectElement,
  onElementPointerDown,
  onElementDoubleClick,
  className = 'w-full rounded-2xl bg-white shadow-sm',
  showShelves = true,
  svgRef,
  onSvgPointerDown,
  onDragOver,
  onDrop,
}) {
  const schappen = []
  if (showShelves) {
    for (const p of products) {
      if (p.schaplocatie && !schappen.some((s) => s.label === p.schaplocatie.label)) {
        schappen.push(p.schaplocatie)
      }
    }
  }

  const ingangEl = elements.find((el) => el.type === 'ingang')
  const ingang = entrance || (ingangEl ? { x: ingangEl.x, y: ingangEl.y } : { x: 50, y: 96 })

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 104"
      className={className}
      role="img"
      aria-label="Plattegrond"
      onPointerDown={onSvgPointerDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <rect
        x="2"
        y="2"
        width="96"
        height="100"
        rx="4"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="1.2"
        onPointerDown={onSvgPointerDown}
      />

      {elements.map((el) => (
        <FloorplanElement
          key={el.id}
          el={el}
          selected={selectedId === el.id}
          onSelect={onSelectElement}
          onPointerDown={onElementPointerDown}
          onDoubleClick={onElementDoubleClick}
        />
      ))}

      {highlight && (
        <line
          x1={ingang.x}
          y1={ingang.y}
          x2={highlight.x}
          y2={highlight.y}
          stroke="#7c3aed"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}

      {showShelves &&
        schappen.map((s) => {
          const actief = highlight && highlight.label === s.label
          return (
            <g key={s.label}>
              <rect
                x={s.x - 5}
                y={s.y - 3}
                width="10"
                height="6"
                rx="1"
                fill={actief ? '#ede9fe' : '#fef3c7'}
                stroke={actief ? '#7c3aed' : '#f59e0b'}
                strokeWidth="0.4"
              />
              <text x={s.x} y={s.y + 0.8} textAnchor="middle" fontSize="2.2" fill="#92400e">
                {s.label}
              </text>
            </g>
          )
        })}

      {highlight && (
        <circle cx={highlight.x} cy={highlight.y} r="2.6" fill="#7c3aed">
          <animate attributeName="r" values="2.6;3.6;2.6" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}
