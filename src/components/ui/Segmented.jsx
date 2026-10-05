import { cx } from './cx'

// iOS-style segmented control. options: [{ value, label, count? }]
export default function Segmented({ options, value, onChange, label }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[10px] bg-fill-strong p-[3px] [scrollbar-width:none]"
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              'cursor-pointer rounded-lg px-3.5 py-1.5 text-[13.5px] whitespace-nowrap text-ink transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              on ? 'bg-seg-on font-medium shadow-[0_1px_4px_rgba(0,0,0,0.12)]' : 'hover:bg-fill',
            )}
          >
            {o.label}
            {o.count != null && <span className="ml-1 text-xs text-ink-3">{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
