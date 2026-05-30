// Herbruikbare zoekbalk (Home en StorePage).
export default function SearchBar({ value, onChange, placeholder = 'Zoeken', autoFocus = false }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  )
}
