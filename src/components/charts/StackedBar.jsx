import { useState } from 'react'
import { Link } from 'react-router'

// Single horizontal 100% bar with a legend that doubles as direct labels.
// segments: [{ key, label, value, color, display?, to? }]
export default function StackedBar({ segments, formatValue = String, ariaLabel }) {
  const [tip, setTip] = useState(null)
  const total = segments.reduce((s, x) => s + x.value, 0)
  const visible = segments.filter((s) => s.value > 0)

  return (
    <div>
      <div
        role="img"
        aria-label={ariaLabel}
        className="group flex h-3.5 gap-0.5 overflow-hidden rounded-full bg-fill"
        onMouseLeave={() => setTip(null)}
      >
        {visible.map((s) => (
          <div
            key={s.key}
            className="h-full transition-opacity group-hover:opacity-50 hover:!opacity-100"
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            onMouseMove={(e) =>
              setTip({
                x: e.clientX,
                y: e.clientY,
                text: `${s.label}: ${s.display ?? formatValue(s.value)} (${Math.round((s.value / total) * 100)}%)`,
              })
            }
          />
        ))}
      </div>

      <div className="mt-4.5 flex flex-wrap gap-x-7 gap-y-3">
        {segments.map((s) => {
          const inner = (
            <>
              <span className="flex items-center gap-2 text-[13px] text-ink-2">
                <i className="inline-block size-2.5 rounded-[3px]" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="text-[22px] font-semibold tracking-[-0.01em] text-ink tabular-nums">
                {s.display ?? formatValue(s.value)}
              </span>
            </>
          )
          return s.to ? (
            <Link key={s.key} to={s.to} className="flex flex-col gap-0.5 rounded-lg hover:no-underline hover:opacity-80">
              {inner}
            </Link>
          ) : (
            <div key={s.key} className="flex flex-col gap-0.5">
              {inner}
            </div>
          )
        })}
      </div>

      {tip && (
        <div
          className="pointer-events-none fixed z-100 rounded-[10px] bg-surface px-3 py-2 text-[13px] whitespace-nowrap text-ink shadow-[0_6px_24px_rgba(0,0,0,0.16)]"
          style={{ left: tip.x + 12, top: tip.y - 40 }}
        >
          {tip.text}
        </div>
      )}
    </div>
  )
}
