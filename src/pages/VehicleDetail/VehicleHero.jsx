import { Button } from '../../components/ui'
import CarArt from '../../components/vehicle/CarArt'
import { StatusBadge } from '../../components/vehicle/StatusBadge'
import { isSold, price } from '../../lib/calc'
import { thb, vehicleName } from '../../lib/format'
import { TRANSITIONS } from '../../lib/status'

export default function VehicleHero({ vehicle: v, onTransition, onEditPrice }) {
  const actions = TRANSITIONS[v.status] ?? []
  const sold = isSold(v)

  return (
    <section className="grid grid-cols-[1.15fr_1fr] items-center gap-10 max-md:grid-cols-1 max-md:gap-6">
      <div className="grid aspect-[16/10] place-items-center rounded-panel bg-surface px-10 shadow-card max-sm:px-6">
        <CarArt body={v.body} color={v.color.hex} className="w-full" />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusBadge status={v.status} />
          <span className="text-[13px] text-ink-3">{v.stockNo}</span>
        </div>
        <h1 className="mt-3 text-[clamp(30px,4vw,44px)] leading-[1.1] font-bold tracking-[-0.025em]">
          {vehicleName(v)}
        </h1>
        <p className="mt-1.5 text-[17px] text-ink-2">
          {v.trim} · {v.year} · สี{v.color.name}
        </p>
        <p className="mt-0.5 text-sm text-ink-3">{v.plate}</p>

        <div className="mt-5">
          <p className="text-[13px] text-ink-2">{sold ? 'ราคาขายจริง' : 'ราคาตั้งขาย'}</p>
          <p className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums">
            {price(v) ? thb(price(v)) : <span className="text-xl text-ink-3">ยังไม่ตั้งราคา</span>}
          </p>
          {!sold && v.minPrice && <p className="text-[13px] text-ink-3">ราคาขั้นต่ำ {thb(v.minPrice)}</p>}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {actions.map((t) => (
            <Button key={t.to} variant={t.kind ?? 'primary'} onClick={() => onTransition(t)}>
              {t.label}
            </Button>
          ))}
          {!sold && (
            <Button variant="ghost" onClick={onEditPrice}>
              {v.askingPrice ? 'แก้ไขราคา' : 'ตั้งราคา'}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
