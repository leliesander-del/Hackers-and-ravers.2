import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile } from '../data/profiles.js'
import { getProduct } from '../data/products.js'

const StoreContext = createContext(null)

const PROFIEL_KEY = 'storenav.profielId'
const CART_KEY = 'storenav.cart'
const EDITS_KEY = 'storenav.profielEdits'

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
  // Bewerkingen op profielen (persoonsgegevens + voorkeuren), per profiel-id.
  const [edits, setEdits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(EDITS_KEY)) || {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    if (profielId) localStorage.setItem(PROFIEL_KEY, profielId)
    else localStorage.removeItem(PROFIEL_KEY)
  }, [profielId])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartIds))
  }, [cartIds])

  useEffect(() => {
    localStorage.setItem(EDITS_KEY, JSON.stringify(edits))
  }, [edits])

  const activeProfile = useMemo(() => mergeProfile(getProfile(profielId), edits[profielId]), [profielId, edits])
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
      // Wijzig persoonsgegevens/voorkeuren van het actieve profiel (blijft bewaard).
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
    }),
    [activeProfile, cart, cartIds, profielId],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore moet binnen <StoreProvider> gebruikt worden')
  return ctx
}
