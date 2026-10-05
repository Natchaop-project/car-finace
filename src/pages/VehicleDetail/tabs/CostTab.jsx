import StackedBar from '../../../components/charts/StackedBar'
import { Card, StatTile } from '../../../components/ui'
import { COUNTED_WO, expenseCost, price, profit, reconCost, totalCost, woCost } from '../../../lib/calc'
import { date, pct, thb } from '../../../lib/format'

export default function CostTab({ vehicle: v }) {
  const p = profit(v)
  const pending = v.workOrders.filter((w) => !COUNTED_WO.includes(w.status))
  const lines = [
    { label: 'ราคาซื้อ', sub: `${v.source} · ${date(v.inDate)}`, amount: v.purchasePrice },
    ...v.workOrders
      .filter((w) => COUNTED_WO.includes(w.status))
      .map((w) => ({ label: `งานซ่อม: ${w.title}`, sub: w.vendor, amount: woCost(w) })),
    ...v.expenses.map((e) => ({ label: e.category, sub: [e.note, date(e.date)].filter(Boolean).join(' · '), amount: e.amount })),
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <StatTile label="ต้นทุนรวม" value={thb(totalCost(v))} />
        <StatTile label={v.salePrice ? 'ราคาขายจริง' : 'ราคาตั้งขาย'} value={thb(price(v))} />
        <StatTile
          label={v.salePrice ? 'กำไรขั้นต้น' : 'กำไรคาดการณ์'}
          value={thb(p)}
          tone={p == null ? null : p >= 0 ? 'green' : 'red'}
          note={p == null ? 'ตั้งราคาเพื่อดูกำไร' : `อัตรากำไร ${pct(p / price(v))}`}
        />
      </div>

      <Card>
        <h3 className="mb-5 text-[17px] font-semibold">โครงสร้างต้นทุน</h3>
        <StackedBar
          formatValue={thb}
          ariaLabel="สัดส่วนต้นทุน"
          segments={[
            { key: 'buy', label: 'ราคาซื้อ', value: v.purchasePrice, color: 'var(--series-1)' },
            { key: 'recon', label: 'ซ่อม / อะไหล่', value: reconCost(v), color: 'var(--series-2)' },
            { key: 'exp', label: 'ค่าใช้จ่ายอื่น', value: expenseCost(v), color: 'var(--series-3)' },
          ]}
        />
      </Card>

      <Card>
        <h3 className="mb-2 text-[17px] font-semibold">รายการต้นทุน</h3>
        {lines.map((l, i) => (
          <div key={i} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
            <div className="min-w-0">
              <p className="truncate">{l.label}</p>
              <p className="truncate text-[13px] text-ink-3">{l.sub}</p>
            </div>
            <span className="tabular-nums">{thb(l.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-line pt-3 text-[17px] font-bold tabular-nums">
          <span>ต้นทุนรวม</span>
          <span>{thb(totalCost(v))}</span>
        </div>
        {pending.length > 0 && (
          <p className="mt-3 text-[13px] text-tone-orange">
            ยังไม่รวมงานซ่อมที่รออนุมัติ {thb(pending.reduce((s, w) => s + woCost(w), 0))}
          </p>
        )}
      </Card>
    </div>
  )
}
