import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useStore } from './context/StoreContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MapPage from './pages/MapPage.jsx'
import WalletPage from './pages/WalletPage.jsx'
import MorePage from './pages/MorePage.jsx'
import StorePage from './pages/StorePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import StaffRoute from './components/StaffRoute.jsx'
import StaffPage from './pages/StaffPage.jsx'

// Het "telefoon"-frame met onderbalk. Wie nog geen profiel koos, gaat naar /login.
function AppShell() {
  const { isIngelogd } = useStore()
  if (!isIngelogd) return <Navigate to="/login" replace />

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-[#f7f5fd] pb-24 shadow-[0_0_60px_rgba(76,29,149,0.08)] ring-1 ring-black/5">
      <Outlet />
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="kaart" element={<MapPage />} />
        <Route path="lijst" element={<CartPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="meer" element={<MorePage />} />
        <Route path="store/:id" element={<StorePage />} />
        <Route path="store/:id/product/:pid" element={<ProductPage />} />
        <Route path="mandje" element={<CartPage />} />
        <Route
          path="personeel"
          element={
            <StaffRoute>
              <StaffPage />
            </StaffRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
