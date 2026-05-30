import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function WerknemerPage() {
  const { logout } = useStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#111] text-white">
      <div className="flex items-center justify-between px-6 pt-14 pb-6 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">Never Lost</span>
        <button
          onClick={handleLogout}
          className="text-sm text-white/50 hover:text-white transition"
        >
          Uitloggen
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl mb-6">
          🏪
        </div>
        <h2 className="text-2xl font-bold mb-2">Werknemer Dashboard</h2>
        <p className="text-white/40 text-sm">Dit onderdeel is nog in ontwikkeling.</p>
      </div>
    </div>
  )
}
