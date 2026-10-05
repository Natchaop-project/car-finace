import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button, Empty, Icon, PageHeader } from '../../components/ui'
import { daysInStock, price } from '../../lib/calc'
import { STAGES } from '../../lib/status'
import { useStore } from '../../store'
import InventoryToolbar from './InventoryToolbar'
import VehicleCard from './VehicleCard'

const SORTERS = {
  recent: (a, b) => b.inDate.localeCompare(a.inDate),
  aging: (a, b) => daysInStock(b) - daysInStock(a),
  priceHigh: (a, b) => (price(b) ?? 0) - (price(a) ?? 0),
  priceLow: (a, b) => (price(a) ?? Infinity) - (price(b) ?? Infinity),
}

const matches = (v, q) =>
  [v.make, v.model, v.trim, v.plate, v.stockNo, String(v.year)].join(' ').toLowerCase().includes(q)

export default function Inventory() {
  const { vehicles } = useStore()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const stage = params.get('stage') ?? 'all'

  const stageOptions = [
    { value: 'all', label: 'ทั้งหมด', count: vehicles.length },
    ...STAGES.map((s) => ({
      value: s.key,
      label: s.label,
      count: vehicles.filter((v) => s.statuses.includes(v.status)).length,
    })),
  ]

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const statuses = STAGES.find((s) => s.key === stage)?.statuses
    return vehicles
      .filter((v) => !statuses || statuses.includes(v.status))
      .filter((v) => !q || matches(v, q))
      .sort(SORTERS[sort])
  }, [vehicles, stage, query, sort])

  const setStage = (value) => setParams(value === 'all' ? {} : { stage: value }, { replace: true })

  return (
    <>
      <PageHeader
        title="สต็อกรถ"
        subtitle={`${list.length} คัน`}
        actions={
          <Button to="/vehicles/new">
            <Icon name="plus" size={16} strokeWidth={2.2} />
            รับรถเข้า
          </Button>
        }
      />
      <InventoryToolbar
        query={query}
        onQuery={setQuery}
        stage={stage}
        onStage={setStage}
        stageOptions={stageOptions}
        sort={sort}
        onSort={setSort}
      />
      {list.length === 0 ? (
        <Empty>ไม่พบรถที่ตรงกับเงื่อนไข</Empty>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {list.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </>
  )
}
