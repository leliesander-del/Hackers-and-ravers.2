import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile } from '../data/profiles.js'
import { getProduct, products } from '../data/products.js'
import { getManager } from '../data/managers.js'
import { buildInitialInventory, enrichProduct } from '../lib/inventory.js'
import { isGekwalificeerdeBediende } from '../lib/staffAccess.js'

const StoreContext = createContext(null)

const PROFIEL_KEY = 'storenav.profielId'
const DYNAMISCH_PROFIEL_KEY = 'storenav.profiel'
export const ACCOUNTS_KEY = 'storenav.accounts'
const CART_KEY = 'storenav.cart'
const AFGEVINKT_KEY = 'storenav.afgevinkt'
const MANAGER_KEY = 'storenav.managerId'
const EDITS_KEY = 'storenav.profielEdits'
const INVENTORY_KEY = 'storenav.inventory'
const STAFF_LOG_KEY = 'storenav.staffLog'

export function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {} }
  catch { return {} }
}

export function saveAccount(email, data) {
  const accounts = getAccounts()
  accounts[email.toLowerCase()] = data
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

// Voegt de door de gebruiker bewerkte velden samen met het basisprofiel.
function mergeProfile(base, edit) {
  if (!base || !edit) return base
  return {
    ...base,
    ...edit,
    voorkeuren: base.voorkeuren ? { ...base.voorkeuren, ...(edit.voorkeuren || {}) } : base.voorkeuren,
    persoon: { ...(base.persoon || {}), ...(edit.persoon || {}) },
  }
}

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
  const [dynamischProfiel, setDynamischProfiel] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DYNAMISCH_PROFIEL_KEY)) || null }
    catch { return null }
  })
  const [cartIds, setCartIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })
  const [afgevinkt, setAfgevinkt] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AFGEVINKT_KEY)) || []
    } catch {
      return []
    }
  })
  const [managerId, setManagerId] = useState(() => localStorage.getItem(MANAGER_KEY) || null)
  const [edits, setEdits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(EDITS_KEY)) || {}
    } catch {
      return {}
    }
  })
  const [inventory, setInventory] = useState(loadInventory)
  const [staffLog, setStaffLog] = useState(loadStaffLog)

  useEffect(() => {
    if (profielId) localStorage.setItem(PROFIEL_KEY, profielId)
    else localStorage.removeItem(PROFIEL_KEY)
  }, [profielId])

  useEffect(() => {
    if (dynamischProfiel) localStorage.setItem(DYNAMISCH_PROFIEL_KEY, JSON.stringify(dynamischProfiel))
    else localStorage.removeItem(DYNAMISCH_PROFIEL_KEY)
  }, [dynamischProfiel])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartIds))
  }, [cartIds])

  useEffect(() => {
    localStorage.setItem(AFGEVINKT_KEY, JSON.stringify(afgevinkt))
  }, [afgevinkt])

  useEffect(() => {
    if (managerId) localStorage.setItem(MANAGER_KEY, managerId)
    else localStorage.removeItem(MANAGER_KEY)
  }, [managerId])

  useEffect(() => {
    localStorage.setItem(EDITS_KEY, JSON.stringify(edits))
  }, [edits])

  useEffect(() => {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory))
  }, [inventory])

  useEffect(() => {
    localStorage.setItem(STAFF_LOG_KEY, JSON.stringify(staffLog.slice(0, 50)))
  }, [staffLog])

  const activeProfile = useMemo(
    () => dynamischProfiel || mergeProfile(getProfile(profielId), edits[profielId]),
    [dynamischProfiel, profielId, edits],
  )
  const activeManager = useMemo(() => getManager(managerId), [managerId])
  const gekwalificeerdPersoneel = useMemo(() => isGekwalificeerdeBediende(activeProfile), [activeProfile])

  const getStock = useCallback((productId) => inventory[productId] ?? { magazijn: 0, schap: 0 }, [inventory])

  const getProductLive = useCallback((id) => enrichProduct(getProduct(id), getStock(id)), [getStock])

  const productsByStoreLive = useCallback(
    (storeId) => products.filter((p) => p.storeId === storeId).map((p) => enrichProduct(p, getStock(p.id))),
    [getStock],
  )

  const allProductsLive = useMemo(() => products.map((p) => enrichProduct(p, getStock(p.id))), [getStock])

  const cart = useMemo(() => cartIds.map(getProductLive).filter(Boolean), [cartIds, getProductLive])

  const logStaffActie = useCallback((tekst) => {
    setStaffLog((log) =>
      [{ id: Date.now(), tekst, tijd: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) }, ...log].slice(0, 50),
    )
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
        [productId]: { magazijn: stock.magazijn - aantal, schap: stock.schap + aantal },
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
        [productId]: { magazijn: stock.magazijn, schap: stock.schap - aantal },
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
      isGekwalificeerdeBediende: gekwalificeerdPersoneel,
      login: (arg) => {
        if (typeof arg === 'string') {
          setDynamischProfiel(null)
          setProfielId(arg)
        } else if (arg && typeof arg === 'object') {
          setProfielId(null)
          setDynamischProfiel(arg)
        }
      },
      logout: () => {
        setDynamischProfiel(null)
        setProfielId(null)
      },
      cart,
      cartCount: cartIds.length,
      cartTotaal: cart.reduce((som, p) => som + p.prijs, 0),
      inCart: (id) => cartIds.includes(id),
      addToCart: (id) => setCartIds((ids) => (ids.includes(id) ? ids : [...ids, id])),
      addManyToCart: (ids) =>
        setCartIds((cur) => {
          const aanwezig = new Set(cur)
          const nieuw = (ids || []).filter((id) => !aanwezig.has(id) && getProduct(id))
          return nieuw.length ? [...cur, ...nieuw] : cur
        }),
      removeFromCart: (id) => {
        setCartIds((ids) => ids.filter((x) => x !== id))
        setAfgevinkt((a) => a.filter((x) => x !== id))
      },
      clearCart: () => {
        setCartIds([])
        setAfgevinkt([])
      },
      isAfgevinkt: (id) => afgevinkt.includes(id),
      toggleAfgevinkt: (id) =>
        setAfgevinkt((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id])),
      activeManager,
      isManagerIngelogd: !!activeManager,
      managerLogin: (id) => setManagerId(id),
      managerLogout: () => setManagerId(null),
      updateProfile: (patch) =>
        setEdits((e) => {
          if (!profielId) return e
          const huidig = e[profielId] || {}
          return {
            ...e,
            [profielId]: {
              ...huidig,
              ...patch,
              voorkeuren: patch.voorkeuren ? { ...(huidig.voorkeuren || {}), ...patch.voorkeuren } : huidig.voorkeuren,
              persoon: patch.persoon ? { ...(huidig.persoon || {}), ...patch.persoon } : huidig.persoon,
            },
          }
        }),
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
      activeManager,
      gekwalificeerdPersoneel,
      cart,
      cartIds,
      afgevinkt,
      profielId,
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
