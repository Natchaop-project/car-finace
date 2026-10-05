import { useState } from 'react'
import { Button, Card, Icon, Segmented } from '../../../components/ui'
import { WorkOrderBadge } from '../../../components/vehicle/StatusBadge'
import { advancesOf, pendingAdvanceTotal, pendingAdvances, woCost } from '../../../lib/calc'
import { date, thb } from '../../../lib/format'
import { WO_STATUS } from '../../../lib/status'
import BudgetBar from './BudgetBar'
import WorkOrderAdvances from './WorkOrderAdvances'
import WorkOrderItems from './WorkOrderItems'

const OPEN_FOR_CASH = ['APPROVED', 'IN_PROGRESS']

export default function WorkOrderCard({ workOrder: wo, onStatusChange, onAddItem, onAddAdvance, onClearAdvance }) {
  const advances = advancesOf(wo)
  const pending = pendingAdvances(wo)
  const [view, setView] = useState(pending.length ? 'advances' : 'items')
  const next = WO_STATUS[wo.status].next
  const blocked = next?.to === 'DONE' && pending.length > 0
  const canAddCash = OPEN_FOR_CASH.includes(wo.status)

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-[17px] font-semibold">{wo.title}</h3>
            <WorkOrderBadge status={wo.status} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-2">
            {wo.vendor} · เปิดงาน {date(wo.createdAt)}
          </p>
        </div>
        {next && (
          <div className="flex flex-col items-end gap-1">
            <Button size="sm" disabled={blocked} onClick={() => onStatusChange(next.to)}>
              {next.label}
            </Button>
            {blocked && <span className="text-xs text-tone-orange">เคลียร์เงินทดรองก่อนปิดงาน</span>}
          </div>
        )}
      </div>

      <div className="mt-5">
        <BudgetBar spent={woCost(wo)} budget={wo.budget} />
        {pending.length > 0 && (
          <p className="mt-2 text-[13px] text-tone-orange tabular-nums">
            เงินทดรองรอเคลียร์ {thb(pendingAdvanceTotal(wo))} · ยังไม่นับเป็นต้นทุน
          </p>
        )}
      </div>

      <div className="mt-5 mb-2">
        <Segmented
          label="มุมมองใบสั่งซ่อม"
          value={view}
          onChange={setView}
          options={[
            { value: 'items', label: 'รายการ', count: wo.items.length },
            { value: 'advances', label: 'เงินทดรอง', count: advances.length },
          ]}
        />
      </div>

      {view === 'items' ? (
        <WorkOrderItems workOrder={wo} />
      ) : (
        <WorkOrderAdvances advances={advances} onClear={onClearAdvance} />
      )}

      {wo.status !== 'DONE' && (
        <div className="mt-3 -ml-2.5 flex flex-wrap gap-1">
          {view === 'items' ? (
            <Button variant="ghost" size="sm" onClick={onAddItem}>
              <Icon name="plus" size={15} strokeWidth={2.2} />
              เพิ่มรายการ
            </Button>
          ) : (
            canAddCash && (
              <Button variant="ghost" size="sm" onClick={onAddAdvance}>
                <Icon name="plus" size={15} strokeWidth={2.2} />
                เบิกเงินทดรอง
              </Button>
            )
          )}
        </div>
      )}
    </Card>
  )
}
