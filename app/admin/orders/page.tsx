'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/admin/orders/page.tsx
// Order fulfilment tracker for factory/warehouse staff. Built to be used on
// a phone, in a hurry, by someone who is not going to read instructions:
// one tab per stage, one big button per order, nothing else to figure out.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { thumbUrl, PLACEHOLDER_URL } from '@/lib/cloudflareImages'
import { adminLogout } from '@/app/admin/actions'

interface OrderItem {
  id: string
  product_name: string
  color: string
  size: string | null
  price: number
  quantity: number
  image: string | null
}

interface Order {
  id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  total: number
  fulfillment_status: 'unfulfilled' | 'packed' | 'shipped' | 'delivered'
  created_at: string
  shipped_at: string | null
  delivered_at: string | null
  order_items: OrderItem[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const STAGES = [
  { key: 'unfulfilled', label: 'To Ship',   next: 'shipped',   nextLabel: 'Mark as Shipped' },
  { key: 'shipped',     label: 'Shipped',   next: 'delivered', nextLabel: 'Mark as Delivered' },
  { key: 'delivered',   label: 'Delivered', next: null,        nextLabel: null },
] as const

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<Order[] | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [tab, setTab]         = useState<string>('unfulfilled')
  const [updating, setUpdating] = useState<string | null>(null)

  function loadOrders() {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setOrders(data.orders)
      })
      .catch(() => setError('Failed to load orders'))
  }

  useEffect(loadOrders, [])

  const counts = useMemo(() => {
    const c = new Map<string, number>()
    for (const o of orders ?? []) c.set(o.fulfillment_status, (c.get(o.fulfillment_status) ?? 0) + 1)
    return c
  }, [orders])

  const filtered = (orders ?? [])
    .filter((o) => o.fulfillment_status === tab)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  async function advance(order: Order, next: string) {
    setUpdating(order.id)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: next }),
      })
      if (!res.ok) throw new Error()
      const { order: updated } = await res.json()
      setOrders((prev) =>
        prev
          ? prev.map((o) =>
              o.id === order.id
                ? { ...o, fulfillment_status: updated.fulfillment_status, shipped_at: updated.shipped_at, delivered_at: updated.delivered_at }
                : o
            )
          : prev
      )
    } catch {
      alert('Could not update this order. Check your connection and try again.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F0]">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="font-semibold text-xl text-[#1C1B19]">Order Tracker</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/media" className="text-xs text-gray-500 hover:text-[#1C1B19] underline">
              Media
            </Link>
            <form action={adminLogout}>
              <button type="submit" className="text-xs text-gray-500 hover:text-[#1C1B19] underline">
                Log out
              </button>
            </form>
          </div>
        </div>

        {/* ── Stage tabs ── */}
        <div className="grid grid-cols-3 gap-2">
          {STAGES.map((stage) => (
            <button
              key={stage.key}
              type="button"
              onClick={() => setTab(stage.key)}
              className={`flex flex-col items-center justify-center rounded-lg py-3 px-1 text-center transition-colors ${
                tab === stage.key
                  ? 'bg-[#1C1B19] text-white'
                  : 'bg-gray-100 text-[#1C1B19] hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl font-bold leading-none tabular-nums mb-1">
                {counts.get(stage.key) ?? 0}
              </span>
              <span className="text-[11px] font-medium leading-tight">{stage.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!orders && !error && <p className="text-sm text-gray-500">Loading orders…</p>}
        {orders && filtered.length === 0 && (
          <p className="text-sm text-gray-500 mt-8 text-center">Nothing here right now.</p>
        )}

        <div className="space-y-4 max-w-2xl mx-auto">
          {filtered.map((order) => {
            const stage = STAGES.find((s) => s.key === order.fulfillment_status)!
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                {/* Order id + placed date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-gray-500">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Customer + address */}
                <div className="mb-3">
                  <p className="font-semibold text-[#1C1B19]">{order.full_name}</p>
                  <a href={`tel:${order.phone}`} className="text-sm text-blue-600 underline">
                    {order.phone}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.address_line1}
                    {order.address_line2 ? `, ${order.address_line2}` : ''}, {order.city}, {order.state} {order.pincode}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-3 border-t border-gray-100 pt-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={item.image ? thumbUrl(item.image) : PLACEHOLDER_URL}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1B19] truncate">{item.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {item.color}{item.size ? `, ${item.size}` : ''} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Amount paid */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-gray-500">Paid</span>
                  <span className="font-semibold text-[#1C1B19]">₹{order.total.toLocaleString('en-IN')}</span>
                </div>

                {/* Shipped / delivered dates */}
                {(order.shipped_at || order.delivered_at) && (
                  <div className="flex gap-4 mb-3 text-xs text-gray-500">
                    {order.shipped_at && <span>Shipped {formatDate(order.shipped_at)}</span>}
                    {order.delivered_at && <span>Delivered {formatDate(order.delivered_at)}</span>}
                  </div>
                )}

                {/* Action */}
                {stage.next ? (
                  <button
                    type="button"
                    disabled={updating === order.id}
                    onClick={() => advance(order, stage.next!)}
                    className="w-full bg-[#1C1B19] text-white rounded-lg py-3.5 text-sm font-semibold disabled:opacity-50 active:scale-[0.98] transition-transform"
                  >
                    {updating === order.id ? 'Updating…' : stage.nextLabel}
                  </button>
                ) : (
                  <div className="w-full bg-green-50 text-green-700 rounded-lg py-3 text-sm font-semibold text-center">
                    ✓ Delivered
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
