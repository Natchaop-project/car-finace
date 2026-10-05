import { Button, Card, Empty, Icon, ListRow, SectionTitle } from '../../../components/ui'
import { expenseCost } from '../../../lib/calc'
import { date, thb } from '../../../lib/format'

export default function ExpensesTab({ vehicle: v, onAdd }) {
  return (
    <div>
      <SectionTitle
        action={
          <Button onClick={onAdd}>
            <Icon name="plus" size={16} strokeWidth={2.2} />
            เพิ่มค่าใช้จ่าย
          </Button>
        }
      >
        ค่าใช้จ่ายอื่น
      </SectionTitle>

      <Card flush>
        {v.expenses.length === 0 && <Empty>ยังไม่มีค่าใช้จ่าย</Empty>}
        {v.expenses.map((e) => (
          <ListRow
            key={e.id}
            leading={
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fill-strong text-ink-2">
                <Icon name="receipt" size={17} />
              </span>
            }
            title={e.category}
            subtitle={[e.note, date(e.date)].filter(Boolean).join(' · ')}
            trailing={thb(e.amount)}
          />
        ))}
        {v.expenses.length > 0 && (
          <ListRow title={<span className="font-bold">รวม</span>} trailing={<span className="font-bold">{thb(expenseCost(v))}</span>} />
        )}
      </Card>
    </div>
  )
}
