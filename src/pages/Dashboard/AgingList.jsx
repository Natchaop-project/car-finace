import { Card, Empty, ListRow, cx } from '../../components/ui'
import VehicleThumb from '../../components/vehicle/VehicleThumb'
import { AGING_DAYS, daysInStock, isActive, price } from '../../lib/calc'
import { thb, vehicleName } from '../../lib/format'
import { STATUS } from '../../lib/status'

// Unsold cars that have been in stock the longest.
export default function AgingList({ vehicles, limit = 5 }) {
  const rows = vehicles
    .filter(isActive)
    .map((v) => ({ v, days: daysInStock(v) }))
    .sort((a, b) => b.days - a.days)
    .slice(0, limit)

  return (
    <Card flush>
      {rows.length === 0 && <Empty>ไม่มีรถในสต็อก</Empty>}
      {rows.map(({ v, days }) => (
        <ListRow
          key={v.id}
          to={`/vehicles/${v.id}`}
          leading={<VehicleThumb vehicle={v} />}
          title={`${vehicleName(v)} ${v.year}`}
          subtitle={`${price(v) ? thb(price(v)) : 'ยังไม่ตั้งราคา'} · ${STATUS[v.status].label}`}
          trailing={
            <span className={cx('text-sm', days > AGING_DAYS ? 'font-semibold text-tone-orange' : 'text-ink-2')}>
              {days} วัน
            </span>
          }
        />
      ))}
    </Card>
  )
}
