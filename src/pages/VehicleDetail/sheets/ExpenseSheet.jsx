import { useState } from 'react'
import { Button, Field, Input, Select, Sheet, SheetActions } from '../../../components/ui'
import { todayISO } from '../../../lib/calc'
import { EXPENSE_CATEGORIES } from '../../../lib/status'
import { uid } from '../../../lib/id'
import { useStore } from '../../../store'

function Form({ vehicle: v, onClose }) {
  const { dispatch } = useStore()
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const valid = Number(amount) > 0 && date

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    dispatch({
      type: 'addExpense',
      id: v.id,
      expense: { id: uid(), category, amount: Number(amount), date, note: note.trim() },
    })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="หมวด">
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <Field label="จำนวนเงิน (บาท)">
          <Input type="number" inputMode="numeric" min="0" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="วันที่">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <Field label="หมายเหตุ">
        <Input placeholder="ไม่บังคับ" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!valid}>
          บันทึก
        </Button>
      </SheetActions>
    </form>
  )
}

export default function ExpenseSheet({ open, vehicle, onClose }) {
  return (
    <Sheet open={open} title="เพิ่มค่าใช้จ่าย" onClose={onClose}>
      <Form vehicle={vehicle} onClose={onClose} />
    </Sheet>
  )
}
