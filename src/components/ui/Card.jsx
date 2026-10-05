import { cx } from './cx'

// `flush` drops side padding for edge-to-edge list rows.
export default function Card({ flush, className, children, ...props }) {
  return (
    <div
      className={cx('rounded-card bg-surface shadow-card', flush ? 'py-2' : 'p-6 max-sm:p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
