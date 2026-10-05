import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button, Field, Icon, Input, PageHeader, Select } from '../../components/ui'
import { todayISO } from '../../lib/calc'
import { uid } from '../../lib/id'
import { useStore } from '../../store'
import AppearancePicker from './AppearancePicker'
import FormSection from './FormSection'
import { COLORS, FUELS, GEARS, SOURCES } from './options'

const YEAR = new Date().getFullYear()

const EMPTY = {
  make: '',
  model: '',
  trim: '',
  year: String(YEAR - 3),
  body: 'sedan',
  color: COLORS[0],
  plate: '',
  vin: '',
  mileage: '',
  gear: GEARS[0],
  fuel: FUELS[0],
  source: SOURCES[0],
  seller: '',
  purchasePrice: '',
  inDate: todayISO(),
}

function nextStockNo(vehicles) {
  const max = Math.max(0, ...vehicles.map((v) => Number(v.stockNo.split('-').pop()) || 0))
  return `STK-${YEAR}-${String(max + 1).padStart(4, '0')}`
}

export default function VehicleNew() {
  const { vehicles, dispatch } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }))

  const valid = form.make.trim() && form.model.trim() && Number(form.year) > 1980 && Number(form.purchasePrice) > 0

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const id = uid()
    const now = new Date().toISOString()
    dispatch({
      type: 'addVehicle',
      vehicle: {
        ...form,
        id,
        stockNo: nextStockNo(vehicles),
        make: form.make.trim(),
        model: form.model.trim(),
        trim: form.trim.trim(),
        year: Number(form.year),
        mileage: Number(form.mileage) || 0,
        purchasePrice: Number(form.purchasePrice),
        askingPrice: null,
        minPrice: null,
        salePrice: null,
        soldAt: null,
        status: 'IN_STOCK',
        workOrders: [],
        expenses: [],
        logs: [
          { from: null, to: 'PURCHASED', at: now, by: 'คุณ' },
          { from: 'PURCHASED', to: 'IN_STOCK', at: now, by: 'คุณ' },
        ],
      },
    })
    navigate(`/vehicles/${id}`)
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-190">
      <Link to="/vehicles" className="mb-5 inline-flex items-center gap-1 text-sm">
        <Icon name="chevronLeft" size={16} />
        สต็อกรถ
      </Link>
      <PageHeader title="รับรถเข้าสต็อก" subtitle="กรอกข้อมูลรถและการรับซื้อ ระบบจะออก Stock No. ให้อัตโนมัติ" />

      <div className="flex flex-col gap-5">
        <AppearancePicker body={form.body} color={form.color} onBody={set('body')} onColor={set('color')} />

        <FormSection title="ข้อมูลรถ">
          <Field label="ยี่ห้อ *">
            <Input autoFocus placeholder="Toyota" value={form.make} onChange={set('make')} />
          </Field>
          <Field label="รุ่น *">
            <Input placeholder="Camry" value={form.model} onChange={set('model')} />
          </Field>
          <Field label="รุ่นย่อย">
            <Input placeholder="2.5 HEV Premium" value={form.trim} onChange={set('trim')} />
          </Field>
          <Field label="ปี *">
            <Input type="number" inputMode="numeric" min="1980" max={YEAR + 1} value={form.year} onChange={set('year')} />
          </Field>
          <Field label="ทะเบียน">
            <Input placeholder="1กข 1234 กรุงเทพมหานคร" value={form.plate} onChange={set('plate')} />
          </Field>
          <Field label="เลขตัวถัง (VIN)">
            <Input value={form.vin} onChange={set('vin')} />
          </Field>
          <Field label="เลขไมล์ (กม.)">
            <Input type="number" inputMode="numeric" min="0" value={form.mileage} onChange={set('mileage')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="เกียร์">
              <Select value={form.gear} onChange={set('gear')}>
                {GEARS.map((g) => <option key={g}>{g}</option>)}
              </Select>
            </Field>
            <Field label="เชื้อเพลิง">
              <Select value={form.fuel} onChange={set('fuel')}>
                {FUELS.map((g) => <option key={g}>{g}</option>)}
              </Select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="การรับซื้อ" description="ราคาซื้อคือจุดเริ่มต้นของต้นทุนรถคันนี้">
          <Field label="แหล่งที่มา">
            <Select value={form.source} onChange={set('source')}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="ผู้ขาย">
            <Input placeholder="ชื่อลูกค้าหรือบริษัท" value={form.seller} onChange={set('seller')} />
          </Field>
          <Field label="ราคาซื้อ (บาท) *">
            <Input type="number" inputMode="numeric" min="0" value={form.purchasePrice} onChange={set('purchasePrice')} />
          </Field>
          <Field label="วันที่รับเข้า">
            <Input type="date" value={form.inDate} onChange={set('inDate')} />
          </Field>
        </FormSection>
      </div>

      <div className="mt-8 flex justify-end gap-2.5">
        <Button variant="secondary" size="lg" to="/vehicles">
          ยกเลิก
        </Button>
        <Button type="submit" size="lg" disabled={!valid}>
          รับรถเข้าสต็อก
        </Button>
      </div>
    </form>
  )
}
