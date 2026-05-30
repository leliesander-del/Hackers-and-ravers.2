import { useState } from 'react'

// Shows the real store logo. Tries sources in order:
//   1. Clearbit (full logo)  2. Google favicon (brand icon)  3. emoji (fallback)
// That way something recognizable always stays, even if a logo fails to load.
function logoSources(domain) {
  if (!domain) return []
  return [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
  ]
}

export default function StoreLogo({ store, sizeClass = 'h-12 w-12', emojiClass = 'text-2xl' }) {
  const sources = logoSources(store.logoDomain)
  const [i, setI] = useState(0)
  const source = sources[i]

  // All logo sources failed (or no domain) -> colored circle with emoji.
  if (!source) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full text-white shadow-sm ${sizeClass} ${emojiClass}`}
        style={{ backgroundColor: store.color }}
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
        src={source}
        alt={`${store.name} logo`}
        onError={() => setI((n) => n + 1)}
        className="h-full w-full object-contain p-1.5"
      />
    </span>
  )
}
