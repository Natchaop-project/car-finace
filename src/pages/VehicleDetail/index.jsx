import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Empty, Icon, Segmented } from '../../components/ui'
import { useStore } from '../../store'
import LifecycleStepper from './LifecycleStepper'
import VehicleHero from './VehicleHero'
import AdvanceSheet from './sheets/AdvanceSheet'
import ClearAdvanceSheet from './sheets/ClearAdvanceSheet'
import ExpenseSheet from './sheets/ExpenseSheet'
import PriceSheet from './sheets/PriceSheet'
import StatusSheet from './sheets/StatusSheet'
import WorkOrderItemSheet from './sheets/WorkOrderItemSheet'
import WorkOrderSheet from './sheets/WorkOrderSheet'
import CostTab from './tabs/CostTab'
import ExpensesTab from './tabs/ExpensesTab'
import HistoryTab from './tabs/HistoryTab'
import OverviewTab from './tabs/OverviewTab'
import RepairsTab from './tabs/RepairsTab'

export default function VehicleDetail() {
  const { id } = useParams()
  const { vehicles, dispatch } = useStore()
  const [params, setParams] = useSearchParams()
  // sheet: null | { type: 'status', to } | { type: 'price' } | { type: 'workOrder' } | { type: 'item', woId }
  //        | { type: 'advance', woId } | { type: 'clear', woId, advanceId } | { type: 'expense' }
  const [sheet, setSheet] = useState(null)
  const closeSheet = () => setSheet(null)

  const v = vehicles.find((x) => x.id === id)
  if (!v) {
    return (
      <Empty>
        ไม่พบรถคันนี้ · <Link to="/vehicles">กลับไปสต็อกรถ</Link>
      </Empty>
    )
  }

  const tab = params.get('tab') ?? 'overview'
  const openTab = (t) => setParams(t === 'overview' ? {} : { tab: t }, { replace: true })

  const onTransition = (t) => {
    const needsInput = t.to === 'SOLD' || (t.to === 'READY_FOR_SALE' && !v.askingPrice)
    if (needsInput) setSheet({ type: 'status', to: t.to })
    else dispatch({ type: 'setStatus', id: v.id, to: t.to })
  }

  const tabs = [
    { value: 'overview', label: 'ภาพรวม' },
    { value: 'cost', label: 'ต้นทุนและกำไร' },
    { value: 'repairs', label: 'งานซ่อม', count: v.workOrders.length },
    { value: 'expenses', label: 'ค่าใช้จ่าย', count: v.expenses.length },
    { value: 'history', label: 'ประวัติ' },
  ]

  return (
    <>
      <Link to="/vehicles" className="mb-5 inline-flex items-center gap-1 text-sm">
        <Icon name="chevronLeft" size={16} />
        สต็อกรถ
      </Link>

      <VehicleHero vehicle={v} onTransition={onTransition} onEditPrice={() => setSheet({ type: 'price' })} />
      <LifecycleStepper status={v.status} />

      <div className="mt-12 mb-6">
        <Segmented label="ข้อมูลรถ" options={tabs} value={tab} onChange={openTab} />
      </div>

      {tab === 'overview' && <OverviewTab vehicle={v} onOpenTab={openTab} />}
      {tab === 'cost' && <CostTab vehicle={v} />}
      {tab === 'repairs' && (
        <RepairsTab
          vehicle={v}
          onNewWorkOrder={() => setSheet({ type: 'workOrder' })}
          onStatusChange={(woId, to) => dispatch({ type: 'setWorkOrderStatus', id: v.id, woId, to })}
          onAddItem={(woId) => setSheet({ type: 'item', woId })}
          onAddAdvance={(woId) => setSheet({ type: 'advance', woId })}
          onClearAdvance={(woId, advanceId) => setSheet({ type: 'clear', woId, advanceId })}
        />
      )}
      {tab === 'expenses' && <ExpensesTab vehicle={v} onAdd={() => setSheet({ type: 'expense' })} />}
      {tab === 'history' && <HistoryTab vehicle={v} />}

      <StatusSheet open={sheet?.type === 'status'} vehicle={v} to={sheet?.to} onClose={closeSheet} />
      <PriceSheet open={sheet?.type === 'price'} vehicle={v} onClose={closeSheet} />
      <WorkOrderSheet open={sheet?.type === 'workOrder'} vehicle={v} onClose={closeSheet} />
      <WorkOrderItemSheet open={sheet?.type === 'item'} vehicle={v} workOrderId={sheet?.woId} onClose={closeSheet} />
      <AdvanceSheet open={sheet?.type === 'advance'} vehicle={v} workOrderId={sheet?.woId} onClose={closeSheet} />
      <ClearAdvanceSheet
        open={sheet?.type === 'clear'}
        vehicle={v}
        workOrderId={sheet?.woId}
        advanceId={sheet?.advanceId}
        onClose={closeSheet}
      />
      <ExpenseSheet open={sheet?.type === 'expense'} vehicle={v} onClose={closeSheet} />
    </>
  )
}
