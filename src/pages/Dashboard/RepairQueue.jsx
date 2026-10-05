import { Card, Empty, ListRow } from '../../components/ui'
import { WorkOrderBadge } from '../../components/vehicle/StatusBadge'
import VehicleThumb from '../../components/vehicle/VehicleThumb'
import { woCost } from '../../lib/calc'
import { thb, vehicleName } from '../../lib/format'

const OPEN = ['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS']

// Open work orders, pending approvals first.
export default function RepairQueue({ vehicles, limit = 5 }) {
  const rows = vehicles
    .flatMap((v) => v.workOrders.filter((w) => OPEN.includes(w.status)).map((w) => ({ v, w })))
    .sort((a, b) => OPEN.indexOf(a.w.status) - OPEN.indexOf(b.w.status))
    .slice(0, limit)

  return (
    <Card flush>
      {rows.length === 0 && <Empty>ไม่มีงานซ่อมค้าง</Empty>}
      {rows.map(({ v, w }) => (
        <ListRow
          key={w.id}
          to={`/vehicles/${v.id}?tab=repairs`}
          leading={<VehicleThumb vehicle={v} />}
          title={w.title}
          subtitle={`${vehicleName(v)} · ${w.vendor} · ${thb(woCost(w))}`}
          trailing={<WorkOrderBadge status={w.status} />}
        />
      ))}
    </Card>
  )
}
