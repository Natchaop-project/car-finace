import { cx } from './cx'

const TONES = {
  gray: 'text-tone-gray bg-tone-gray-soft',
  blue: 'text-tone-blue bg-tone-blue-soft',
  orange: 'text-tone-orange bg-tone-orange-soft',
  green: 'text-tone-green bg-tone-green-soft',
  purple: 'text-tone-purple bg-tone-purple-soft',
  ink: 'text-tone-ink bg-tone-ink-soft',
  red: 'text-tone-red bg-tone-red-soft',
}

// Status pill: dot + label, so state is never conveyed by color alone.
export default function Badge({ tone = 'gray', className, children }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
