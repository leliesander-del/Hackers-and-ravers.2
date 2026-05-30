import { getElementStyle } from '../../lib/floorplanElementStyle.js'

function truncateLabel(label, max = 18) {
  if (!label) return ''
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

/** Route-markering: zelfde rek-stijl, andere rand/kleur. */
export function rackStateColors(rackState, baseStyle) {
  if (rackState === 'visited') {
    return { fill: '#d1fae5', stroke: '#10b981', strokeWidth: 0.75, ring: '#10b981' }
  }
  if (rackState === 'current') {
    return { fill: '#c4b5fd', stroke: '#6d28d9', strokeWidth: 0.85, ring: '#6d28d9' }
  }
  if (rackState === 'route') {
    return { fill: '#ddd6fe', stroke: '#7c3aed', strokeWidth: 0.65, ring: '#a78bfa' }
  }
  return {
    fill: baseStyle.fillColor,
    stroke: baseStyle.strokeColor,
    strokeWidth: 0.55,
    ring: null,
  }
}

/**
 * Rek-weergave: labelbalk bovenaan (lokaal y = -h/2) = achterkant.
 * Voorkant = tegenover de balk (lokaal y = +h/2) — zie shelfFront.js voor routes.
 */
export default function ShelfVisual({ el, w, h, selected, rackState, label: labelOverride }) {
  const isTemp = el?.type === 'tijdelijk-rek'
  const style = getElementStyle(el)
  const colors = rackStateColors(rackState, style)
  const rows = Math.max(2, Math.floor(h / 2.6))
  const capH = Math.min(h * 0.22, 2.4)
  const label = (labelOverride ?? el?.label ?? '').trim()
  const fontSize = Math.min(style.textSize ?? 2.2, w / 5, h / 2.5)

  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={colors.fill}
        stroke={selected ? '#f8fafc' : colors.stroke}
        strokeWidth={selected ? 0.75 : colors.strokeWidth}
        strokeDasharray={isTemp ? '1.2 0.7' : undefined}
      />
      <rect x={-w / 2} y={-h / 2} width={w} height={capH} fill={style.accentColor} stroke="none" opacity={rackState ? 0.85 : 1} />
      <line
        x1={-w / 2}
        y1={-h / 2 + capH}
        x2={w / 2}
        y2={-h / 2 + capH}
        stroke={colors.stroke}
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
            stroke={style.shelfLineColor ?? '#ddd6fe'}
            strokeWidth="0.3"
            opacity="0.9"
          />
        )
      })}
      <line x1={-w / 2} y1={-h / 2} x2={-w / 2} y2={h / 2} stroke={colors.stroke} strokeWidth="0.25" opacity="0.5" />
      <line x1={w / 2} y1={-h / 2} x2={w / 2} y2={h / 2} stroke={colors.stroke} strokeWidth="0.25" opacity="0.5" />
      {label && (
        <text
          y={capH > 1.8 ? -h / 2 + capH / 2 + 0.15 : 0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={style.textColor ?? '#fff'}
          pointerEvents="none"
        >
          {truncateLabel(label, h < 6 ? 10 : 18)}
        </text>
      )}
      {colors.ring && (
        <rect
          x={-w / 2 - 0.45}
          y={-h / 2 - 0.45}
          width={w + 0.9}
          height={h + 0.9}
          fill="none"
          stroke={colors.ring}
          strokeWidth={rackState === 'current' ? 0.9 : 0.6}
          pointerEvents="none"
        />
      )}
    </>
  )
}
