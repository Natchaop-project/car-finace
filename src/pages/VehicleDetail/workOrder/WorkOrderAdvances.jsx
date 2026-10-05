import { Badge, Button, Empty } from '../../../components/ui'
import { advanceChange } from '../../../lib/calc'
import { date, thb } from '../../../lib/format'
import { ADVANCE_STATUS } from '../../../lib/status'

function ChangeNote({ advance: a }) {
  const change = advanceChange(a)
  if (change > 0) return <>คืนเงินทอน {thb(change)}</>
  if (change < 0) return <span className="text-tone-orange">จ่ายเพิ่มให้พนักงาน {thb(-change)}</span>
  return <>ใช้พอดี</>
}

// Cash advances drawn by staff for this work order.
export default function WorkOrderAdvances({ advances, onClear }) {
  if (advances.length === 0) return <Empty>ยังไม่มีการเบิกเงินทดรอง</Empty>

  return (
    <ul>
      {advances.map((a) => {
        const s = ADVANCE_STATUS[a.status]
        const pending = a.status === 'PENDING_CLEAR'
        return (
          <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-3 first:border-t-0">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {a.purpose}
                {(!a.itemId || a.offList) && <span className="ml-2 text-xs font-normal text-ink-3">นอกรายการ</span>}
              </p>
              <p className="truncate text-[13px] text-ink-2">
                {a.payee} · เบิก {date(a.date)}
                {!pending && (
                  <>
                    {' '}
                    · ใช้จริง {thb(a.spent)} · <ChangeNote advance={a} />
                    {a.receiptNo && <> · ใบเสร็จ {a.receiptNo}</>}
                  </>
                )}
              </p>
            </div>
            <span className="text-sm font-medium tabular-nums">{thb(a.amount)}</span>
            <Badge tone={s.tone}>{s.label}</Badge>
            {pending && (
              <Button size="sm" onClick={() => onClear(a.id)}>
                เคลียร์
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
