import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile } from '../data/profiles.js'
import { getProduct } from '../data/products.js'
import { getManager } from '../data/managers.js'

const StoreContext = createContext(null)

const PROFIEL_KEY = 'storenav.profielId'
const CART_KEY = 'storenav.cart'
const MANAGER_KEY = 'storenav.managerId'

export function StoreProvider({ children }) {
  // Actief profiel + winkelmandje, beide bewaard in localStorage zodat een refresh niets verliest.
  const [profielId, setProfielId] = useState(() => localStorage.getItem(PROFIEL_KEY) || null)
  const [cartIds, setCartIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })
  const [managerId, setManagerId] = useState(() => localStorage.getItem(MANAGER_KEY) || null)

  useEffect(() => {
    if (profielId) localStorage.setItem(PROFIEL_KEY, profielId)
    else localStorage.removeItem(PROFIEL_KEY)
  }, [profielId])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartIds))
  }, [cartIds])

  useEffect(() => {
    if (managerId) localStorage.setItem(MANAGER_KEY, managerId)
    else localStorage.removeItem(MANAGER_KEY)
  }, [managerId])

  const activeProfile = useMemo(() => getProfile(profielId), [profielId])
  const activeManager = useMemo(() => getManager(managerId), [managerId])
  const cart = useMemo(() => cartIds.map(getProduct).filter(Boolean), [cartIds])

  const value = useMemo(
    () => ({
      activeProfile,
      isIngelogd: !!activeProfile,
      login: (id) => setProfielId(id),
      logout: () => setProfielId('gast'),
      cart,
      cartCount: cartIds.length,
      cartTotaal: cart.reduce((som, p) => som + p.prijs, 0),
      inCart: (id) => cartIds.includes(id),
      addToCart: (id) => setCartIds((ids) => (ids.includes(id) ? ids : [...ids, id])),
      removeFromCart: (id) => setCartIds((ids) => ids.filter((x) => x !== id)),
      clearCart: () => setCartIds([]),
      activeManager,
      isManagerIngelogd: !!activeManager,
      managerLogin: (id) => setManagerId(id),
      managerLogout: () => setManagerId(null),
    }),
    [activeProfile, activeManager, cart, cartIds],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore moet binnen <StoreProvider> gebruikt worden')
  return ctx
}
