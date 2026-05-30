import { useState } from 'react'

// Toont het echte winkellogo. Probeert bronnen in volgorde:
//   1. Clearbit (volledig logo)  2. Google favicon (merkicoon)  3. emoji (fallback)
// Zo blijft er altijd iets herkenbaars staan, ook als een logo niet laadt.
function logoBronnen(domain) {
  if (!domain) return []
  return [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
  ]
}

export default function StoreLogo({ store, sizeClass = 'h-12 w-12', emojiClass = 'text-2xl' }) {
  const bronnen = logoBronnen(store.logoDomain)
  const [i, setI] = useState(0)
  const bron = bronnen[i]

  // Alle logobronnen mislukt (of geen domein) -> gekleurde cirkel met emoji.
  if (!bron) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full text-white shadow-sm ${sizeClass} ${emojiClass}`}
        style={{ backgroundColor: store.kleur }}
      >
        {store.emoji}
      </span>
    )
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-200 ${sizeClass}`}
    >
      <img
        src={bron}
        alt={`${store.naam} logo`}
        onError={() => setI((n) => n + 1)}
        className="h-full w-full object-contain p-1.5"
      />
    </span>
  )
}
