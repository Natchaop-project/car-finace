import { Icon, cx } from '../../components/ui'
import { STEPS } from '../../lib/status'

export default function LifecycleStepper({ status }) {
  const current = STEPS.findIndex((s) => s.statuses.includes(status))
  const finished = status === 'TRANSFERRED'

  return (
    <ol className="mt-10 flex overflow-x-auto rounded-card bg-surface px-3 py-5.5 shadow-card" aria-label="ขั้นตอนของรถ">
      {STEPS.map((step, i) => {
        const done = i < current || finished
        const isCurrent = i === current && !finished
        return (
          <li
            key={step.label}
            aria-current={isCurrent ? 'step' : undefined}
            className={cx(
              'relative flex min-w-21.5 flex-1 flex-col items-center gap-2 text-center text-[12.5px]',
              done ? 'text-ink-2' : isCurrent ? 'font-semibold text-ink' : 'text-ink-3',
            )}
          >
            {i > 0 && (
              <span
                className={cx(
                  'absolute top-2.75 right-[calc(50%+14px)] left-[calc(-50%+14px)] h-0.5',
                  done || isCurrent ? 'bg-accent' : 'bg-line',
                )}
              />
            )}
            <span
              className={cx(
                'z-1 grid size-6 place-items-center rounded-full border-2',
                done && 'border-accent bg-accent text-white',
                isCurrent && 'border-accent bg-surface ring-5 ring-accent/15',
                !done && !isCurrent && 'border-line bg-surface',
              )}
            >
              {done && <Icon name="check" size={13} strokeWidth={3} />}
              {isCurrent && <span className="size-2 rounded-full bg-accent" />}
            </span>
            {step.label}
          </li>
        )
      })}
    </ol>
  )
}
