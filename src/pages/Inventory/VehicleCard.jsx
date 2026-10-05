import { Link } from 'react-router'
import { cx } from '../../components/ui'
import CarArt from '../../components/vehicle/CarArt'
import { StatusBadge } from '../../components/vehicle/StatusBadge'
import { AGING_DAYS, daysInStock, isActive, price } from '../../lib/calc'
import { num, thb, vehicleName } from '../../lib/format'

export default function VehicleCard({ vehicle: v }) {
  const days = daysInStock(v)
  const aging = isActive(v) && days > AGING_DAYS

  return (
    <Link
      to={`/vehicles/${v.id}`}
      className="flex flex-col overflow-hidden rounded-panel bg-surface text-ink shadow-card transition duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 hover:no-underline hover:shadow-lift"
    >
      <div className="relative grid aspect-[16/10] place-items-center bg-surface-2 px-6">
        <StatusBadge status={v.status} className="absolute top-3.5 left-3.5" />
        <CarArt body={v.body} color={v.color.hex} className="w-full max-w-70" />
      </div>
      <div className="flex flex-col gap-1 px-5.5 pt-4.5 pb-5.5">
        <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{vehicleName(v)}</h3>
        <p className="text-[13.5px] text-ink-2">
          {v.trim} · {v.year}
        </p>
        <p className="mt-2.5 text-[21px] font-semibold tracking-[-0.01em] tabular-nums">
          {price(v) ? thb(price(v)) : <span className="text-base font-medium text-ink-3">ยังไม่ตั้งราคา</span>}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-3.5 text-[12.5px] text-ink-3">
          <span>{num(v.mileage)} กม.</span>
          <span>{v.gear}</span>
          <span>{v.fuel}</span>
          <span className={cx(aging && 'font-semibold text-tone-orange')}>
            {isActive(v) ? `ในสต็อก ${days} วัน` : v.stockNo}
          </span>
        </div>
      </div>
    </Link>
  )
}
