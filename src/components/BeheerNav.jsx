import { NavLink } from 'react-router-dom'

// Navigatie tussen de winkelbeheer-schermen (plattegrond ↔ catalogus).
const LINKS = [
  { to: '/beheer/plattegrond', label: 'Plattegrond' },
  { to: '/beheer/catalogus', label: 'Catalogus' },
]

export default function BeheerNav() {
  return (
    <nav className="flex gap-1 rounded-lg bg-slate-100 p-1">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `rounded-md px-3 py-1.5 text-sm font-medium transition ${
              isActive ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
