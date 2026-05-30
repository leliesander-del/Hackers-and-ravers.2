import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useStore } from './context/StoreContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import StaffShell from './components/StaffShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import StaffLoginPage from './pages/StaffLoginPage.jsx'
import ListPage from './pages/ListPage.jsx'
import CartPage from './pages/CartPage.jsx'
import MorePage from './pages/MorePage.jsx'
import ProfilePhotoPage from './pages/ProfilePhotoPage.jsx'
import StorePage from './pages/StorePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ManagerLoginPage from './pages/ManagerLoginPage.jsx'
import ManagerHomePage from './pages/ManagerHomePage.jsx'
import ConnectionsPage from './pages/ConnectionsPage.jsx'
import FloorplanEditorPage from './pages/FloorplanEditorPage.jsx'
import StaffCheckoutPage from './pages/StaffCheckoutPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import { isCustomerSession } from './lib/security.js'

// The customer shell with bottom bar. Anyone not logged in goes to /login;
// staff don't belong here and are sent to the staff area.
function AppShell() {
  const { isLoggedIn, isQualifiedStaff } = useStore()
  if (!isLoggedIn || !isCustomerSession()) return <Navigate to="/login" replace />
  if (isQualifiedStaff) return <Navigate to="/staff" replace />

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-surface pb-24 shadow-[0_0_60px_rgba(76,29,149,0.08)] ring-1 ring-black/5">
      <Outlet />
      <BottomNav />
    </div>
  )
}

// Protects all /manage/* routes behind a valid manager session.
function ManagerShell() {
  const { isManagerLoggedIn } = useStore()
  if (!isManagerLoggedIn) return <Navigate to="/manage/login" replace />
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      {/* Customer login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Staff — fully separate login and shell, isolated from customers */}
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route element={<StaffShell />}>
        <Route path="/staff" element={<DashboardPage />} />
        <Route path="/staff/checkout" element={<StaffCheckoutPage />} />
        <Route path="/staff/sales" element={<Navigate to="/staff/checkout" replace />} />
        <Route path="/staff/dashboard" element={<Navigate to="/staff" replace />} />
      </Route>

      {/* Store management (floor plan + catalog) */}
      <Route path="/manage/login" element={<ManagerLoginPage />} />
      <Route element={<ManagerShell />}>
        <Route path="/manage" element={<ManagerHomePage />} />
        <Route path="/manage/connections" element={<ConnectionsPage />} />
        <Route path="/manage/floorplan" element={<FloorplanEditorPage />} />
        <Route path="/manage/catalog" element={<CatalogPage />} />
      </Route>

      {/* Customer app: the shopping list is the start page */}
      <Route element={<AppShell />}>
        <Route index element={<ListPage />} />
        <Route path="list" element={<ListPage />} />
        <Route path="lijst" element={<Navigate to="/" replace />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="mandje" element={<Navigate to="/cart" replace />} />
        <Route path="more" element={<MorePage />} />
        <Route path="profiel" element={<Navigate to="/more" replace />} />
        <Route path="profile-photo" element={<ProfilePhotoPage />} />
        <Route path="profiel-foto" element={<Navigate to="/profile-photo" replace />} />
        <Route path="store/:id" element={<StorePage />} />
        <Route path="store/:id/product/:pid" element={<ProductPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
