import { Icon, Input, Segmented, Select } from '../../components/ui'

const SORTS = {
  recent: 'เข้าล่าสุด',
  aging: 'ค้างนานสุด',
  priceHigh: 'ราคาสูง → ต่ำ',
  priceLow: 'ราคาต่ำ → สูง',
}

export default function InventoryToolbar({ query, onQuery, stage, onStage, stageOptions, sort, onSort }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative max-w-105 min-w-55 flex-1">
        <Icon name="search" size={17} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="ค้นหารุ่น ทะเบียน หรือ Stock No."
          aria-label="ค้นหารถ"
          className="h-10 rounded-full pl-10"
        />
      </div>
      <Segmented label="กรองตามสถานะ" options={stageOptions} value={stage} onChange={onStage} />
      <div className="flex-1" />
      <div className="w-42.5">
        <Select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="เรียงลำดับ" className="h-10 rounded-full">
          {Object.entries(SORTS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
