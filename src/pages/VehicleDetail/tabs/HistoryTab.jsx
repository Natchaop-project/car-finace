import { Card } from '../../../components/ui'
import { date } from '../../../lib/format'
import { STATUS } from '../../../lib/status'

// Status change log, newest first.
export default function HistoryTab({ vehicle: v }) {
  const logs = [...v.logs].reverse()
  return (
    <Card>
      <ol className="pl-1">
        {logs.map((l, i) => (
          <li key={i} className="relative pb-5.5 pl-6.5 last:pb-0">
            {i < logs.length - 1 && <span className="absolute top-3 -bottom-0.5 left-1 w-0.5 bg-line" />}
            <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-accent" />
            <p className="font-medium">
              {l.from ? `${STATUS[l.from].label} → ${STATUS[l.to].label}` : `รับซื้อรถ (${STATUS[l.to].label})`}
            </p>
            <p className="text-[13px] text-ink-3">
              {date(l.at)} · โดย {l.by}
            </p>
          </li>
        ))}
      </ol>
    </Card>
  )
}
