import { Button, Icon, PageHeader, SectionTitle } from '../../components/ui'
import { longDate } from '../../lib/format'
import { useStore } from '../../store'
import AgingList from './AgingList'
import KpiRow from './KpiRow'
import RepairQueue from './RepairQueue'
import StockPipeline from './StockPipeline'

export default function Dashboard() {
  const { vehicles } = useStore()

  return (
    <>
      <PageHeader
        eyebrow={longDate()}
        title="ภาพรวมเต็นท์รถ"
        subtitle="ทุกคัน ทุกต้นทุน ในที่เดียว"
        actions={
          <Button to="/vehicles/new" size="lg">
            <Icon name="plus" size={18} strokeWidth={2.2} />
            รับรถเข้า
          </Button>
        }
      />

      <KpiRow vehicles={vehicles} />

      <section className="mt-5">
        <StockPipeline vehicles={vehicles} />
      </section>

      <div className="mt-12 grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <section>
          <SectionTitle action={<Button to="/vehicles" variant="ghost" size="sm">ดูทั้งหมด</Button>}>
            ค้างสต็อกนานที่สุด
          </SectionTitle>
          <AgingList vehicles={vehicles} />
        </section>
        <section>
          <SectionTitle action={<Button to="/work-orders" variant="ghost" size="sm">ดูทั้งหมด</Button>}>
            งานซ่อมที่ต้องดูแล
          </SectionTitle>
          <RepairQueue vehicles={vehicles} />
        </section>
      </div>
    </>
  )
}
