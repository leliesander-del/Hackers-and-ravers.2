import { elementSize, isResizable, isShelf, rotationDegrees } from '../../lib/floorplanGeometry.js'
import { getElementStyle, resolveElementLabel } from '../../lib/floorplanElementStyle.js'
import { shelfFrontApproachWorld } from '../../lib/shelfFront.js'
import ShelfVisual from './ShelfVisual.jsx'

// Visible corner handle vs. larger invisible hit zone (viewBox 100×104)
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

function CheckoutVisual({ el, w, h, selected }) {
  const style = getElementStyle(el)
  const label = resolveElementLabel(el)
  const fontSize = Math.min(style.textSize ?? 2.4, w / 4.5, h / 3.5)

  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={style.fillColor}
        stroke={selected ? '#f8fafc' : style.strokeColor}
        strokeWidth={selected ? 0.7 : 0.5}
      />
      <text
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="700"
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
  rackState,
  onSelect,
  onPointerDown,
  onDoubleClick,
  onResizePointerDown,
}) {
  const { w, h } = elementSize(el)
  const rot = rotationDegrees(el)

  const isRack = isShelf(el.type)
  const customerMode = !editorMode

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
      : customerMode
        ? { style: { pointerEvents: isRack ? 'all' : 'none' } }
        : {}

  const rotTransform = rot ? `rotate(${rot})` : undefined
  const showHandles = editorMode && selected && isResizable(el.type)

  const inner = () => {
    if (el.type === 'wall') {
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
    if (isRack) {
      return <ShelfVisual el={el} w={w} h={h} selected={selected} rackState={rackState} />
    }
    if (el.type === 'checkout') {
      return <CheckoutVisual el={el} w={w} h={h} selected={selected} />
    }
    if (el.type === 'entrance' || el.type === 'exit') {
      return <DoorVisual el={el} w={w} h={h} selected={selected} />
    }
    return null
  }

  return (
    <g transform={`translate(${el.x} ${el.y})`} data-rack={isRack && customerMode ? 'true' : undefined}>
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
  showShelves = false,
  rackStates,
  viewBox,
  svgRef,
  onSvgPointerDown,
  onSvgPointerMove,
  onSvgPointerUp,
  onDragOver,
  onDrop,
  routePath,
  startPos,
  orderedStops = [],
  currentIndex = 0,
  visitedIds,
}) {
  const shelfLocations = []
  if (showShelves) {
    for (const p of products) {
      if (p.shelfLocation && !shelfLocations.some((s) => s.label === p.shelfLocation.label)) {
        shelfLocations.push(p.shelfLocation)
      }
    }
  }

  const entranceEl = elements.find((el) => el.type === 'entrance')
  const entrancePos = entrance || (entranceEl ? { x: entranceEl.x, y: entranceEl.y } : { x: 50, y: 96 })
  const vb = viewBox ? `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}` : '0 0 100 104'

  return (
    <svg
      ref={svgRef}
      viewBox={vb}
      className={className}
      role="img"
      aria-label="Floor plan"
      onPointerDown={onSvgPointerDown}
      onPointerMove={onSvgPointerMove}
      onPointerUp={onSvgPointerUp}
      onPointerLeave={onSvgPointerUp}
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
        data-floor="true"
        x="2"
        y="2"
        width="96"
        height="100"
        fill="url(#vloerGrad)"
        stroke="#0f172a"
        strokeWidth="1.2"
        pointerEvents={editorMode ? undefined : 'all'}
      />

      {editorMode && <EditorGrid />}

      {elements.map((el) => (
        <FloorplanElement
          key={el.id}
          el={el}
          selected={selectedId === el.id}
          editorMode={editorMode}
          rackState={rackStates?.get(el.id)}
          onSelect={onSelectElement}
          onPointerDown={onElementPointerDown}
          onDoubleClick={onElementDoubleClick}
          onResizePointerDown={onResizePointerDown}
        />
      ))}

      {routePath && (
        <>
          <path
            d={routePath}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
            pointerEvents="none"
          />
          <circle r="1.4" fill="#7c3aed" pointerEvents="none">
            <animateMotion path={routePath} dur={`${Math.max(5, orderedStops.length * 2.5)}s`} repeatCount="indefinite" />
          </circle>
        </>
      )}

      {orderedStops.map((stop, k) => {
        const done = visitedIds?.has(stop.rackId)
        const current = k === currentIndex && !done
        if (done) return null
        const front = shelfFrontApproachWorld(stop.element)
        return (
          <g key={`stop-${stop.rackId}`} pointerEvents="none">
            <circle cx={front.x} cy={front.y} r={current ? 2.8 : 2.2} fill={current ? '#7c3aed' : '#a78bfa'} stroke="#fff" strokeWidth="0.4" />
            <text x={front.x} y={front.y + 0.85} textAnchor="middle" fontSize="2.6" fontWeight="700" fill="#fff">
              {k + 1}
            </text>
          </g>
        )
      })}

      {startPos && (
        <g pointerEvents="none">
          <circle cx={startPos.x} cy={startPos.y} r="2.8" fill="#2563eb" stroke="#fff" strokeWidth="0.8" />
          <circle cx={startPos.x} cy={startPos.y} r="4.2" fill="none" stroke="#2563eb" strokeWidth="0.35" opacity="0.5">
            <animate attributeName="r" values="4.2;5.5;4.2" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {highlight && !routePath && (
        <line
          x1={entrancePos.x}
          y1={entrancePos.y}
          x2={highlight.x}
          y2={highlight.y}
          stroke="#7c3aed"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}

      {showShelves &&
        shelfLocations.map((s) => {
          const active = highlight && highlight.label === s.label
          return (
            <g key={s.label}>
              <rect
                x={s.x - 5}
                y={s.y - 3}
                width="10"
                height="6"
                fill={active ? '#ede9fe' : '#fef3c7'}
                stroke={active ? '#7c3aed' : '#f59e0b'}
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
