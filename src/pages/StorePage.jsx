import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { rankProducts } from '../lib/personalization.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Floorplan from '../components/Floorplan.jsx'
import ProductRow from '../components/ProductRow.jsx'

export default function StorePage() {
  const { id } = useParams()
  const { activeProfile, cartCount, productsByStoreLive } = useStore()
  const [zoek, setZoek] = useState('')

  const store = getStore(id)
  const winkelProducten = useMemo(() => productsByStoreLive(id), [productsByStoreLive, id])

  const resultaten = useMemo(() => {
    const gefilterd = zoek
      ? winkelProducten.filter(
          (p) =>
            p.naam.toLowerCase().includes(zoek.toLowerCase()) ||
            p.merk.toLowerCase().includes(zoek.toLowerCase()),
        )
      : winkelProducten
    return rankProducts(gefilterd, activeProfile)
  }, [winkelProducten, zoek, activeProfile])

  if (!store) return <Navigate to="/" replace />

  return (
    <div>
      <PageHeader
        title={store.naam}
        subtitle={`${store.type} · ${store.cashback}% cashback`}
        back
        right={
          <Link to="/mandje" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            🛍️
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <SearchBar value={zoek} onChange={setZoek} placeholder={`Zoek in ${store.naam}`} />

        {store.heeftPlattegrond ? (
          <Floorplan products={winkelProducten} />
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-sm">
            🗺️ Plattegrond komt eraan voor deze winkel
          </div>
        )}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">
            {zoek ? `Resultaten voor "${zoek}"` : 'Producten'}
            {activeProfile.type !== 'gast' && <span className="font-normal"> · gesorteerd op jouw voorkeur</span>}
          </h2>
          <div className="space-y-2">
            {resultaten.length ? (
              resultaten.map((p) => <ProductRow key={p.id} product={p} />)
            ) : (
              <p className="text-sm text-slate-400">Niets gevonden.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
