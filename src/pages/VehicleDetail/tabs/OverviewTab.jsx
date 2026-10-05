import { Button, Card, Empty, ListRow } from '../../../components/ui'
import { WorkOrderBadge } from '../../../components/vehicle/StatusBadge'
import { daysInStock, woCost } from '../../../lib/calc'
import { date, num, thb } from '../../../lib/format'
import CostSummary from '../CostSummary'

export default function OverviewTab({ vehicle: v, onOpenTab }) {
  const specs = [
    ['เลขตัวถัง (VIN)', v.vin],
    ['ทะเบียน', v.plate],
    ['เลขไมล์', `${num(v.mileage)} กม.`],
    ['เกียร์', v.gear],
    ['เชื้อเพลิง', v.fuel],
    ['สี', v.color.name],
    ['แหล่งที่มา', v.source],
    ['ผู้ขาย', v.seller],
    ['วันที่รับเข้า', date(v.inDate)],
    ['อายุสต็อก', `${daysInStock(v)} วัน`],
  ]

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <dl className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-7 gap-y-5.5">
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[12.5px] text-ink-3">{label}</dt>
              <dd className="mt-0.5 text-base font-medium break-words">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[17px] font-semibold">สรุปต้นทุน</h3>
            <Button variant="ghost" size="sm" onClick={() => onOpenTab('cost')}>
              รายละเอียด
            </Button>
          </div>
          <CostSummary vehicle={v} />
        </Card>

        <Card flush>
          <div className="flex items-center justify-between px-6 pt-4 pb-2 max-sm:px-5">
            <h3 className="text-[17px] font-semibold">งานซ่อม</h3>
            <Button variant="ghost" size="sm" onClick={() => onOpenTab('repairs')}>
              ดูทั้งหมด
            </Button>
          </div>
          {v.workOrders.length === 0 && <Empty>ยังไม่มีใบสั่งซ่อม</Empty>}
          {v.workOrders.map((w) => (
            <ListRow
              key={w.id}
              title={w.title}
              subtitle={`${w.vendor} · ${thb(woCost(w))}`}
              trailing={<WorkOrderBadge status={w.status} />}
              className="px-6"
            />
          ))}
        </Card>
      </div>
    </div>
  )
}
