import Icon from './Icon'
import { inputCls } from './Input'
import { cx } from './cx'

export default function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cx(inputCls, 'appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <Icon
        name="chevronDown"
        size={16}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-3"
      />
    </div>
  )
}
