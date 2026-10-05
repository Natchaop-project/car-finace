import { useState } from 'react'
import { Button, Field, Input, Sheet, SheetActions } from '../../../components/ui'
import { totalCost } from '../../../lib/calc'
import { pct, thb, toNum } from '../../../lib/format'
import { useStore } from '../../../store'

function Form({ vehicle: v, onClose }) {
  const { dispatch } = useStore()
  const [asking, setAsking] = useState(String(v.askingPrice ?? ''))
  const [min, setMin] = useState(String(v.minPrice ?? ''))
  const cost = totalCost(v)
  const margin = toNum(asking) > 0 ? (toNum(asking) - cost) / toNum(asking) : null

  const submit = (e) => {
    e.preventDefault()
    dispatch({ type: 'updateVehicle', id: v.id, patch: { askingPrice: toNum(asking), minPrice: toNum(min) } })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="rounded-xl bg-fill px-4 py-3 text-sm text-ink-2">
        ต้นทุนรวมตอนนี้ <span className="font-semibold text-ink tabular-nums">{thb(cost)}</span>
        {margin != null && <> · อัตรากำไร {pct(margin)}</>}
      </p>
      <Field label="ราคาตั้งขาย (บาท)">
        <Input type="number" inputMode="numeric" min="0" autoFocus value={asking} onChange={(e) => setAsking(e.target.value)} />
      </Field>
      <Field label="ราคาขั้นต่ำ (บาท)" hint="เซลล์ลดราคาได้ไม่ต่ำกว่านี้">
        <Input type="number" inputMode="numeric" min="0" value={min} onChange={(e) => setMin(e.target.value)} />
      </Field>
      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit">บันทึก</Button>
      </SheetActions>
    </form>
  )
}

export default function PriceSheet({ open, vehicle, onClose }) {
  return (
    <Sheet open={open} title="ตั้งราคาขาย" onClose={onClose}>
      <Form vehicle={vehicle} onClose={onClose} />
    </Sheet>
  )
}
