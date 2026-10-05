import { cx } from '../../../components/ui'
import { thb } from '../../../lib/format'

// Spent vs. budget for one work order.
export default function BudgetBar({ spent, budget }) {
  const over = spent > budget
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[13px] tabular-nums">
        <span className="text-ink-2">
          ใช้ไป <span className={cx('font-semibold', over ? 'text-tone-red' : 'text-ink')}>{thb(spent)}</span> จากงบ{' '}
          {thb(budget)}
        </span>
        {over && <span className="font-semibold text-tone-red">เกินงบ {thb(spent - budget)}</span>}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-fill-strong">
        <div
          className={cx('h-full rounded-full transition-[width] duration-500', over ? 'bg-tone-red' : 'bg-accent')}
          style={{ width: `${Math.min(100, (spent / budget) * 100)}%` }}
        />
      </div>
    </div>
  )
}
