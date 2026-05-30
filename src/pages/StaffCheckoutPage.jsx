import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getStaffStoreId } from '../lib/staffAccess.js'
import { parseProductQr } from '../lib/inventory.js'
import { fuzzySearchProducts } from '../lib/fuzzySearch.js'
import { useStaffQuantity } from '../lib/staffQuantity.js'
import { filterOnShelf, isOnShelf } from '../lib/staffStock.js'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StockBadge from '../components/staff/StockBadge.jsx'
import StaffProductActionPanel from '../components/staff/StaffProductActionPanel.jsx'

export default function StaffCheckoutPage() {
  const { activeProfile, productsByStoreLive, getProductLive, sellFromShelves, staffLog } = useStore()

  const storeId = getStaffStoreId(activeProfile)
  const store = storeId ? getStore(storeId) : null
  const [qrInput, setQrInput] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [notice, setNotice] = useState(null)

  const selected = selectedId ? getProductLive(selectedId) : null
  const maxShelves = selected?.shelfStock ?? 0
  const { parseQuantity, resetQuantity, quantityInputProps } = useStaffQuantity(maxShelves)

  const filteredProducts = useMemo(() => {
    if (!storeId) return []
    const onShelfProducts = filterOnShelf(productsByStoreLive(storeId))
    return fuzzySearchProducts(onShelfProducts, search)
  }, [productsByStoreLive, storeId, search])

  const salesLog = useMemo(() => staffLog.filter((item) => item.text.includes('sold')), [staffLog])

  function showNotice(text, type = 'info') {
    setNotice({ text, type })
    setTimeout(() => setNotice(null), 3500)
  }

  function selectProduct(id) {
    setSelectedId((current) => (current === id ? null : id))
    setQrInput('')
    resetQuantity()
  }

  function scanQr() {
    const id = parseProductQr(qrInput)
    if (!id) {
      showNotice('QR not recognized. Scan again or pick a product below.', 'error')
      return
    }
    const product = getProductLive(id)
    if (!product) {
      showNotice('Product not found.', 'error')
      return
    }
    if (product.storeId !== storeId) {
      showNotice('This product belongs to another store.', 'error')
      return
    }
    if (!isOnShelf(product)) {
      showNotice('This product is no longer on the shelves.', 'error')
      return
    }
    selectProduct(id)
    showNotice(`${product.name} selected`, 'ok')
  }

  function recordSale() {
    if (!selectedId) {
      showNotice('Select a product first.', 'error')
      return
    }
    const result = sellFromShelves(selectedId, parseQuantity())
    if (result.ok) {
      showNotice('Sale recorded!', 'ok')
      setQrInput('')
      resetQuantity()
      setSelectedId(null)
    } else {
      showNotice(result.error, 'error')
    }
  }

  const selectedInList = selectedId && filteredProducts.some((p) => p.id === selectedId)

  function actionPanel(product, inputPrefix) {
    const quantity = parseQuantity()
    const max = product.shelfStock ?? 0
    return (
      <StaffProductActionPanel
        product={product}
        variant="violet"
        mode="remove"
        inputId={`${inputPrefix}-qty-${product.id}`}
        {...quantityInputProps(recordSale)}
        maxQuantity={max}
        actionLabel={`${quantity} units sold (from shelves)`}
        onAction={recordSale}
        actionDisabled={max === 0}
        onClose={() => setSelectedId(null)}
      />
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
      <PageHeader title="Cashier" subtitle={store.name} />

      <div className="space-y-4 px-4 py-4">
        {notice && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              notice.type === 'ok'
                ? 'bg-emerald-50 text-emerald-800'
                : notice.type === 'error'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-brand-50 text-brand-800'
            }`}
          >
            {notice.text}
          </div>
        )}

        <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
          Record sales at <strong>{store.name}</strong>: only products on the shelves are shown. Deduct
          sales from the shelf stock.
        </p>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="mb-1 text-sm font-semibold text-slate-700">Scan QR code</p>
          <p className="mb-3 text-xs text-slate-400">Scan the product QR, or tap the product below.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && scanQr()}
              placeholder="Scan QR code…"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
            <button
              onClick={scanQr}
              className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Scan
            </button>
          </div>
        </section>

        {selected && !selectedInList && isOnShelf(selected) && actionPanel(selected, 'checkout-qr')}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Products</h2>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, brand or location…" />
          <div className="mt-2 max-h-[min(70vh,32rem)] space-y-2 overflow-y-auto">
            {filteredProducts.length ? (
              filteredProducts.map((p) => {
                const active = selectedId === p.id
                const live = active && selected ? selected : p

                return (
                  <div key={p.id}>
                    <button
                      type="button"
                      onClick={() => selectProduct(p.id)}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left shadow-sm ring-1 transition ${
                        active ? 'bg-brand-100 ring-brand-400' : 'bg-white ring-slate-100'
                      }`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                        🛒
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">
                          {p.brand} · {p.shelfLocation?.label}
                        </p>
                        <div className="mt-1">
                          <StockBadge warehouse={p.warehouseStock} shelves={p.shelfStock} />
                        </div>
                      </div>
                    </button>

                    {active && selected && actionPanel(live, 'checkout')}
                  </div>
                )
              })
            ) : (
              <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
                {search.trim()
                  ? `No products on the shelves for "${search}".`
                  : 'No products on the shelves — ask the shelf stocker to restock.'}
              </p>
            )}
          </div>
        </section>

        {salesLog.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Recent sales</h2>
            <div className="space-y-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              {salesLog.slice(0, 8).map((item) => (
                <p key={item.id} className="text-xs text-slate-600">
                  <span className="text-slate-400">{item.time}</span> · {item.text}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
