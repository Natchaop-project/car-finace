import { useState } from 'react'
import { Card, Empty, PageHeader, Segmented } from '../../components/ui'
import { pendingAdvances } from '../../lib/calc'
import { thb } from '../../lib/format'
import { APPROVAL_LIMIT, WO_STATUS } from '../../lib/status'
import { useStore } from '../../store'
import WorkOrderRow from './WorkOrderRow'
import WorkOrderSummary from './WorkOrderSummary'

const ORDER = Object.keys(WO_STATUS)

export default function WorkOrders() {
  const { vehicles, dispatch } = useStore()
  const [filter, setFilter] = useState('open')

  const rows = vehicles
    .flatMap((v) => v.workOrders.map((wo) => ({ v, wo })))
    .sort((a, b) => ORDER.indexOf(a.wo.status) - ORDER.indexOf(b.wo.status) || b.wo.createdAt.localeCompare(a.wo.createdAt))

  const options = [
    { value: 'open', label: 'ยังไม่เสร็จ', count: rows.filter((r) => r.wo.status !== 'DONE').length },
    ...ORDER.map((s) => ({ value: s, label: WO_STATUS[s].label, count: rows.filter((r) => r.wo.status === s).length })),
    { value: 'advance', label: 'รอเคลียร์เงินทดรอง', count: rows.filter((r) => pendingAdvances(r.wo).length).length },
    { value: 'all', label: 'ทั้งหมด', count: rows.length },
  ]

  const FILTERS = {
    all: () => true,
    open: (r) => r.wo.status !== 'DONE',
    advance: (r) => pendingAdvances(r.wo).length > 0,
  }
  const shown = rows.filter(FILTERS[filter] ?? ((r) => r.wo.status === filter))

  return (
    <>
      <PageHeader title="งานซ่อม" subtitle={`ใบสั่งซ่อมของรถทุกคัน · งบเกิน ${thb(APPROVAL_LIMIT)} ต้องอนุมัติ`} />
      <WorkOrderSummary rows={rows} />
      <div className="mt-10 mb-5">
        <Segmented label="กรองตามสถานะ" options={options} value={filter} onChange={setFilter} />
      </div>
      <Card flush>
        {shown.length === 0 && <Empty>ไม่มีใบสั่งซ่อมในสถานะนี้</Empty>}
        {shown.map(({ v, wo }) => (
          <WorkOrderRow
            key={wo.id}
            vehicle={v}
            workOrder={wo}
            onStatusChange={(to) => dispatch({ type: 'setWorkOrderStatus', id: v.id, woId: wo.id, to })}
          />
        ))}
      </Card>
    </>
  )
}
