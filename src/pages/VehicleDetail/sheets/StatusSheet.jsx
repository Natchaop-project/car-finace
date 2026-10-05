import { useState } from 'react'
import { Button, Field, Input, Sheet, SheetActions } from '../../../components/ui'
import { STATUS } from '../../../lib/status'
import { thb, toNum } from '../../../lib/format'
import { useStore } from '../../../store'

// Status changes that need extra data: SOLD needs the sale price,
// READY_FOR_SALE needs an asking price when none was set.
function Form({ vehicle: v, to, onClose }) {
  const { dispatch } = useStore()
  const selling = to === 'SOLD'
  const [salePrice, setSalePrice] = useState(String(v.askingPrice ?? ''))
  const [askingPrice, setAskingPrice] = useState(String(v.askingPrice ?? ''))
  const [minPrice, setMinPrice] = useState(String(v.minPrice ?? ''))

  const valid = selling ? toNum(salePrice) > 0 : toNum(askingPrice) > 0
  const belowMin = selling && v.minPrice && toNum(salePrice) < v.minPrice

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const patch = selling
      ? { salePrice: toNum(salePrice) }
      : { askingPrice: toNum(askingPrice), minPrice: toNum(minPrice) }
    dispatch({ type: 'setStatus', id: v.id, to, patch })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {selling ? (
        <Field
          label="ราคาขายจริง (บาท)"
          hint={belowMin ? `ต่ำกว่าราคาขั้นต่ำ ${thb(v.minPrice)}` : `ราคาตั้งขาย ${thb(v.askingPrice)}`}
        >
          <Input type="number" inputMode="numeric" min="0" autoFocus value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </Field>
      ) : (
        <>
          <Field label="ราคาตั้งขาย (บาท)">
            <Input type="number" inputMode="numeric" min="0" autoFocus value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} />
          </Field>
          <Field label="ราคาขั้นต่ำ (บาท)" hint="เซลล์ลดราคาได้ไม่ต่ำกว่านี้">
            <Input type="number" inputMode="numeric" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </Field>
        </>
      )}
      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!valid}>
          ยืนยัน
        </Button>
      </SheetActions>
    </form>
  )
}

export default function StatusSheet({ open, vehicle, to, onClose }) {
  return (
    <Sheet open={open} title={to ? `เปลี่ยนเป็น “${STATUS[to].label}”` : ''} onClose={onClose}>
      <Form vehicle={vehicle} to={to} onClose={onClose} />
    </Sheet>
  )
}
