import Card from './Card'
import { cx } from './cx'

// Headline number. `tone` only tints the value for profit/loss.
export default function StatTile({ label, value, note, tone }) {
  return (
    <Card>
      <p className="text-[13px] font-medium text-ink-2">{label}</p>
      <p
        className={cx(
          'mt-1.5 text-[32px] leading-tight font-bold tracking-[-0.025em] tabular-nums max-sm:text-[26px]',
          tone === 'green' && 'text-tone-green',
          tone === 'red' && 'text-tone-red',
        )}
      >
        {value}
      </p>
      {note && <p className="mt-1.5 text-[13px] text-ink-3">{note}</p>}
    </Card>
  )
}
