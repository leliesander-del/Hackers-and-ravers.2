import { useNavigate } from 'react-router-dom'

// Eenvoudige paginakop met optionele terug-knop en een slot rechts.
export default function PageHeader({ title, subtitle, back = false, right = null }) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-[900] flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          aria-label="Terug"
        >
          ←
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-bold leading-tight text-slate-800">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
