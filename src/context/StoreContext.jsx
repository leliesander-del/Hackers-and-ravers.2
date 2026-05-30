import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile } from '../data/profiles.js'
import { getProduct, products } from '../data/products.js'
import { buildInitialInventory, enrichProduct } from '../lib/inventory.js'

const StoreContext = createContext(null)

const PROFIEL_KEY = 'storenav.profielId'
const CART_KEY = 'storenav.cart'
const INVENTORY_KEY = 'storenav.inventory'
const STAFF_LOG_KEY = 'storenav.staffLog'

function loadInventory() {
  try {
    const saved = JSON.parse(localStorage.getItem(INVENTORY_KEY))
    if (saved && typeof saved === 'object') return saved
  } catch {
    /* negeer corrupte data */
  }
  return buildInitialInventory(products)
}

function loadStaffLog() {
  try {
    return JSON.parse(localStorage.getItem(STAFF_LOG_KEY)) || []
  } catch {
    return []
  }
}

export function StoreProvider({ children }) {
  const [profielId, setProfielId] = useState(() => localStorage.getItem(PROFIEL_KEY) || null)
  const [cartIds, setCartIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })
  const [inventory, setInventory] = useState(loadInventory)
  const [staffLog, setStaffLog] = useState(loadStaffLog)

  useEffect(() => {
    if (profielId) localStorage.setItem(PROFIEL_KEY, profielId)
    else localStorage.removeItem(PROFIEL_KEY)
  }, [profielId])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartIds))
  }, [cartIds])

  useEffect(() => {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory))
  }, [inventory])

  useEffect(() => {
    localStorage.setItem(STAFF_LOG_KEY, JSON.stringify(staffLog.slice(0, 50)))
  }, [staffLog])

  const activeProfile = useMemo(() => getProfile(profielId), [profielId])

  const getStock = useCallback((productId) => inventory[productId] ?? { magazijn: 0, schap: 0 }, [inventory])

  const getProductLive = useCallback(
    (id) => enrichProduct(getProduct(id), getStock(id)),
    [getStock],
  )

  const productsByStoreLive = useCallback(
    (storeId) => products.filter((p) => p.storeId === storeId).map((p) => enrichProduct(p, getStock(p.id))),
    [getStock],
  )

  const allProductsLive = useMemo(
    () => products.map((p) => enrichProduct(p, getStock(p.id))),
    [getStock],
  )

  const cart = useMemo(() => cartIds.map(getProductLive).filter(Boolean), [cartIds, getProductLive])

  const logStaffActie = useCallback((tekst) => {
    setStaffLog((log) => [{ id: Date.now(), tekst, tijd: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) }, ...log].slice(0, 50))
  }, [])

  const verplaatsNaarSchap = useCallback(
    (productId, aantal = 1) => {
      const stock = getStock(productId)
      const product = getProduct(productId)
      if (!product || aantal < 1) return { ok: false, fout: 'Ongeldig product of aantal.' }
      if (stock.magazijn < aantal) {
        return { ok: false, fout: `Niet genoeg in magazijn (nog ${stock.magazijn}).` }
      }

      setInventory((inv) => ({
        ...inv,
        [productId]: {
          magazijn: stock.magazijn - aantal,
          schap: stock.schap + aantal,
        },
      }))
      logStaffActie(`${aantal}× ${product.naam} → schap (magazijn −${aantal})`)
      return { ok: true }
    },
    [getStock, logStaffActie],
  )

  const verkoopVanSchap = useCallback(
    (productId, aantal = 1) => {
      const stock = getStock(productId)
      const product = getProduct(productId)
      if (!product || aantal < 1) return { ok: false, fout: 'Ongeldig product of aantal.' }
      if (stock.schap < aantal) {
        return { ok: false, fout: `Niet genoeg op schap (nog ${stock.schap}).` }
      }

      setInventory((inv) => ({
        ...inv,
        [productId]: {
          magazijn: stock.magazijn,
          schap: stock.schap - aantal,
        },
      }))
      logStaffActie(`${aantal}× ${product.naam} verkocht (schap −${aantal})`)
      return { ok: true }
    },
    [getStock, logStaffActie],
  )

  const betaalMandje = useCallback(() => {
    const fouten = []
    for (const id of cartIds) {
      const result = verkoopVanSchap(id, 1)
      if (!result.ok) {
        const p = getProduct(id)
        fouten.push(p ? `${p.naam}: ${result.fout}` : result.fout)
      }
    }
    if (fouten.length === 0) {
      setCartIds([])
      return { ok: true }
    }
    return { ok: false, fout: fouten.join(' · ') }
  }, [cartIds, verkoopVanSchap])

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
      betaalMandje,
      inventory,
      getStock,
      getProductLive,
      productsByStoreLive,
      allProductsLive,
      verplaatsNaarSchap,
      verkoopVanSchap,
      staffLog,
    }),
    [
      activeProfile,
      cart,
      cartIds,
      inventory,
      getStock,
      getProductLive,
      productsByStoreLive,
      allProductsLive,
      verplaatsNaarSchap,
      verkoopVanSchap,
      betaalMandje,
      staffLog,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore moet binnen <StoreProvider> gebruikt worden')
  return ctx
}
