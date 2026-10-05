import { seedVehicles } from '../data/mock'
import { pendingAdvances, todayISO } from '../lib/calc'
import { uid } from '../lib/id'

// Persisted to localStorage so demo edits survive a reload.
const KEY = 'carfinace:v4'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // storage unavailable: fall back to seed data
  }
  return { vehicles: seedVehicles() }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore: storage full or blocked
  }
}

function withStatus(v, to, patch = {}) {
  return {
    ...v,
    ...patch,
    status: to,
    soldAt: to === 'SOLD' ? (patch.soldAt ?? todayISO()) : to === 'READY_FOR_SALE' ? null : v.soldAt,
    logs: [...v.logs, { from: v.status, to, at: new Date().toISOString(), by: 'à¸„à¸¸à¸“' }],
  }
}

const mapVehicle = (state, id, fn) => ({
  ...state,
  vehicles: state.vehicles.map((v) => (v.id === id ? fn(v) : v)),
})

const mapWorkOrder = (v, woId, fn) => ({
  ...v,
  workOrders: v.workOrders.map((w) => (w.id === woId ? fn(w) : w)),
})

// Settle an advance with its receipt. An advance only pays for work; it never
// adds cost by itself:
// - linked to an existing item: that item is re-priced to the receipt total
//   (cost moves only by the difference from what was planned)
// - off-list purchase: what was spent becomes a new item
function clearAdvance(w, advanceId, { spent, itemName, itemType, receiptNo }) {
  const adv = (w.advances ?? []).find((x) => x.id === advanceId)
  const linked = adv?.itemId && w.items.find((i) => i.id === adv.itemId)
  let items = w.items
  let itemId = adv?.itemId ?? null
  const offList = !linked

  if (linked) {
    if (spent > 0) {
      items = w.items.map((i) => (i.id === linked.id ? { ...i, unitCost: Math.round((spent / i.qty) * 100) / 100 } : i))
    }
  } else if (spent > 0) {
    itemId = uid()
    items = [...w.items, { id: itemId, type: itemType, name: itemName, qty: 1, unitCost: spent }]
  }

  const advances = (w.advances ?? []).map((x) =>
    x.id === advanceId ? { ...x, status: 'CLEARED', spent, receiptNo, itemId, offList, clearedAt: todayISO() } : x,
  )
  return { ...w, advances, items }
}

export function reducer(state, a) {
  switch (a.type) {
    case 'addVehicle':
      return { ...state, vehicles: [a.vehicle, ...state.vehicles] }
    case 'setStatus':
      return mapVehicle(state, a.id, (v) => withStatus(v, a.to, a.patch))
    case 'updateVehicle':
      return mapVehicle(state, a.id, (v) => ({ ...v, ...a.patch }))
    case 'addExpense':
      return mapVehicle(state, a.id, (v) => ({ ...v, expenses: [...v.expenses, a.expense] }))
    case 'addWorkOrder':
      return mapVehicle(state, a.id, (v) => {
        const next = { ...v, workOrders: [...v.workOrders, a.workOrder] }
        // Opening a work order on a car that is not yet in repair moves it there.
        return ['IN_STOCK', 'INSPECTION'].includes(v.status) ? withStatus(next, 'RECONDITIONING') : next
      })
    case 'setWorkOrderStatus':
      return mapVehicle(state, a.id, (v) =>
        mapWorkOrder(v, a.woId, (w) =>
          // A work order cannot close while cash advances are still uncleared.
          a.to === 'DONE' && pendingAdvances(w).length ? w : { ...w, status: a.to },
        ),
      )
    case 'addWorkOrderItem':
      return mapVehicle(state, a.id, (v) => mapWorkOrder(v, a.woId, (w) => ({ ...w, items: [...w.items, a.item] })))
    case 'addAdvance':
      return mapVehicle(state, a.id, (v) =>
        mapWorkOrder(v, a.woId, (w) => ({ ...w, advances: [...(w.advances ?? []), a.advance] })),
      )
    case 'clearAdvance':
      return mapVehicle(state, a.id, (v) => mapWorkOrder(v, a.woId, (w) => clearAdvance(w, a.advanceId, a.clear)))
    case 'reset':
      return { vehicles: seedVehicles() }
    default:
      return state
  }
}
