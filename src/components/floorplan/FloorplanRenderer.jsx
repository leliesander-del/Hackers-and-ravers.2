import {
  elementSize,
  getBounds,
  isResizable,
  isShelf,
  rotationDegrees,
} from '../../lib/floorplanGeometry.js'

const HANDLE_R = 1.8
const HANDLE_HIT = 2.8

const GRID_MINOR = 2
const GRID_MAJOR = 10

function EditorGrid() {
  const lines = []
  for (let x = 2; x <= 98; x += GRID_MINOR) {
    const major = x % GRID_MAJOR === 0
    lines.push(
      <line
        key={`gv-${x}`}
        x1={x}
        y1={2}
        x2={x}
        y2={102}
        stroke={major ? '#c4b5fd' : '#e9d5ff'}
        strokeWidth={major ? 0.2 : 0.1}
      />,
    )
  }
  for (let y = 2; y <= 102; y += GRID_MINOR) {
    const major = y % GRID_MAJOR === 0
    lines.push(
      <line
        key={`gh-${y}`}
        x1={2}
        y1={y}
        x2={98}
        y2={y}
        stroke={major ? '#c4b5fd' : '#e9d5ff'}
        strokeWidth={major ? 0.2 : 0.1}
      />,
    )
  }
  return <g aria-hidden="true">{lines}</g>
}

function ShelfVisual({ w, h, variant, label, selected, uid }) {
  const isTemp = variant === 'tijdelijk-rek'
  const gradId = isTemp ? `rekTempGrad-${uid}` : `rekVastGrad-${uid}`
  const rows = Math.max(2, Math.floor(h / 2.8))

  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {isTemp ? (
            <>
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#5b21b6" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx="2.2"
        fill={`url(#${gradId})`}
        stroke={selected ? '#f5f3ff' : isTemp ? '#a78bfa' : '#4c1d95'}
        strokeWidth={selected ? 0.7 : 0.45}
        strokeDasharray={isTemp ? '1.5 0.8' : undefined}
      />
      {Array.from({ length: rows }).map((_, i) => {
        const y = -h / 2 + (h / (rows + 1)) * (i + 1)
        return (
          <line
            key={i}
            x1={-w / 2 + 1}
            y1={y}
            x2={w / 2 - 1}
            y2={y}
            stroke={isTemp ? '#8b5cf6' : '#ddd6fe'}
            strokeWidth="0.25"
            opacity="0.7"
          />
        )
      })}
      {label && (
        <text
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.min(2.4, w / 6, h / 2.8)}
          fontWeight="600"
          fill="#0f172a"
          pointerEvents="none"
        >
          {label.length > 16 ? `${label.slice(0, 15)}…` : label}
        </text>
      )}
    </>
  )
}

function KassaVisual({ w, h, selected, uid }) {
  return (
    <>
      <defs>
        <linearGradient id={`kassaGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx="2.5"
        fill={`url(#kassaGrad-${uid})`}
        stroke={selected ? '#ede9fe' : '#4c1d95'}
        strokeWidth={selected ? 0.7 : 0.5}
      />
      <rect
        x={-w / 2 + 1.2}
        y={-h / 2 + 1.2}
        width={w - 2.4}
        height={h * 0.45}
        rx="1"
        fill="#f5f3ff"
        opacity="0.95"
      />
      <rect x={-w / 2 + 2} y={h / 2 - 2.8} width={w - 4} height="1.6" rx="0.4" fill="#c4b5fd" />
      <text y={-h / 2 + h * 0.28} textAnchor="middle" fontSize="2.2" fontWeight="700" fill="#5b21b6">
        KASSA
      </text>
      <circle cx={w / 2 - 2} cy={-h / 2 + 2} r="0.7" fill="#22c55e" />
    </>
  )
}

function ResizeHandles({ w, h, onResizePointerDown, elId }) {
  const corners = [
    ['nw', -w / 2, -h / 2],
    ['ne', w / 2, -h / 2],
    ['sw', -w / 2, h / 2],
    ['se', w / 2, h / 2],
  ]
  return corners.map(([corner, hx, hy]) => (
    <g key={corner}>
      <rect
        x={hx - HANDLE_HIT}
        y={hy - HANDLE_HIT}
        width={HANDLE_HIT * 2}
        height={HANDLE_HIT * 2}
        fill="transparent"
        style={{ cursor: `${corner}-resize` }}
        onPointerDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          e.currentTarget.setPointerCapture?.(e.pointerId)
          onResizePointerDown?.(elId, corner, e)
        }}
      />
      <rect
        x={hx - HANDLE_R}
        y={hy - HANDLE_R}
        width={HANDLE_R * 2}
        height={HANDLE_R * 2}
        rx="0.5"
        fill="#fff"
        stroke="#7c3aed"
        strokeWidth="0.5"
        pointerEvents="none"
      />
    </g>
  ))
}

