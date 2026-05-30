import { useNavigate } from 'react-router-dom'

// Simple page header with an optional back button and a slot on the right.
// Purple brand bar with a centered, easy-to-read title (white on brand-600).
// The back button and the right slot get a fixed width so the title always
// stays exactly in the middle.
export default function PageHeader({ title, subtitle, back = false, right = null }) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-[900] flex items-center gap-3 border-b border-brand-700/40 bg-brand-600 px-4 py-3.5 text-white shadow-sm">
      <div className="flex w-11 shrink-0 justify-start">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Back"
          >
            ←
          </button>
        )}
      </div>

      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 truncate text-xs text-white/75">{subtitle}</p>}
      </div>

      <div className="flex w-11 shrink-0 justify-end">{right}</div>
    </div>
  )
}
