import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useStore } from './context/StoreContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import StaffShell from './components/StaffShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import StaffLoginPage from './pages/StaffLoginPage.jsx'
import ListPage from './pages/ListPage.jsx'
import MorePage from './pages/MorePage.jsx'
import StorePage from './pages/StorePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ManagerLoginPage from './pages/ManagerLoginPage.jsx'
import FloorplanEditorPage from './pages/FloorplanEditorPage.jsx'
import StaffPage from './pages/StaffPage.jsx'

// De klant-shell met onderbalk. Wie niet ingelogd is gaat naar /login;
// personeel hoort hier niet thuis en wordt naar het personeelsgedeelte gestuurd.
function AppShell() {
  const { isIngelogd, isGekwalificeerdeBediende } = useStore()
  if (!isIngelogd) return <Navigate to="/login" replace />
  if (isGekwalificeerdeBediende) return <Navigate to="/personeel" replace />

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
      {/* Klantenlogin */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Personeel — volledig eigen login en shell, gescheiden van klanten */}
      <Route path="/personeel/login" element={<StaffLoginPage />} />
      <Route element={<StaffShell />}>
        <Route path="/personeel" element={<StaffPage />} />
      </Route>

      {/* Winkelbeheer (plattegrond) */}
      <Route path="/beheer/login" element={<ManagerLoginPage />} />
      <Route path="/beheer/plattegrond" element={<FloorplanEditorPage />} />

      {/* Klant-app: de boodschappenlijst is de startpagina */}
      <Route element={<AppShell />}>
        <Route index element={<ListPage />} />
        <Route path="lijst" element={<ListPage />} />
        <Route path="mandje" element={<ListPage />} />
        <Route path="meer" element={<MorePage />} />
        <Route path="store/:id" element={<StorePage />} />
        <Route path="store/:id/product/:pid" element={<ProductPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
