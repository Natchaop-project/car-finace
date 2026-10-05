import { useState } from 'react'
import { Button, Field, Input, Segmented, Sheet, SheetActions, cx } from '../../../components/ui'
import { itemTotal } from '../../../lib/calc'
import { thb } from '../../../lib/format'
import { ITEM_TYPES } from '../../../lib/status'
import { useStore } from '../../../store'

const TYPE_OPTIONS = Object.entries(ITEM_TYPES).map(([value, label]) => ({ value, label }))

function Note({ tone, children }) {
  return (
    <p
      className={cx(
        'rounded-xl px-4 py-3 text-sm font-medium tabular-nums',
        tone === 'green' && 'bg-tone-green-soft text-tone-green',
        tone === 'orange' && 'bg-tone-orange-soft text-tone-orange',
        !tone && 'bg-fill text-ink-2',
      )}
    >
      {children}
    </p>
  )
}

// Cash side: change returned to the shop or owed to the employee.
function CashNote({ change }) {
  if (change > 0) return <Note tone="green">พนักงานต้องคืนเงินทอน {thb(change)}</Note>
  if (change < 0) return <Note tone="orange">ต้องจ่ายเพิ่มให้พนักงาน {thb(-change)}</Note>
  return <Note>ใช้พอดีกับที่เบิก</Note>
}

// Cost side: how "used so far" on the work order moves.
function CostNote({ planned, spent }) {
  if (planned == null) return <Note>เพิ่มเป็นรายการใหม่ ยอดใช้ไปเพิ่ม {thb(spent)}</Note>
  const diff = spent - planned
  if (diff > 0) return <Note tone="orange">แพงกว่าที่ลงไว้ {thb(diff)} · ยอดใช้ไปเพิ่ม {thb(diff)}</Note>
  if (diff < 0) return <Note tone="green">ถูกกว่าที่ลงไว้ {thb(-diff)} · ยอดใช้ไปลดลง {thb(-diff)}</Note>
  return <Note>ตรงกับที่ลงไว้ · ยอดใช้ไปไม่เปลี่ยน</Note>
}

function Form({ vehicle: v, workOrder: wo, advance: a, onClose }) {
  const { dispatch } = useStore()
  const item = a.itemId ? wo.items.find((i) => i.id === a.itemId) : null
  const planned = item ? itemTotal(item) : null

  const [spent, setSpent] = useState(String(planned ?? a.amount))
  const [itemName, setItemName] = useState(a.purpose)
  const [itemType, setItemType] = useState('part')
  const [receiptNo, setReceiptNo] = useState('')

  const used = Number(spent)
  const filled = spent !== '' && used >= 0
  const valid = filled && (item || used === 0 || itemName.trim())

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    dispatch({
      type: 'clearAdvance',
      id: v.id,
      woId: wo.id,
      advanceId: a.id,
      clear: { spent: used, itemName: itemName.trim(), itemType, receiptNo: receiptNo.trim() },
    })
    onClose()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="rounded-xl bg-fill px-4 py-3 text-sm tabular-nums">
        <div className="flex justify-between">
          <span className="text-ink-2">{a.payee} เบิกไป</span>
          <span className="font-semibold">{thb(a.amount)}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-ink-2">{item ? `รายการ: ${item.name}` : `นอกรายการ: ${a.purpose}`}</span>
          {item && <span className="text-ink-2">ลงไว้ {thb(planned)}</span>}
        </div>
      </div>

      <Field label="ยอดตามใบเสร็จ (บาท)">
        <Input type="number" inputMode="numeric" min="0" autoFocus value={spent} onChange={(e) => setSpent(e.target.value)} />
      </Field>

      {!item && (
        <>
          <Field label="ชื่อรายการ">
            <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
          </Field>
          <Segmented label="ประเภทรายการ" options={TYPE_OPTIONS} value={itemType} onChange={setItemType} />
        </>
      )}

      <Field label="เลขที่ใบเสร็จ">
        <Input placeholder="ไม่บังคับ" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} />
      </Field>

      {filled && (
        <div className="flex flex-col gap-2">
          <CashNote change={a.amount - used} />
          {used > 0 && <CostNote planned={planned} spent={used} />}
        </div>
      )}

      <SheetActions>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!valid}>
          เคลียร์เงินทดรอง
        </Button>
      </SheetActions>
    </form>
  )
}

export default function ClearAdvanceSheet({ open, vehicle, workOrderId, advanceId, onClose }) {
  const workOrder = vehicle.workOrders.find((w) => w.id === workOrderId)
  const advance = workOrder?.advances?.find((x) => x.id === advanceId)
  return (
    <Sheet open={open && !!advance} title="เคลียร์เงินทดรอง" onClose={onClose}>
      {advance && <Form vehicle={vehicle} workOrder={workOrder} advance={advance} onClose={onClose} />}
    </Sheet>
  )
}
