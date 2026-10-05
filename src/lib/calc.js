import { SOLD_STATUSES } from './status'

export const COUNTED_WO = ['APPROVED', 'IN_PROGRESS', 'DONE']
const DAY = 24 * 60 * 60 * 1000

export const todayISO = () => new Date().toISOString().slice(0, 10)

const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export const itemTotal = (item) => item.qty * item.unitCost

export const woCost = (wo) => wo.items.reduce((s, i) => s + itemTotal(i), 0)

// Only approved work counts toward the vehicle's cost.
export const reconCost = (v) =>
  v.workOrders.filter((w) => COUNTED_WO.includes(w.status)).reduce((s, w) => s + woCost(w), 0)

export const expenseCost = (v) => v.expenses.reduce((s, e) => s + e.amount, 0)

export const totalCost = (v) => v.purchasePrice + reconCost(v) + expenseCost(v)

export const isSold = (v) => SOLD_STATUSES.includes(v.status)

export const isActive = (v) => !isSold(v) && v.status !== 'CANCELLED'

export const price = (v) => v.salePrice ?? v.askingPrice ?? null

// Realised profit once sold, otherwise projected from the asking price.
export const profit = (v) => {
  const p = price(v)
  return p ? p - totalCost(v) : null
}

export const daysInStock = (v) => {
  const end = v.soldAt ? new Date(v.soldAt) : new Date()
  return Math.max(0, Math.round((startOfDay(end) - startOfDay(v.inDate)) / DAY))
}

export const AGING_DAYS = 60

export const soldThisMonth = (v, now = new Date()) => {
  if (!isSold(v) || !v.soldAt) return false
  const d = new Date(v.soldAt)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export const sum = (arr, fn) => arr.reduce((s, x) => s + fn(x), 0)

// Advances are cash out, not cost: cost is recorded as an item when the advance is cleared.
export const advancesOf = (wo) => wo.advances ?? []

export const pendingAdvances = (wo) => advancesOf(wo).filter((a) => a.status === 'PENDING_CLEAR')

export const pendingAdvanceTotal = (wo) => sum(pendingAdvances(wo), (a) => a.amount)

// Positive: staff returns change. Negative: the shop owes staff the difference.
export const advanceChange = (a) => a.amount - (a.spent ?? 0)

// The advance (if any) that pays for a given item.
export const advanceForItem = (wo, itemId) => advancesOf(wo).find((a) => a.itemId === itemId)
