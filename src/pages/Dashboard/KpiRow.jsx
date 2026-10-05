import { StatTile } from '../../components/ui'
import { daysInStock, isActive, profit, price, soldThisMonth, sum, totalCost } from '../../lib/calc'
import { pct, thb } from '../../lib/format'

export default function KpiRow({ vehicles }) {
  const active = vehicles.filter(isActive)
  const ready = active.filter((v) => v.status === 'READY_FOR_SALE').length
  const avgDays = active.length ? Math.round(sum(active, daysInStock) / active.length) : 0
  const sold = vehicles.filter((v) => soldThisMonth(v))
  const revenue = sum(sold, price)
  const gross = sum(sold, profit)

  return (
    <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:gap-3">
      <StatTile label="รถในสต็อก" value={`${active.length} คัน`} note={`พร้อมขาย ${ready} คัน`} />
      <StatTile label="ต้นทุนจมในสต็อก" value={thb(sum(active, totalCost))} note={`อยู่ในสต็อกเฉลี่ย ${avgDays} วัน`} />
      <StatTile label="ขายเดือนนี้" value={`${sold.length} คัน`} note={`ยอดขาย ${thb(revenue)}`} />
      <StatTile
        label="กำไรขั้นต้นเดือนนี้"
        value={thb(gross)}
        tone={gross >= 0 ? 'green' : 'red'}
        note={`อัตรากำไร ${pct(revenue ? gross / revenue : null)}`}
      />
    </div>
  )
}
