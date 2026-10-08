import { useLayoutEffect } from 'react'
import CarArt from '../../components/vehicle/CarArt'
import { StatusBadge } from '../../components/vehicle/StatusBadge'
import { daysInStock, price, totalCost } from '../../lib/calc'
import { thb, vehicleName } from '../../lib/format'
import { TOOLTIP_W, placeTooltip } from './placeTooltip'

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-2">{label}</dt>
      <dd className="font-medium tabular-nums">{children}</dd>
    </div>
  )
}

export default function CarTooltip({ vehicle: v, touch, elRef, pointer }) {
  useLayoutEffect(() => {
    placeTooltip(elRef.current, pointer.current)
  }, [elRef, pointer, v.id])
  const openRepairs = v.workOrders.filter((w) => w.status !== 'DONE').length

  return (
    <div
      ref={elRef}
      role="tooltip"
      className="pointer-events-none fixed z-60 animate-fade rounded-card border border-line bg-surface p-4 text-[13px] text-ink shadow-lift"
      style={{ width: TOOLTIP_W }}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">{vehicleName(v)}</div>
          <div className="truncate text-xs text-ink-2">
            {v.year} · {v.trim}
          </div>
          <div className="mt-1.5">
            <StatusBadge status={v.status} />
          </div>
        </div>
        <CarArt body={v.body} color={v.color?.hex} className="h-11 w-24 shrink-0" />
      </div>
      <dl className="mt-3 space-y-1 border-t border-line pt-3">
        <Row label="ราคาขาย">{thb(price(v))}</Row>
        <Row label="ต้นทุนรวม">{thb(totalCost(v))}</Row>
        <Row label="อยู่ในสต็อก">{daysInStock(v)} วัน</Row>
        <Row label="เลขสต็อก">{v.stockNo}</Row>
        {openRepairs > 0 && <Row label="งานซ่อมค้าง">{openRepairs} ใบ</Row>}
      </dl>
      <div className="mt-3 text-xs text-ink-3">{touch ? 'แตะอีกครั้งเพื่อดูรายละเอียด' : 'คลิกเพื่อดูรายละเอียด'}</div>
    </div>
  )
}
