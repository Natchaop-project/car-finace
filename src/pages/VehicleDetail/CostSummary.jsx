import { cx } from '../../components/ui'
import { expenseCost, profit, price, reconCost, totalCost } from '../../lib/calc'
import { pct, thb } from '../../lib/format'

function Line({ label, value, strong, tone }) {
  return (
    <div
      className={cx(
        'flex justify-between gap-3 border-t border-line py-3 tabular-nums first:border-t-0',
        strong && 'text-[17px] font-bold',
      )}
    >
      <span className={strong ? '' : 'text-ink-2'}>{label}</span>
      <span className={cx(tone === 'green' && 'text-tone-green', tone === 'red' && 'text-tone-red')}>{value}</span>
    </div>
  )
}

// Compact cost → price → profit ladder for one vehicle.
export default function CostSummary({ vehicle: v }) {
  const p = profit(v)
  return (
    <div>
      <Line label="ราคาซื้อ" value={thb(v.purchasePrice)} />
      <Line label="ค่าซ่อม / อะไหล่" value={thb(reconCost(v))} />
      <Line label="ค่าใช้จ่ายอื่น" value={thb(expenseCost(v))} />
      <Line label="ต้นทุนรวม" value={thb(totalCost(v))} strong />
      <Line label={v.salePrice ? 'ราคาขายจริง' : 'ราคาตั้งขาย'} value={thb(price(v))} />
      <Line
        label={v.salePrice ? 'กำไรขั้นต้น' : 'กำไรคาดการณ์'}
        value={p == null ? '—' : `${thb(p)} · ${pct(p / price(v))}`}
        tone={p == null ? null : p >= 0 ? 'green' : 'red'}
        strong
      />
    </div>
  )
}
