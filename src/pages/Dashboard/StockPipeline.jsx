import StackedBar from '../../components/charts/StackedBar'
import { Card } from '../../components/ui'
import { STAGES } from '../../lib/status'

// How many cars sit in each stage of the lifecycle.
export default function StockPipeline({ vehicles }) {
  const segments = STAGES.map((s) => ({
    key: s.key,
    label: s.label,
    color: s.color,
    value: vehicles.filter((v) => s.statuses.includes(v.status)).length,
    to: `/vehicles?stage=${s.key}`,
  }))

  return (
    <Card>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-semibold">รถตามสถานะ</h3>
        <span className="text-[13px] text-ink-3">ทั้งหมด {vehicles.length} คัน</span>
      </div>
      <StackedBar
        segments={segments}
        formatValue={(n) => `${n} คัน`}
        ariaLabel={segments.map((s) => `${s.label} ${s.value} คัน`).join(', ')}
      />
    </Card>
  )
}
