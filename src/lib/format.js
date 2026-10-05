const thbFormat = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const thb = (n) => (n == null || Number.isNaN(n) ? '—' : thbFormat.format(n))

export const num = (n) => (n == null ? '—' : n.toLocaleString('th-TH'))

export const pct = (n) => (n == null || !Number.isFinite(n) ? '—' : `${(n * 100).toFixed(1)}%`)

export const date = (iso) =>
  iso ? new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'

export const longDate = (d = new Date()) =>
  d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const vehicleName = (v) => `${v.make} ${v.model}`

// Parse a form field: empty string → null.
export const toNum = (s) => (s === '' ? null : Number(s))
