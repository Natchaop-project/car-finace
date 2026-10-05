// Demo data until the backend exists. Dates are relative to today so the
// dashboard always looks current.

const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const PATH = ['PURCHASED', 'IN_STOCK', 'INSPECTION', 'RECONDITIONING', 'READY_FOR_SALE', 'RESERVED', 'FINANCE_PENDING', 'SOLD', 'DELIVERED', 'TRANSFERRED']

// Reconstruct a plausible status history up to the current status.
function logsFor(status, inAgo, endAgo = 0) {
  const steps = PATH.slice(0, PATH.indexOf(status) + 1)
  const span = Math.max(1, inAgo - endAgo)
  return steps.map((to, i) => ({
    from: i === 0 ? null : steps[i - 1],
    to,
    at: daysAgo(Math.round(inAgo - (span * i) / Math.max(1, steps.length - 1))),
    by: i < 3 ? 'ฝ่ายจัดซื้อ' : i < 5 ? 'ช่าง' : 'เซลล์',
  }))
}

const item = (type, name, qty, unitCost) => ({ id: id('it'), type, name, qty, unitCost })
const part = (name, qty, unitCost) => item('part', name, qty, unitCost)
const labor = (name, unitCost) => item('labor', name, 1, unitCost)
const sublet = (name, unitCost) => item('sublet', name, 1, unitCost)

// One counter per prefix so vehicles are v1..v12 regardless of nested records.
let counters = {}
const id = (p) => `${p}${(counters[p] = (counters[p] ?? 0) + 1)}`

function vehicle(v) {
  const { inAgo, soldAgo, ...rest } = v
  return {
    id: id('v'),
    workOrders: [],
    expenses: [],
    ...rest,
    inDate: daysAgo(inAgo),
    soldAt: soldAgo == null ? null : daysAgo(soldAgo),
    logs: logsFor(v.status, inAgo, soldAgo ?? 0),
  }
}

const wo = (title, vendor, status, budget, items, ago, advances = []) => ({
  id: id('wo'),
  title,
  vendor,
  status,
  budget,
  items,
  advances,
  createdAt: daysAgo(ago),
})

// `forItem` links the advance to an item already on the work order; omit it for off-list purchases.
const advance = (payee, amount, forItem, ago, cleared) => ({
  id: id('adv'),
  payee,
  amount,
  purpose: forItem.name,
  itemId: forItem.id ?? null,
  date: daysAgo(ago),
  status: cleared ? 'CLEARED' : 'PENDING_CLEAR',
  ...(cleared && { spent: cleared.spent, receiptNo: cleared.receiptNo, clearedAt: daysAgo(cleared.ago) }),
})

const exp = (category, amount, ago, note = '') => ({ id: id('ex'), category, amount, date: daysAgo(ago), note })

