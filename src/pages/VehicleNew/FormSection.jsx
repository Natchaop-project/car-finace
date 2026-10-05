import { Card } from '../../components/ui'

// Titled card holding a two-column grid of fields.
export default function FormSection({ title, description, children }) {
  return (
    <Card>
      <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-ink-3">{description}</p>}
      <div className="mt-5 grid grid-cols-2 gap-4 max-sm:grid-cols-1">{children}</div>
    </Card>
  )
}
