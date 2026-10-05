import { useState } from 'react'
import { Button, Field, Input, Segmented, Select, Sheet, SheetActions } from '../../../components/ui'
import { advancesOf, itemTotal, todayISO } from '../../../lib/calc'
import { thb } from '../../../lib/format'
import { uid } from '../../../lib/id'
import { useStore } from '../../../store'

const MODES = [
  { value: 'item', label: 'รายการในใบสั่งซ่อม' },
  { value: 'extra', label: 'ของนอกรายการ' },
]

function Form({ vehicle: v, workOrder: wo, onClose }) {
  const { dispatch } = useStore()
  // Items not already being paid by another advance.
  const taken = new Set(advancesOf(wo).map((a) => a.itemId).filter(Boolean))
  const open = wo.items.filter((i) => !taken.has(i.id))

  const [mode, setMode] = useState(open.length ? 'item' : 'extra')
  const [itemId, setItemId] = useState(open[0]?.id ?? '')
  const [purpose, setPurpose] = useState('')
  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState(open[0] ? String(itemTotal(open[0])) : '')
  const [date, setDate] = useState(todayISO())

  const item = open.find((i) => i.id === itemId)
  const forItem = mode === 'item'
  const valid = payee.trim() && Number(amount) > 0 && date && (forItem ? item : purpose.trim())

  const pickItem = (id) => {
    setItemId(id)
    const it = open.find((i) => i.id === id)
    if (it) setAmount(String(itemTotal(it)))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    dispatch({
      type: 'addAdvance',
      id: v.id,
      woId: wo.id,
      advance: {
        id: uid(),
        payee: payee.trim(),
        purpose: forItem ? item.name : purpose.trim(),
        itemId: forItem ? item.id : null,
        amount: Number(amount),
        date,
        status: 'PENDING_CLEAR',
      },
    })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="rounded-xl bg-fill px-4 py-3 text-sm text-ink-2">
        เงินทดรองเป็นแค่การจ่ายเงินล่วงหน้า ไม่เพิ่มงบและไม่เพิ่มยอดใช้ไป
      </p>
      <Segmented label="เบิกไปซื้ออะไร" options={MODES} value={mode} onChange={setMode} />

      {forItem ? (
        open.length ? (
          <Field label="รายการ" hint={item && `ลงไว้ในใบสั่งซ่อม ${thb(itemTotal(item))}`}>
            <Select value={itemId} onChange={(e) => pickItem(e.target.value)}>
              {open.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · {thb(itemTotal(i))}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <p className="text-sm text-ink-3">ทุกรายการมีการเบิกเงินไว้แล้ว</p>
        )
      ) : (
        <Field label="ของที่จะซื้อ" hint="เมื่อเคลียร์ จะเพิ่มเป็นรายการใหม่และนับเป็นต้นทุน">
          <Input autoFocus placeholder="เช่น หลอดไฟหน้า" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </Field>
      )}

      <Field label="ผู้เบิก">
        <Input placeholder="เช่น นายเอก (ช่าง)" value={payee} onChange={(e) => setPayee(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <Field label="จำนวนเงินที่เบิก (บาท)">
          <Input type="number" inputMode="numeric" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="วันที่เบิก">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!valid}>
          บันทึกการเบิก
        </Button>
      </SheetActions>
    </form>
  )
}

export default function AdvanceSheet({ open, vehicle, workOrderId, onClose }) {
  const workOrder = vehicle.workOrders.find((w) => w.id === workOrderId)
  return (
    <Sheet open={open && !!workOrder} title="เบิกเงินทดรอง" onClose={onClose}>
      {workOrder && <Form vehicle={vehicle} workOrder={workOrder} onClose={onClose} />}
    </Sheet>
  )
}
