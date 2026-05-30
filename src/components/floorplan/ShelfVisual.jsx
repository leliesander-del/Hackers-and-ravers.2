import { getElementStyle } from '../../lib/floorplanElementStyle.js'
import { formatCategoryLabel } from '../../lib/productCategories.js'

function truncateLabel(label, max = 18) {
  if (!label) return ''
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

/** Route-markering: zelfde rek-stijl, andere rand/kleur. */
export function rackStateColors(rackState, baseStyle) {
  if (rackState === 'visited') {
    return { fill: '#86efac', stroke: '#16a34a', strokeWidth: 0.6, ring: '#16a34a' }
  }
  if (rackState === 'current') {
    return { fill: '#a78bfa', stroke: '#6d28d9', strokeWidth: 0.65, ring: '#6d28d9' }
  }
  if (rackState === 'route') {
    return { fill: '#c4b5fd', stroke: '#7c3aed', strokeWidth: 0.55, ring: '#a78bfa' }
  }
  return {
    fill: baseStyle.fillColor,
    stroke: baseStyle.strokeColor,
    strokeWidth: 0.5,
    ring: null,
  }
}

/**
 * Egaal vierkant rek — één vlakke kleur, label in het midden.
 * Voorkant voor routes = lokaal y = +h/2 (zie shelfFront.js).
 */
export default function ShelfVisual({ el, w, h, selected, rackState, label: labelOverride }) {
  const isTemp = el?.type === 'tijdelijk-rek'
  const style = getElementStyle(el)
  const colors = rackStateColors(rackState, style)
  const borderWidth = selected ? 0.7 : rackState ? colors.strokeWidth : isTemp ? 0.35 : 0.5
  const label = (labelOverride ?? el?.label ?? '').trim()
  const displayLabel = label ? formatCategoryLabel(label) : ''
  const fontSize = Math.min(style.textSize ?? 2.4, w / 4.5, h / 3.5)

  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={colors.fill}
        stroke={selected ? '#f8fafc' : colors.stroke}
        strokeWidth={borderWidth}
      />
      {displayLabel && (
        <text
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={style.textColor ?? '#fff'}
          pointerEvents="none"
        >
          {truncateLabel(displayLabel, w < 8 ? 8 : 14)}
        </text>
      )}
      {colors.ring && (
        <rect
          x={-w / 2 - 0.4}
          y={-h / 2 - 0.4}
          width={w + 0.8}
          height={h + 0.8}
          fill="none"
          stroke={colors.ring}
          strokeWidth={rackState === 'current' ? 0.85 : 0.55}
          pointerEvents="none"
        />
      )}
    </>
  )
}
