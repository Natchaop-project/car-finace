import { Link } from 'react-router'
import { Button } from '../../components/ui'
import { WorkOrderBadge } from '../../components/vehicle/StatusBadge'
import VehicleThumb from '../../components/vehicle/VehicleThumb'
import { pendingAdvanceTotal, woCost } from '../../lib/calc'
import { date, thb, vehicleName } from '../../lib/format'
import { WO_STATUS } from '../../lib/status'

export default function WorkOrderRow({ vehicle: v, workOrder: wo, onStatusChange }) {
  const next = WO_STATUS[wo.status].next
  const owed = pendingAdvanceTotal(wo)
  const blocked = next?.to === 'DONE' && owed > 0

  return (
    <div className="flex items-center gap-3.5 border-t border-line px-5 py-3.5 first:border-t-0 max-sm:flex-wrap max-sm:px-4">
      <VehicleThumb vehicle={v} />
      <Link to={`/vehicles/${v.id}?tab=repairs`} className="min-w-0 flex-1 text-ink hover:no-underline">
        <p className="truncate font-medium">{wo.title}</p>
        <p className="truncate text-[13px] text-ink-2">
          {vehicleName(v)} {v.year} · {wo.vendor} · {date(wo.createdAt)}
        </p>
        {owed > 0 && <p className="text-xs font-medium text-tone-orange">เงินทดรองรอเคลียร์ {thb(owed)}</p>}
      </Link>
      <div className="text-right tabular-nums max-sm:ml-auto">
        <p className="text-sm font-medium">{thb(woCost(wo))}</p>
        <p className="text-xs text-ink-3">งบ {thb(wo.budget)}</p>
      </div>
      <div className="flex w-47.5 items-center justify-end gap-2 max-sm:w-full">
        <WorkOrderBadge status={wo.status} />
        {next && (
          <Button
            size="sm"
            variant={wo.status === 'PENDING_APPROVAL' ? 'primary' : 'secondary'}
            disabled={blocked}
            title={blocked ? 'เคลียร์เงินทดรองก่อนปิดงาน' : undefined}
            onClick={() => onStatusChange(next.to)}
          >
            {next.label}
          </Button>
        )}
      </div>
    </div>
  )
}
