import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile } from '../data/profiles.js'
import { getProduct, products } from '../data/products.js'
import { stores } from '../data/stores.js'
import { getManager } from '../data/managers.js'
import { buildInitialInventory, enrichProduct } from '../lib/inventory.js'
import { isGekwalificeerdeBediende } from '../lib/staffAccess.js'
import { kiesBesteProduct, labelVoorTerm } from '../lib/assistent.js'

// Een mandje-item is winkel-onafhankelijk: ofwel een ingrediënt-term
// (kind: 'ingredient'), ofwel een concreet product dat je in een winkel
// aanklikte (kind: 'product'). Pas bij winkelkeuze wordt het opgelost.
function normaliseerCartItem(entry) {
  if (typeof entry === 'string') return { key: entry, kind: 'product' } // oude opslag
  if (entry && entry.key && (entry.kind === 'ingredient' || entry.kind === 'product')) {
    return { key: entry.key, kind: entry.kind }
  }
  return null
}

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
  const [cartItems, setCartItems] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem(CART_KEY)) || []).map(normaliseerCartItem).filter(Boolean)
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
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

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

  // De zichtbare (winkel-onafhankelijke) lijst: elk item met een leesbaar label.
  const cart = useMemo(
    () =>
      cartItems.map((it) => ({
        key: it.key,
        kind: it.kind,
        label: it.kind === 'ingredient' ? labelVoorTerm(it.key) : getProduct(it.key)?.naam || it.key,
      })),
    [cartItems],
  )

  // Los de lijst op tegen één winkel: per item het best passende live product
  // uit díe winkel (of null als de winkel het niet voert). Dit is het moment
  // waarop winkels aan de lijst gekoppeld worden.
  const resolveCartVoorWinkel = useCallback(
    (storeId) => {
      const pool = productsByStoreLive(storeId)
      const byId = new Map(pool.map((p) => [p.id, p]))
      return cartItems.map((item) => {
        const product =
          item.kind === 'product' ? byId.get(item.key) || null : kiesBesteProduct(pool, item.key, activeProfile)
        return { item, product }
      })
    },
    [productsByStoreLive, activeProfile, cartItems],
  )

  // Welke winkels kunnen (een deel van) de lijst leveren, met dekking en prijs.
  const winkelsVoorLijst = useMemo(() => {
    if (!cartItems.length) return []
    return stores
      .map((store) => {
        const resolved = resolveCartVoorWinkel(store.id)
        const gevonden = resolved.filter((r) => r.product)
        // Dedup op product-id: één product telt één keer mee voor de prijs.
        const perId = new Map(gevonden.map((r) => [r.product.id, r.product.prijs]))
        const totaalPrijs = [...perId.values()].reduce((som, p) => som + p, 0)
        return { store, aantal: perId.size, totaal: cartItems.length, totaalPrijs }
      })
      .filter((w) => w.aantal > 0)
      .sort((a, b) => b.aantal - a.aantal || a.totaalPrijs - b.totaalPrijs)
  }, [cartItems, resolveCartVoorWinkel])

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

  // Afrekenen gebeurt in één gekozen winkel: los de lijst op tegen die winkel
  // en boek de gevonden producten af van het schap.
  const betaalMandje = useCallback(
    (storeId) => {
      const resolved = resolveCartVoorWinkel(storeId)
      const teVerkopen = [...new Set(resolved.filter((r) => r.product).map((r) => r.product.id))]
      const fouten = []
      for (const id of teVerkopen) {
        const result = verkoopVanSchap(id, 1)
        if (!result.ok) {
          const p = getProduct(id)
          fouten.push(p ? `${p.naam}: ${result.fout}` : result.fout)
        }
      }
      if (fouten.length === 0) {
        setCartItems([])
        setAfgevinkt([])
        return { ok: true }
      }
      return { ok: false, fout: fouten.join(' · ') }
    },
    [resolveCartVoorWinkel, verkoopVanSchap],
  )

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
      cartItems,
      cartCount: cartItems.length,
      resolveCartVoorWinkel,
      winkelsVoorLijst,
      // Concreet product (in een winkel aangeklikt) toevoegen/checken/verwijderen.
      inCart: (id) => cartItems.some((it) => it.kind === 'product' && it.key === id),
      addToCart: (id) =>
        setCartItems((cur) =>
          cur.some((it) => it.kind === 'product' && it.key === id) ? cur : [...cur, { key: id, kind: 'product' }],
        ),
      // Ingrediënt-termen vanuit de assistent/vragenlijst toevoegen.
      addIngredients: (termen) =>
        setCartItems((cur) => {
          const aanwezig = new Set(cur.filter((it) => it.kind === 'ingredient').map((it) => it.key))
          const nieuw = (termen || []).filter((t) => t && !aanwezig.has(t)).map((t) => ({ key: t, kind: 'ingredient' }))
          return nieuw.length ? [...cur, ...nieuw] : cur
        }),
      removeFromCart: (key) => {
        setCartItems((items) => items.filter((it) => it.key !== key))
        setAfgevinkt((a) => a.filter((x) => x !== key))
      },
      clearCart: () => {
        setCartItems([])
        setAfgevinkt([])
      },
      isAfgevinkt: (key) => afgevinkt.includes(key),
      toggleAfgevinkt: (key) =>
        setAfgevinkt((a) => (a.includes(key) ? a.filter((x) => x !== key) : [...a, key])),
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
      cartItems,
      resolveCartVoorWinkel,
      winkelsVoorLijst,
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
