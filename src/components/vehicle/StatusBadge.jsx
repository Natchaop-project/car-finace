import { Badge } from '../ui'
import { STATUS, WO_STATUS } from '../../lib/status'

export function StatusBadge({ status, className }) {
  const s = STATUS[status] ?? { label: status, tone: 'gray' }
  return (
    <Badge tone={s.tone} className={className}>
      {s.label}
    </Badge>
  )
}

export function WorkOrderBadge({ status }) {
  const s = WO_STATUS[status]
  return <Badge tone={s.tone}>{s.label}</Badge>
}
