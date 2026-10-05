import { cx } from './cx'

export const inputCls =
  'w-full h-11 px-3.5 rounded-xl border border-line bg-surface text-[15px] text-ink outline-none transition ' +
  'placeholder:text-ink-3 focus:border-accent focus:ring-4 focus:ring-accent/15'

export default function Input({ className, ...props }) {
  return <input className={cx(inputCls, className)} {...props} />
}
