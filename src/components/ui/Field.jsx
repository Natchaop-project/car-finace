import { cx } from './cx'

// Label + control + optional hint.
export default function Field({ label, hint, className, children }) {
  return (
    <label className={cx('flex flex-col gap-1.5', className)}>
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-3">{hint}</span>}
    </label>
  )
}
