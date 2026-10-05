import { Link } from 'react-router'
import { cx } from './cx'

// One row of a grouped list card: leading visual, title/subtitle, trailing content.
export default function ListRow({ to, leading, title, subtitle, trailing, className }) {
  const cls = cx(
    'flex items-center gap-3.5 border-t border-line px-5 py-3 text-ink first:border-t-0 max-sm:px-4',
    to && 'transition hover:bg-fill hover:no-underline',
    className,
  )
  const body = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        {subtitle && <p className="truncate text-[13px] text-ink-2">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0 text-right tabular-nums">{trailing}</div>}
    </>
  )
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}
