import { Button, Card, Empty, Icon, SectionTitle } from '../../../components/ui'
import { isSold } from '../../../lib/calc'
import { APPROVAL_LIMIT } from '../../../lib/status'
import { thb } from '../../../lib/format'
import WorkOrderCard from '../workOrder/WorkOrderCard'

export default function RepairsTab({ vehicle: v, onNewWorkOrder, onStatusChange, onAddItem, onAddAdvance, onClearAdvance }) {
  return (
    <div>
      <SectionTitle
        action={
          !isSold(v) && (
            <Button onClick={onNewWorkOrder}>
              <Icon name="plus" size={16} strokeWidth={2.2} />
              สร้างใบสั่งซ่อม
            </Button>
          )
        }
      >
        ใบสั่งซ่อม
      </SectionTitle>
      <p className="-mt-2 mb-5 text-[13px] text-ink-3">งบเกิน {thb(APPROVAL_LIMIT)} ต้องให้ผู้จัดการอนุมัติก่อนเริ่มงาน · เงินทดรองต้องเคลียร์ก่อนปิดงาน</p>

      {v.workOrders.length === 0 ? (
        <Card>
          <Empty>ยังไม่มีใบสั่งซ่อมสำหรับรถคันนี้</Empty>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {v.workOrders.map((wo) => (
            <WorkOrderCard
              key={wo.id}
              workOrder={wo}
              onStatusChange={(to) => onStatusChange(wo.id, to)}
              onAddItem={() => onAddItem(wo.id)}
              onAddAdvance={() => onAddAdvance(wo.id)}
              onClearAdvance={(advanceId) => onClearAdvance(wo.id, advanceId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
