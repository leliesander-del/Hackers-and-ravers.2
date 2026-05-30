import { useNavigate } from 'react-router-dom'

// Eenvoudige paginakop met optionele terug-knop en een slot rechts.
export default function PageHeader({ title, subtitle, back = false, right = null }) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-[900] flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3.5 backdrop-blur-md">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95"
          aria-label="Terug"
        >
          ←
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
