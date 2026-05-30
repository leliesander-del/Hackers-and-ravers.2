import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getStaffStoreId } from '../lib/staffAccess.js'
import { useStaffQuantity } from '../lib/staffQuantity.js'
import { groupStockByShelf } from '../lib/staffStock.js'
import PageHeader from '../components/PageHeader.jsx'
import StockBadge from '../components/staff/StockBadge.jsx'
import CollapsibleSection from '../components/staff/CollapsibleSection.jsx'
import StaffProductActionPanel from '../components/staff/StaffProductActionPanel.jsx'

function StaffProductRow({ product, active, onClick }) {
  const target = product.targetShelfStock
  return (
    <button
      type="button"
      onClick={() => onClick(product.id)}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1 transition ${
        active ? 'bg-brand-100 ring-brand-400' : 'bg-slate-50 ring-slate-100 hover:bg-brand-50'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-800">{product.name}</p>
        <p className="truncate text-xs text-slate-500">
          {product.brand} · {product.shelfLocation?.label} · target {target} on shelves
        </p>
      </div>
      <StockBadge warehouse={product.warehouseStock} shelves={product.shelfStock} compact />
    </button>
  )
}

export default function DashboardPage() {
  const { activeProfile, productsByStoreLive, getProductLive, moveToShelves } = useStore()

  const storeId = getStaffStoreId(activeProfile)
  const store = storeId ? getStore(storeId) : null

  const [selectedId, setSelectedId] = useState(null)
  const [notice, setNotice] = useState(null)

  const storeProducts = useMemo(
    () => (storeId ? productsByStoreLive(storeId) : []),
    [productsByStoreLive, storeId],
  )

  const { out, emptyShelves, shelfLow, wellStocked } = useMemo(
    () => groupStockByShelf(storeProducts),
    [storeProducts],
  )

  const selected = selectedId ? getProductLive(selectedId) : null
  const maxWarehouse = selected?.warehouseStock ?? 0
  const { parseQuantity, resetQuantity, quantityInputProps } = useStaffQuantity(maxWarehouse)

  function showNotice(text, type = 'info') {
    setNotice({ text, type })
    setTimeout(() => setNotice(null), 3500)
  }

  function selectProduct(id) {
    setSelectedId((current) => (current === id ? null : id))
    resetQuantity()
  }

  function restockShelvesAction() {
    if (!selectedId) return
    const result = moveToShelves(selectedId, parseQuantity())
    if (result.ok) {
      showNotice('Moved to shelves!', 'ok')
      resetQuantity()
      setSelectedId(null)
    } else {
      showNotice(result.error, 'error')
    }
  }

  function actionPanelForProduct(product) {
    const quantity = parseQuantity()
    const max = product.warehouseStock ?? 0
    return (
      <StaffProductActionPanel
        product={product}
        variant="violet"
        mode="restock"
        inputId={`shelf-qty-${product.id}`}
        {...quantityInputProps(restockShelvesAction)}
        maxQuantity={max}
        showShelfTarget
        actionLabel={`${quantity} units warehouse → shelves`}
        onAction={restockShelvesAction}
        actionDisabled={max === 0}
        onClose={() => setSelectedId(null)}
      />
    )
  }

  function renderProductWithActions(product) {
    const active = selectedId === product.id
    return (
      <div key={product.id}>
        <StaffProductRow product={product} active={active} onClick={selectProduct} />
        {active && selected && actionPanelForProduct(selected)}
      </div>
    )
  }

  if (!storeId || !store) {
    return (
      <div className="px-4 py-8 text-center text-sm text-slate-500">
        No store assigned to this staff account.
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Shelf stocker" subtitle={store.name} />

      <div className="space-y-4 px-4 py-4">
        {notice && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              notice.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-rose-50 p-3 ring-1 ring-rose-100">
            <p className="text-2xl font-bold text-rose-600">{out.length}</p>
            <p className="text-[10px] font-medium text-rose-700">Out of stock</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
            <p className="text-2xl font-bold text-orange-600">{emptyShelves.length}</p>
            <p className="text-[10px] font-medium text-orange-800">Shelves empty</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
            <p className="text-2xl font-bold text-amber-600">{shelfLow.length}</p>
            <p className="text-[10px] font-medium text-amber-700">Shelves low</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
            <p className="text-2xl font-bold text-emerald-600">{wellStocked.length}</p>
            <p className="text-[10px] font-medium text-emerald-700">Well stocked</p>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Tap a product to restock the shelves from the warehouse. The action appears right below the chosen product.
        </p>

        <CollapsibleSection title="Out of stock" count={out.length} color="rose" defaultOpen={out.length > 0}>
          <p className="px-1 text-[11px] font-medium text-slate-500">Shelves and warehouse empty</p>
          {out.length ? (
            out.map(renderProductWithActions)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">No products that are out of stock everywhere.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Shelves empty"
          count={emptyShelves.length}
          color="orange"
          defaultOpen={emptyShelves.length > 0}
        >
          <p className="px-1 text-[11px] font-medium text-slate-500">Warehouse still has stock</p>
          {emptyShelves.length ? (
            emptyShelves.map(renderProductWithActions)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">No empty shelves with warehouse stock.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Shelves low"
          count={shelfLow.length}
          color="amber"
          defaultOpen={shelfLow.length > 0}
        >
          {shelfLow.length ? (
            shelfLow.map(renderProductWithActions)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">Everything on shelves above half the target.</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Well stocked" count={wellStocked.length} color="emerald">
          {wellStocked.length ? (
            wellStocked.map(renderProductWithActions)
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">No products with plenty of shelf stock.</p>
          )}
        </CollapsibleSection>
      </div>
    </div>
  )
}
