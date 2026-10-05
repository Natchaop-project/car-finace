import { Link } from 'react-router'
import { cx } from './cx'

const BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap cursor-pointer transition ' +
  'active:scale-[.97] disabled:pointer-events-none disabled:opacity-40 hover:no-underline ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30'

const SIZES = {
  sm: 'h-7.5 px-3.5 text-[13px]',
  md: 'h-9 px-4.5 text-sm',
  lg: 'h-11 px-6 text-base',
}

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-fill-strong text-ink hover:bg-line',
  ghost: 'bg-transparent text-link hover:bg-fill',
}

// Pill button. Pass `to` to render a router link styled as a button.
export default function Button({ variant = 'primary', size = 'md', to, className, children, ...props }) {
  const cls = cx(BASE, SIZES[size], VARIANTS[variant], className)
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