function FloorplanElement({
  el,
  selected,
  editorMode,
  onSelect,
  onPointerDown,
  onDoubleClick,
  onResizePointerDown,
}) {
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
  const showHandles = editorMode && selected && isResizable(el.type)

  const inner = () => {
    if (el.type === 'muur') {
      return (
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={0.5}
          fill="#1e293b"
          stroke={selected ? '#a78bfa' : '#0f172a'}
          strokeWidth={selected ? 0.7 : 0}
        />
      )
    }
    if (el.type === 'vast-rek' || el.type === 'tijdelijk-rek') {
      return (
        <ShelfVisual
          w={w}
          h={h}
          variant={el.type}
          label={el.label}
          selected={selected}
          uid={el.id}
        />
      )
    }
    if (el.type === 'kassa') {
      return <KassaVisual w={w} h={h} selected={selected} uid={el.id} />
    }
    if (el.type === 'ingang') {
      return (
        <>
          <circle r="2.2" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.5" />
          <text y="0.6" textAnchor="middle" fontSize="3.6" fontWeight="700" fill="#16a34a">
            Ingang
          </text>
        </>
      )
    }
    if (el.type === 'uitgang') {
      return (
        <>
          <circle r="2.2" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.5" />
          <text y="0.6" textAnchor="middle" fontSize="3.6" fontWeight="700" fill="#dc2626">
            Uitgang
          </text>
        </>
      )
    }
    return null
  }

  if (el.type === 'ingang' || el.type === 'uitgang') {
    return (
      <g transform={`translate(${el.x} ${el.y})`} {...handlers}>
        {inner()}
        {selected && (
          <rect x={-9} y={-5} width="18" height="10" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="1" />
        )}
      </g>
    )
  }

  const rotTransform = rot ? `rotate(${rot})` : undefined

  return (
    <g transform={`translate(${el.x} ${el.y})`}>
      <g transform={rotTransform} {...handlers}>
        {inner()}
        {selected && !showHandles && (
          <rect
            x={-w / 2 - 0.5}
            y={-h / 2 - 0.5}
            width={w + 1}
            height={h + 1}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="0.5"
            rx="2.5"
            pointerEvents="none"
          />
        )}
      </g>
      {showHandles && (
        <g transform={rotTransform}>
          <ResizeHandles w={w} h={h} elId={el.id} onResizePointerDown={onResizePointerDown} />
        </g>
      )}
    </g>
  )
}

export default function FloorplanRenderer({
  elements = [],
  products = [],
  highlight,
  entrance,
  selectedId,
  editorMode = false,
  onSelectElement,
  onElementPointerDown,
  onElementDoubleClick,
  onResizePointerDown,
  className = 'w-full rounded-2xl bg-white shadow-sm',
  showShelves = true,
  svgRef,
  onSvgPointerDown,
  onDragOver,
  onDrop,
}) {
  const rekkenLocaties = []
  if (showShelves) {
    for (const p of products) {
      if (p.rekkenlocatie && !rekkenLocaties.some((s) => s.label === p.rekkenlocatie.label)) {
        rekkenLocaties.push(p.rekkenlocatie)
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
      <defs>
        <linearGradient id="vloerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>

      <rect
        x="2"
        y="2"
        width="96"
        height="100"
        rx="4"
        fill="url(#vloerGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
        onPointerDown={onSvgPointerDown}
      />

      {editorMode && <EditorGrid />}

      {elements.map((el) => (
        <FloorplanElement
          key={el.id}
          el={el}
          selected={selectedId === el.id}
          editorMode={editorMode}
          onSelect={onSelectElement}
          onPointerDown={onElementPointerDown}
          onDoubleClick={onElementDoubleClick}
          onResizePointerDown={onResizePointerDown}
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
        rekkenLocaties.map((s) => {
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
