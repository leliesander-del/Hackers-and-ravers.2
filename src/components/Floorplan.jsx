// 2D SVG-plattegrond (placeholder). Tekent de schappen op basis van de
// schaplocaties van de producten, met een ingang en — optioneel — een
// gestippelde route naar één gemarkeerd schap.
export default function Floorplan({ products, highlight }) {
  // Unieke schappen op basis van label + positie.
  const schappen = []
  for (const p of products) {
    if (p.schaplocatie && !schappen.some((s) => s.label === p.schaplocatie.label)) {
      schappen.push(p.schaplocatie)
    }
  }

  const ingang = { x: 50, y: 96 }

  return (
    <svg viewBox="0 0 100 104" className="w-full rounded-2xl bg-white shadow-sm" role="img" aria-label="Plattegrond">
      <rect x="2" y="2" width="96" height="100" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.6" />

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

      {schappen.map((s) => {
        const actief = highlight && highlight.label === s.label
        return (
          <g key={s.label}>
            <rect
              x={s.x - 11}
              y={s.y - 6}
              width="22"
              height="12"
              rx="2"
              fill={actief ? '#ede9fe' : '#e2e8f0'}
              stroke={actief ? '#7c3aed' : '#cbd5e1'}
              strokeWidth="0.5"
            />
            <text x={s.x} y={s.y + 1} textAnchor="middle" fontSize="3.4" fill="#475569">
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

      {/* Ingang */}
      <circle cx={ingang.x} cy={ingang.y} r="2.2" fill="#16a34a" />
      <text x={ingang.x} y={ingang.y - 3.5} textAnchor="middle" fontSize="3.2" fill="#16a34a">
        Ingang
      </text>
    </svg>
  )
}
