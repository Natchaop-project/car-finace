import { StatTile } from '../../components/ui'
import { pendingAdvanceTotal, pendingAdvances, sum, woCost } from '../../lib/calc'
import { thb } from '../../lib/format'

export default function WorkOrderSummary({ rows }) {
  const by = (s) => rows.filter((r) => r.wo.status === s)
  const open = rows.filter((r) => r.wo.status !== 'DONE')
  const advanceCount = sum(rows, (r) => pendingAdvances(r.wo).length)

  return (
    <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:gap-3">
      <StatTile label="รออนุมัติ" value={`${by('PENDING_APPROVAL').length} ใบ`} note={thb(sum(by('PENDING_APPROVAL'), (r) => r.wo.budget)) + ' ตามงบ'} />
      <StatTile label="กำลังดำเนินการ" value={`${by('APPROVED').length + by('IN_PROGRESS').length} ใบ`} note="อนุมัติแล้วและกำลังซ่อม" />
      <StatTile
        label="เงินทดรองรอเคลียร์"
        value={thb(sum(rows, (r) => pendingAdvanceTotal(r.wo)))}
        note={`${advanceCount} รายการ · ยังไม่นับเป็นต้นทุน`}
      />
      <StatTile label="ค่าซ่อมงานที่ยังเปิดอยู่" value={thb(sum(open, (r) => woCost(r.wo)))} note={`${open.length} ใบ`} />
    </div>
  )
}
