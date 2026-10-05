import { useState } from 'react'
import { Button, Field, Input, Segmented, Sheet, SheetActions } from '../../../components/ui'
import { thb } from '../../../lib/format'
import { ITEM_TYPES } from '../../../lib/status'
import { uid } from '../../../lib/id'
import { useStore } from '../../../store'

const TYPE_OPTIONS = Object.entries(ITEM_TYPES).map(([value, label]) => ({ value, label }))

function Form({ vehicle: v, workOrderId, onClose }) {
  const { dispatch } = useStore()
  const [type, setType] = useState('part')
  const [name, setName] = useState('')
  const [qty, setQty] = useState('1')
  const [unitCost, setUnitCost] = useState('')
  const total = Number(qty) * Number(unitCost)
  const valid = name.trim() && Number(qty) > 0 && Number(unitCost) > 0

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    dispatch({
      type: 'addWorkOrderItem',
      id: v.id,
      woId: workOrderId,
      item: { id: uid(), type, name: name.trim(), qty: Number(qty), unitCost: Number(unitCost) },
    })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Segmented label="ประเภทรายการ" options={TYPE_OPTIONS} value={type} onChange={setType} />
      <Field label="รายการ">
        <Input autoFocus placeholder="เช่น ผ้าเบรกหน้า" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="จำนวน">
          <Input type="number" inputMode="numeric" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </Field>
        <Field label="ราคาต่อหน่วย (บาท)">
          <Input type="number" inputMode="numeric" min="0" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
        </Field>
      </div>
      <p className="text-right text-sm text-ink-2 tabular-nums">
        รวม <span className="text-lg font-semibold text-ink">{thb(valid ? total : 0)}</span>
      </p>
      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!valid}>
          เพิ่มรายการ
        </Button>
      </SheetActions>
    </form>
  )
}

export default function WorkOrderItemSheet({ open, vehicle, workOrderId, onClose }) {
  return (
    <Sheet open={open} title="เพิ่มรายการซ่อม" onClose={onClose}>
      <Form vehicle={vehicle} workOrderId={workOrderId} onClose={onClose} />
    </Sheet>
  )
}
