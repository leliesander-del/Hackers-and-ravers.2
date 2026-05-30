import { Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function StaffRoute({ children }) {
  const { isGekwalificeerdeBediende } = useStore()
  if (!isGekwalificeerdeBediende) return <Navigate to="/" replace />
  return children
}
