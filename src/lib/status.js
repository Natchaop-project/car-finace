// Vehicle lifecycle, see docs/car-dealer-workflow.pdf section 2.
export const STATUS = {
  APPRAISAL: { label: 'ประเมินราคา', tone: 'gray' },
  PURCHASED: { label: 'ซื้อแล้ว', tone: 'gray' },
  IN_STOCK: { label: 'รถเข้าลาน', tone: 'blue' },
  INSPECTION: { label: 'ตรวจสภาพ', tone: 'blue' },
  RECONDITIONING: { label: 'กำลังซ่อม', tone: 'orange' },
  READY_FOR_SALE: { label: 'พร้อมขาย', tone: 'green' },
  RESERVED: { label: 'จองแล้ว', tone: 'purple' },
  FINANCE_PENDING: { label: 'รอไฟแนนซ์', tone: 'purple' },
  SOLD: { label: 'ขายแล้ว', tone: 'ink' },
  DELIVERED: { label: 'ส่งมอบแล้ว', tone: 'ink' },
  TRANSFERRED: { label: 'โอนเล่มแล้ว', tone: 'ink' },
  CANCELLED: { label: 'ยกเลิก', tone: 'red' },
}

export const SOLD_STATUSES = ['SOLD', 'DELIVERED', 'TRANSFERRED']

// Next allowed moves per status. `kind` picks the button style.
export const TRANSITIONS = {
  APPRAISAL: [
    { to: 'PURCHASED', label: 'ยืนยันการซื้อ' },
    { to: 'CANCELLED', label: 'ยกเลิก', kind: 'ghost' },
  ],
  PURCHASED: [{ to: 'IN_STOCK', label: 'รับรถเข้าลาน' }],
  IN_STOCK: [{ to: 'INSPECTION', label: 'เริ่มตรวจสภาพ' }],
  INSPECTION: [
    { to: 'RECONDITIONING', label: 'ส่งซ่อม' },
    { to: 'READY_FOR_SALE', label: 'พร้อมขาย (ไม่ต้องซ่อม)', kind: 'secondary' },
  ],
  RECONDITIONING: [{ to: 'READY_FOR_SALE', label: 'ซ่อมเสร็จ พร้อมขาย' }],
  READY_FOR_SALE: [{ to: 'RESERVED', label: 'บันทึกการจอง' }],
  RESERVED: [
    { to: 'FINANCE_PENDING', label: 'ยื่นไฟแนนซ์' },
    { to: 'SOLD', label: 'ชำระเงินสดครบ', kind: 'secondary' },
    { to: 'READY_FOR_SALE', label: 'ยกเลิกจอง', kind: 'ghost' },
  ],
  FINANCE_PENDING: [
    { to: 'SOLD', label: 'ไฟแนนซ์อนุมัติ' },
    { to: 'READY_FOR_SALE', label: 'ไม่อนุมัติ', kind: 'ghost' },
  ],
  SOLD: [{ to: 'DELIVERED', label: 'ส่งมอบรถ' }],
  DELIVERED: [{ to: 'TRANSFERRED', label: 'โอนเล่มเสร็จ' }],
  TRANSFERRED: [],
  CANCELLED: [],
}

// Groups used by filters and the dashboard pipeline (series colors 1-4).
export const STAGES = [
  { key: 'prep', label: 'เตรียมรถ', color: 'var(--series-1)', statuses: ['APPRAISAL', 'PURCHASED', 'IN_STOCK', 'INSPECTION', 'RECONDITIONING'] },
  { key: 'ready', label: 'พร้อมขาย', color: 'var(--series-2)', statuses: ['READY_FOR_SALE'] },
  { key: 'booked', label: 'จอง / รอไฟแนนซ์', color: 'var(--series-3)', statuses: ['RESERVED', 'FINANCE_PENDING'] },
  { key: 'sold', label: 'ขายแล้ว', color: 'var(--series-4)', statuses: SOLD_STATUSES },
]

// Simplified lifecycle shown as a stepper on the vehicle page.
export const STEPS = [
  { label: 'รับเข้า', statuses: ['APPRAISAL', 'PURCHASED', 'IN_STOCK'] },
  { label: 'ตรวจสภาพ', statuses: ['INSPECTION'] },
  { label: 'ซ่อม', statuses: ['RECONDITIONING'] },
  { label: 'พร้อมขาย', statuses: ['READY_FOR_SALE'] },
  { label: 'จอง / ไฟแนนซ์', statuses: ['RESERVED', 'FINANCE_PENDING'] },
  { label: 'ขายแล้ว', statuses: ['SOLD', 'DELIVERED'] },
  { label: 'โอนเล่ม', statuses: ['TRANSFERRED'] },
]

export const WO_STATUS = {
  PENDING_APPROVAL: { label: 'รออนุมัติ', tone: 'orange', next: { to: 'APPROVED', label: 'อนุมัติ' } },
  APPROVED: { label: 'อนุมัติแล้ว', tone: 'blue', next: { to: 'IN_PROGRESS', label: 'เริ่มงาน' } },
  IN_PROGRESS: { label: 'กำลังซ่อม', tone: 'purple', next: { to: 'DONE', label: 'ปิดงาน' } },
  DONE: { label: 'เสร็จแล้ว', tone: 'green', next: null },
}

// Work orders above this budget need manager approval.
export const APPROVAL_LIMIT = 20000

export const ITEM_TYPES = {
  labor: 'ค่าแรง',
  part: 'อะไหล่',
  sublet: 'งานนอก',
}

export const EXPENSE_CATEGORIES = ['ขนย้ายรถ', 'ค่าธรรมเนียม / โอน', 'เตรียมรถ / ล้างรถ', 'ดอกเบี้ย floor plan', 'อื่นๆ']

// Cash advances: staff draw cash to buy parts, then clear it with a receipt.
export const ADVANCE_STATUS = {
  PENDING_CLEAR: { label: 'รอเคลียร์', tone: 'orange' },
  CLEARED: { label: 'เคลียร์แล้ว', tone: 'green' },
}
