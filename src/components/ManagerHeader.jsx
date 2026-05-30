import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import StoreLogo from './StoreLogo.jsx'

// Shared header for all store-management screens, so they look the same
// everywhere: store logo + title/subtitle on the left, navigation + page buttons
// (children) + log out on the right.
export default function ManagerHeader({ store, title, subtitle, onLogout, children }) {
  const { managerLogout } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // The back arrow only on subpages (/manage/...), not on the management home.
  const isSubpage = pathname !== '/manage'

  function handleLogout() {
    if (onLogout) onLogout()
    else managerLogout()
    navigate('/manage/login')
  }

  return (
    <header className="relative z-20 shrink-0 border-b border-brand-700/40 bg-brand-600 text-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isSubpage && (
            <Link
              to="/manage"
              title="Back to management"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-base font-bold text-white transition hover:bg-white/25"
            >
              ←
            </Link>
          )}
          <StoreLogo store={store} sizeClass="h-10 w-10" emojiClass="text-lg" />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-lg font-bold text-white">{title}</h1>
          {subtitle != null && <p className="truncate text-sm text-white/75">{subtitle}</p>}
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          {children}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