export function seedVehicles() {
  counters = {}
  // Fortuner: two parts bought with staff cash advances, one cleared and one pending.
  const shocks = part('โช๊คอัพหน้า', 2, 4800)
  const gearOil = part('น้ำมันเกียร์ + ไส้กรอง', 1, 2800)
  return [
    vehicle({
      stockNo: 'STK-2026-0012', make: 'Toyota', model: 'Fortuner', trim: '2.8 Legender 4WD', year: 2019,
      body: 'suv', color: { name: 'ดำ', hex: '#26272b' }, plate: '3ขค 4521 กรุงเทพมหานคร', vin: 'MR0HA3CD100512345',
      mileage: 98000, gear: 'อัตโนมัติ', fuel: 'ดีเซล', source: 'รับซื้อจากลูกค้า', seller: 'คุณวิชัย ส.',
      status: 'RECONDITIONING', purchasePrice: 920000, askingPrice: 1089000, minPrice: 1050000, inAgo: 15,
      workOrders: [
        wo('ช่วงล่างและทำสี', 'อู่สมชายการช่าง', 'IN_PROGRESS', 35000, [
          sublet('ทำสีกันชนหน้า', 8500), shocks, labor('ค่าแรงเปลี่ยนโช๊ค', 2000), gearOil,
        ], 12, [
          advance('นายเอก (ช่าง)', 10000, shocks, 11, { spent: 9600, receiptNo: 'INV-66812', ago: 10 }),
          advance('นายบอย (ช่าง)', 3000, gearOil, 1),
        ]),
        wo('ซ่อมระบบแอร์', 'ร้านแอร์ดีเย็นฉ่ำ', 'PENDING_APPROVAL', 26000, [
          part('คอมเพรสเซอร์แอร์', 1, 18500), labor('ค่าแรงเปลี่ยนคอมแอร์', 3500),
        ], 3),
      ],
      expenses: [exp('ขนย้ายรถ', 2500, 15, 'จากนนทบุรี')],
    }),
    vehicle({
      stockNo: 'STK-2026-0011', make: 'Isuzu', model: 'D-Max', trim: '1.9 Hi-Lander Cab-4', year: 2022,
      body: 'pickup', color: { name: 'เงิน', hex: '#b9bcc0' }, plate: '2ฒร 778 ปทุมธานี', vin: 'MPATFS86JNT001122',
      mileage: 41000, gear: 'ธรรมดา', fuel: 'ดีเซล', source: 'ลานประมูล', seller: 'ลานประมูลกรุงไทย',
      status: 'INSPECTION', purchasePrice: 560000, askingPrice: null, minPrice: null, inAgo: 3,
      expenses: [exp('ค่าธรรมเนียม / โอน', 3500, 3, 'ค่าธรรมเนียมลานประมูล')],
    }),
    vehicle({
      stockNo: 'STK-2026-0010', make: 'Honda', model: 'Civic', trim: '1.5 Turbo RS', year: 2021,
      body: 'sedan', color: { name: 'แดง', hex: '#b3262d' }, plate: '7กพ 9090 กรุงเทพมหานคร', vin: 'MRHFC1650MP000777',
      mileage: 52000, gear: 'อัตโนมัติ', fuel: 'เบนซิน', source: 'รถเทิร์น', seller: 'คุณอรทัย ป.',
      status: 'READY_FOR_SALE', purchasePrice: 760000, askingPrice: 869000, minPrice: 845000, inAgo: 33,
      workOrders: [
        wo('เปลี่ยนยางและตั้งศูนย์', 'ร้านยางทวีชัย', 'DONE', 15000, [part('ยาง 235/40R18', 4, 3200), labor('ตั้งศูนย์ถ่วงล้อ', 800)], 30),
      ],
      expenses: [exp('เตรียมรถ / ล้างรถ', 1200, 28, 'ขัดเคลือบสี')],
    }),
    vehicle({
      stockNo: 'STK-2026-0009', make: 'Toyota', model: 'Camry', trim: '2.5 HEV Premium', year: 2020,
      body: 'sedan', color: { name: 'ขาวมุก', hex: '#f1f1ee' }, plate: '8กข 1234 กรุงเทพมหานคร', vin: 'MR053BK5000123456',
      mileage: 68000, gear: 'อัตโนมัติ', fuel: 'ไฮบริด', source: 'รถเทิร์น', seller: 'คุณสมศักดิ์ ท.',
      status: 'READY_FOR_SALE', purchasePrice: 690000, askingPrice: 799000, minPrice: 770000, inAgo: 54,
      workOrders: [
        wo('เช็กระยะ เตรียมขาย', 'อู่ในเต็นท์', 'DONE', 16000, [
          part('น้ำมันเครื่อง + กรอง', 1, 2400), part('ผ้าเบรกหน้า', 1, 3200), labor('ค่าแรง', 1500), sublet('เคลือบแก้ว', 6500),
        ], 50),
      ],
      expenses: [exp('ขนย้ายรถ', 1500, 54), exp('เตรียมรถ / ล้างรถ', 800, 45)],
    }),
    vehicle({
      stockNo: 'STK-2026-0008', make: 'Mitsubishi', model: 'Pajero Sport', trim: '2.4 GT Premium', year: 2020,
      body: 'suv', color: { name: 'น้ำตาล', hex: '#5c4a3d' }, plate: '4ขฎ 3388 นนทบุรี', vin: 'MMBGUKR10LH004455',
      mileage: 87000, gear: 'อัตโนมัติ', fuel: 'ดีเซล', source: 'รับซื้อจากลูกค้า', seller: 'คุณประเสริฐ ว.',
      status: 'FINANCE_PENDING', purchasePrice: 820000, askingPrice: 949000, minPrice: 920000, inAgo: 61,
      workOrders: [wo('เปลี่ยนสายพานและแบตเตอรี่', 'อู่ในเต็นท์', 'DONE', 9000, [part('แบตเตอรี่', 1, 3900), part('สายพานหน้าเครื่อง', 1, 1800), labor('ค่าแรง', 1200)], 55)],
      expenses: [exp('ดอกเบี้ย floor plan', 4100, 5)],
    }),
    vehicle({
      stockNo: 'STK-2026-0007', make: 'Mazda', model: '2', trim: '1.3 SP Sports', year: 2020,
      body: 'hatch', color: { name: 'น้ำเงิน', hex: '#1f4fa0' }, plate: '1กฮ 5566 กรุงเทพมหานคร', vin: 'MM7DJ2HAAL0201010',
      mileage: 59000, gear: 'อัตโนมัติ', fuel: 'เบนซิน', source: 'รับซื้อจากลูกค้า', seller: 'คุณกมลชนก ร.',
      status: 'RESERVED', purchasePrice: 330000, askingPrice: 389000, minPrice: 375000, inAgo: 69,
      workOrders: [wo('เปลี่ยนยาง', 'ร้านยางทวีชัย', 'DONE', 9000, [part('ยาง 185/60R16', 4, 2100)], 64)],
      expenses: [exp('เตรียมรถ / ล้างรถ', 700, 60)],
    }),
    vehicle({
      stockNo: 'STK-2026-0006', make: 'BMW', model: '320d', trim: 'M Sport', year: 2018,
      body: 'sedan', color: { name: 'น้ำเงินเข้ม', hex: '#1c2a44' }, plate: '9กส 2020 กรุงเทพมหานคร', vin: 'WBA8E5108JA112233',
      mileage: 112000, gear: 'อัตโนมัติ', fuel: 'ดีเซล', source: 'ดีลเลอร์อื่น', seller: 'บจก. ออโต้พลัส',
      status: 'READY_FOR_SALE', purchasePrice: 1050000, askingPrice: 1199000, minPrice: 1150000, inAgo: 96,
      workOrders: [wo('เซอร์วิสใหญ่ 100,000 กม.', 'ศูนย์ BMW', 'DONE', 30000, [part('ชุดเซอร์วิส', 1, 14500), labor('ค่าแรงศูนย์', 6800)], 90)],
      expenses: [exp('ดอกเบี้ย floor plan', 5200, 35), exp('ดอกเบี้ย floor plan', 5200, 5)],
    }),
    vehicle({
      stockNo: 'STK-2026-0005', make: 'Honda', model: 'CR-V', trim: '2.4 EL 4WD', year: 2019,
      body: 'suv', color: { name: 'เทา', hex: '#6b6e72' }, plate: '6กณ 4411 สมุทรปราการ', vin: 'MRHRW6870KP300300',
      mileage: 104000, gear: 'อัตโนมัติ', fuel: 'เบนซิน', source: 'รถยึดไฟแนนซ์', seller: 'ธนาคารกรุงศรี (รถยึด)',
      status: 'READY_FOR_SALE', purchasePrice: 780000, askingPrice: 879000, minPrice: 850000, inAgo: 117,
      workOrders: [wo('ทำสีรอบคัน', 'อู่สมชายการช่าง', 'DONE', 25000, [sublet('ทำสีประตูหลัง 2 บาน', 9000), sublet('ขัดลบรอย', 4500)], 110)],
      expenses: [exp('ขนย้ายรถ', 1800, 117), exp('ดอกเบี้ย floor plan', 4900, 60), exp('ดอกเบี้ย floor plan', 4900, 30)],
    }),
    vehicle({
      stockNo: 'STK-2026-0004', make: 'Toyota', model: 'Yaris Ativ', trim: '1.2 Premium', year: 2022,
      body: 'sedan', color: { name: 'ขาว', hex: '#f4f4f2' }, plate: '2กล 7070 กรุงเทพมหานคร', vin: 'MR2B29F30N1005050',
      mileage: 28000, gear: 'อัตโนมัติ', fuel: 'เบนซิน', source: 'รถเทิร์น', seller: 'คุณธนากร จ.',
      status: 'SOLD', purchasePrice: 385000, askingPrice: 459000, minPrice: 440000, salePrice: 449000, inAgo: 46, soldAgo: 2,
      workOrders: [wo('เช็กระยะ', 'อู่ในเต็นท์', 'DONE', 5000, [part('น้ำมันเครื่อง + กรอง', 1, 1900), labor('ค่าแรง', 600)], 44)],
      expenses: [exp('เตรียมรถ / ล้างรถ', 700, 40)],
    }),
    vehicle({
      stockNo: 'STK-2026-0003', make: 'Toyota', model: 'Hilux Revo', trim: '2.4 Prerunner', year: 2020,
      body: 'pickup', color: { name: 'ขาว', hex: '#efefec' }, plate: '3ฒก 1200 ชลบุรี', vin: 'MR0BA3CD200711111',
      mileage: 76000, gear: 'ธรรมดา', fuel: 'ดีเซล', source: 'รับซื้อจากลูกค้า', seller: 'คุณสุรชัย ม.',
      status: 'SOLD', purchasePrice: 545000, askingPrice: 639000, minPrice: 615000, salePrice: 629000, inAgo: 38, soldAgo: 4,
      workOrders: [wo('เปลี่ยนคลัตช์', 'อู่สมชายการช่าง', 'DONE', 12000, [part('ชุดคลัตช์', 1, 7800), labor('ค่าแรง', 2500)], 35)],
      expenses: [exp('ขนย้ายรถ', 2200, 38)],
    }),
    vehicle({
      stockNo: 'STK-2026-0002', make: 'Nissan', model: 'Almera', trim: '1.0 Turbo VL', year: 2021,
      body: 'sedan', color: { name: 'ส้ม', hex: '#d96a2b' }, plate: '5กจ 3131 กรุงเทพมหานคร', vin: 'MNTBBAN18Z0090909',
      mileage: 39000, gear: 'อัตโนมัติ', fuel: 'เบนซิน', source: 'รับซื้อจากลูกค้า', seller: 'คุณปิยะ อ.',
      status: 'DELIVERED', purchasePrice: 335000, askingPrice: 409000, minPrice: 390000, salePrice: 399000, inAgo: 82, soldAgo: 10,
      expenses: [exp('เตรียมรถ / ล้างรถ', 900, 75)],
    }),
    vehicle({
      stockNo: 'STK-2026-0001', make: 'Ford', model: 'Ranger', trim: '2.0 Wildtrak', year: 2021,
      body: 'pickup', color: { name: 'เทาฟ้า', hex: '#3d5a73' }, plate: '4ฒข 8080 กรุงเทพมหานคร', vin: 'MNCLMFF80MW404040',
      mileage: 64000, gear: 'อัตโนมัติ', fuel: 'ดีเซล', source: 'ดีลเลอร์อื่น', seller: 'บจก. ออโต้พลัส',
      status: 'TRANSFERRED', purchasePrice: 760000, askingPrice: 899000, minPrice: 860000, salePrice: 879000, inAgo: 102, soldAgo: 25,
      workOrders: [wo('เปลี่ยนผ้าเบรกและน้ำมัน', 'อู่ในเต็นท์', 'DONE', 8000, [part('ผ้าเบรกหน้า-หลัง', 1, 4200), labor('ค่าแรง', 1000)], 98)],
      expenses: [exp('ค่าธรรมเนียม / โอน', 2800, 20)],
    }),
  ]
}
