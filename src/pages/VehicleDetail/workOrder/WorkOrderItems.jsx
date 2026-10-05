import { Empty } from '../../../components/ui'
import { advanceForItem, itemTotal } from '../../../lib/calc'
import { num, thb } from '../../../lib/format'
import { ITEM_TYPES } from '../../../lib/status'

// How an item is being paid, when a cash advance covers it.
function PaidTag({ advance }) {
  if (!advance) return null
  return advance.status === 'PENDING_CLEAR' ? (
    <span className="ml-2 text-xs font-medium text-tone-orange">เบิกแล้ว · รอเคลียร์</span>
  ) : (
    <span className="ml-2 text-xs text-ink-3">จ่ายด้วยเงินทดรอง</span>
  )
}

export default function WorkOrderItems({ workOrder: wo }) {
  const { items } = wo
  if (items.length === 0) return <Empty>ยังไม่มีรายการ</Empty>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b border-line text-left text-[12.5px] text-ink-3">
            <th className="px-2.5 py-2 font-medium">ประเภท</th>
            <th className="px-2.5 py-2 font-medium">รายการ</th>
            <th className="px-2.5 py-2 text-right font-medium">จำนวน</th>
            <th className="px-2.5 py-2 text-right font-medium">ราคา/หน่วย</th>
            <th className="px-2.5 py-2 text-right font-medium">รวม</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-b border-line last:border-b-0">
              <td className="px-2.5 py-2.5 text-ink-2">{ITEM_TYPES[it.type]}</td>
              <td className="px-2.5 py-2.5">
                {it.name}
                <PaidTag advance={advanceForItem(wo, it.id)} />
              </td>
              <td className="px-2.5 py-2.5 text-right">{num(it.qty)}</td>
              <td className="px-2.5 py-2.5 text-right">{thb(it.unitCost)}</td>
              <td className="px-2.5 py-2.5 text-right font-medium">{thb(itemTotal(it))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
