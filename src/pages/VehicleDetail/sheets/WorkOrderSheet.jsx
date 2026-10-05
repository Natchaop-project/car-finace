import { useState } from 'react'
import { Button, Field, Input, Sheet, SheetActions } from '../../../components/ui'
import { todayISO } from '../../../lib/calc'
import { thb } from '../../../lib/format'
import { APPROVAL_LIMIT } from '../../../lib/status'
import { uid } from '../../../lib/id'
import { useStore } from '../../../store'

function Form({ vehicle: v, onClose }) {
  const { dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [vendor, setVendor] = useState('อู่ในเต็นท์')
  const [budget, setBudget] = useState('')
  const amount = Number(budget)
  const needsApproval = amount > APPROVAL_LIMIT
  const valid = title.trim() && vendor.trim() && amount > 0

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    dispatch({
      type: 'addWorkOrder',
      id: v.id,
      workOrder: {
        id: uid(),
        title: title.trim(),
        vendor: vendor.trim(),
        budget: amount,
        status: needsApproval ? 'PENDING_APPROVAL' : 'APPROVED',
        items: [],
        createdAt: todayISO(),
      },
    })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="งานที่ต้องทำ">
        <Input autoFocus placeholder="เช่น เปลี่ยนผ้าเบรก ทำสีกันชน" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="อู่ / ร้าน">
        <Input value={vendor} onChange={(e) => setVendor(e.target.value)} />
      </Field>
      <Field
        label="งบประมาณ (บาท)"
        hint={needsApproval ? `เกิน ${thb(APPROVAL_LIMIT)} ต้องให้ผู้จัดการอนุมัติ` : 'อนุมัติอัตโนมัติ'}
      >
        <Input type="number" inputMode="numeric" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </Field>
      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!valid}>
          สร้างใบสั่งซ่อม
        </Button>
      </SheetActions>
    </form>
  )
}

export default function WorkOrderSheet({ open, vehicle, onClose }) {
  return (
    <Sheet open={open} title="สร้างใบสั่งซ่อม" onClose={onClose}>
      <Form vehicle={vehicle} onClose={onClose} />
    </Sheet>
  )
}
