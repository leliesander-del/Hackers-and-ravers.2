import { elementSize, isResizable, rotationDegrees } from '../../lib/floorplanGeometry.js'
import { getElementStyle, resolveElementLabel } from '../../lib/floorplanElementStyle.js'

// Zichtbare hoekgreep vs. grotere onzichtbare klikzone (viewBox 100×104)
const HANDLE_R = 0.55
const HANDLE_HIT = 1.25

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

function truncateLabel(label, max = 18) {
  if (!label) return ''
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

function ShelfVisual({ el, w, h, selected }) {
  const isTemp = el.type === 'tijdelijk-rek'
  const style = getElementStyle(el)
  const rows = Math.max(2, Math.floor(h / 2.6))
  const capH = Math.min(h * 0.22, 2.4)
  const label = el.label?.trim()
  const fontSize = Math.min(style.textSize, w / 5, h / 2.5)

  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={style.fillColor}
        stroke={selected ? '#f8fafc' : style.strokeColor}
        strokeWidth={selected ? 0.75 : 0.55}
        strokeDasharray={isTemp ? '1.2 0.7' : undefined}
      />
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={capH}
        fill={style.accentColor}
        stroke="none"
      />
      <line
        x1={-w / 2}
        y1={-h / 2 + capH}
        x2={w / 2}
        y2={-h / 2 + capH}
        stroke={style.strokeColor}
        strokeWidth="0.35"
        opacity="0.85"
      />
      {Array.from({ length: rows }).map((_, i) => {
        const y = -h / 2 + capH + ((h - capH) / (rows + 1)) * (i + 1)
        return (
          <line
            key={i}
            x1={-w / 2 + 0.6}
            y1={y}
            x2={w / 2 - 0.6}
            y2={y}
            stroke={style.shelfLineColor}
            strokeWidth="0.3"
            opacity="0.9"
          />
        )
      })}
      <line
        x1={-w / 2}
        y1={-h / 2}
        x2={-w / 2}
        y2={h / 2}
        stroke={style.strokeColor}
        strokeWidth="0.25"
        opacity="0.5"
      />
      <line
        x1={w / 2}
        y1={-h / 2}
        x2={w / 2}
        y2={h / 2}
        stroke={style.strokeColor}
        strokeWidth="0.25"
        opacity="0.5"
      />
      {label && (
        <text
          y={capH > 1.8 ? -h / 2 + capH / 2 + 0.15 : 0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={style.textColor}
          pointerEvents="none"
        >
          {truncateLabel(label)}
        </text>
      )}
    </>
  )
}

function KassaVisual({ el, w, h, selected }) {
  const style = getElementStyle(el)
  const label = resolveElementLabel(el)
  const screenH = h * 0.42
  const baseH = h * 0.18
  const labelBandH = Math.max(1.2, h - screenH - baseH - 1.6)
  const labelY = -h / 2 + screenH + 0.8 + labelBandH / 2
  const fontSize = Math.min(style.textSize, w / 5, labelBandH * 0.85)

  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={style.fillColor}
        stroke={selected ? '#f8fafc' : style.strokeColor}
        strokeWidth={selected ? 0.75 : 0.55}
      />
      <rect
        x={-w / 2 + 0.8}
        y={-h / 2 + 0.8}
        width={w - 1.6}
        height={screenH}
        fill={style.screenColor}
        stroke={style.strokeColor}
        strokeWidth="0.3"
      />
      <rect
        x={-w / 2 + 0.8}
        y={h / 2 - baseH - 0.8}
        width={w - 1.6}
        height={baseH}
        fill={style.accentColor}
        stroke="none"
      />
      <rect x={w / 2 - 2.4} y={-h / 2 + 0.8} width="1.2" height="1.2" fill="#22c55e" />
      <text
        y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="800"
        letterSpacing="0.08"
        fill={style.textColor}
        pointerEvents="none"
      >
        {truncateLabel(label, 14)}
      </text>
    </>
  )
}

function DoorVisual({ el, w, h, selected }) {
  const style = getElementStyle(el)
  const label = resolveElementLabel(el)
  const fontSize = Math.min(style.textSize, w / 4.5, h / 2.2)

  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={style.fillColor}
        stroke={selected ? '#f8fafc' : style.strokeColor}
        strokeWidth={selected ? 0.75 : 0.55}
      />
      <text
        y={0.1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill={style.textColor}
        pointerEvents="none"
      >
        {truncateLabel(label, 20)}
      </text>
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
        fill="#fff"
        stroke="#7c3aed"
        strokeWidth="0.35"
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
          fill="#1e293b"
          stroke={selected ? '#a78bfa' : '#0f172a'}
          strokeWidth={selected ? 0.7 : 0}
        />
      )
    }
    if (el.type === 'vast-rek' || el.type === 'tijdelijk-rek') {
      return <ShelfVisual el={el} w={w} h={h} selected={selected} />
    }
    if (el.type === 'kassa') {
      return <KassaVisual el={el} w={w} h={h} selected={selected} />
    }
    if (el.type === 'ingang' || el.type === 'uitgang') {
      return <DoorVisual el={el} w={w} h={h} selected={selected} />
    }
    return null
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
  className = 'w-full bg-white shadow-sm',
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
        schappen.map((s) => {
          const actief = highlight && highlight.label === s.label
          return (
            <g key={s.label}>
              <rect
                x={s.x - 5}
                y={s.y - 3}
                width="10"
                height="6"
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
