import { Link, NavLink } from 'react-router-dom'

// Navigatie tussen de winkelbeheer-schermen (plattegrond ↔ catalogus),
// met een terug-link naar de beheer-startpagina.
const LINKS = [
  { to: '/beheer/plattegrond', label: 'Plattegrond' },
  { to: '/beheer/catalogus', label: 'Catalogus' },
]

export default function BeheerNav() {
  return (
    <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      <Link
        to="/beheer"
        className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        title="Terug naar beheer"
      >
        ←
      </Link>
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `rounded-md px-3 py-1.5 text-sm font-medium transition ${
              isActive ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
