export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow && <p className="mb-1.5 text-sm font-semibold text-ink-2">{eyebrow}</p>}
        <h1 className="text-[clamp(34px,5vw,48px)] leading-[1.1] font-bold tracking-[-0.025em]">{title}</h1>
        {subtitle && <p className="mt-2 text-[19px] tracking-[-0.01em] text-ink-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  )
}
