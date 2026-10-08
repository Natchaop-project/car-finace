// Floor plan of the 3D yard. One unit is roughly a metre. The main road runs
// along z = ROAD_Z; the gate is at the front edge (+z), facing the camera.
// TRANSFERRED and CANCELLED belong to no zone, so they are not drawn.

export const ROAD_Z = 0
export const GROUND = { w: 42, d: 29 }
// New vehicles appear just outside the gate and drive in.
export const GATE = { x: 0, z: GROUND.d / 2 + 3 }

const SLOT_W = 1.7
const SLOT_D = 2.8

// Zones follow the lifecycle, step 1 → 6. `z` is the first parking row; extra
// rows grow toward +z. `heading` is the parked direction (0 faces +z).
export const ZONES = [
  {
    key: 'intake', step: 1, label: 'ลานรับรถ', color: '#8e8e93',
    statuses: ['APPRAISAL', 'PURCHASED', 'IN_STOCK'],
    x: -13, z: 4.6, cols: 5, heading: Math.PI, labelAt: [-13, 0.6, 13.4],
  },
  {
    key: 'inspect', step: 2, label: 'ตรวจสภาพ', color: '#0a84ff',
    statuses: ['INSPECTION'],
    x: -13, z: -6, cols: 5, heading: Math.PI, labelAt: [-13, 5, -10.5],
  },
  {
    key: 'repair', step: 3, label: 'อู่ซ่อม', color: '#ff9f0a',
    statuses: ['RECONDITIONING'],
    x: 0, z: -6, cols: 5, heading: Math.PI, labelAt: [0, 5.6, -10.5],
  },
  {
    key: 'showroom', step: 4, label: 'โชว์รูม พร้อมขาย', color: '#30d158',
    statuses: ['READY_FOR_SALE'],
    x: 13, z: -6, cols: 5, heading: 0, labelAt: [13, 5.2, -10.5],
  },
  {
    key: 'booked', step: 5, label: 'จอง / รอไฟแนนซ์', color: '#bf5af2',
    statuses: ['RESERVED', 'FINANCE_PENDING'],
    x: 13, z: 4.6, cols: 5, heading: Math.PI, labelAt: [13, 0.6, 13.4],
  },
  {
    key: 'exit', step: 6, label: 'ขายแล้ว รอส่งมอบ', color: '#5e5ce6',
    statuses: ['SOLD', 'DELIVERED'],
    x: 0, z: 5.6, cols: 3, heading: 0, labelAt: [0, 3.4, GROUND.d / 2],
  },
]

export const zoneOf = (status) => ZONES.find((z) => z.statuses.includes(status))

export function slotOf(zone, i) {
  const col = i % zone.cols
  const row = Math.floor(i / zone.cols)
  return { x: zone.x + (col - (zone.cols - 1) / 2) * SLOT_W, z: zone.z + row * SLOT_D }
}

// Rows to draw for a zone: always at least one, more when cars overflow.
export const rowsFor = (zone, count) => Math.max(1, Math.ceil(count / zone.cols))

export { SLOT_W, SLOT_D }

// Assign every visible vehicle a parking slot. Oldest stock parks first so
// slots stay stable as new cars arrive.
export function placeVehicles(vehicles) {
  const byZone = Object.fromEntries(ZONES.map((z) => [z.key, []]))
  for (const v of vehicles) {
    const zone = zoneOf(v.status)
    if (zone) byZone[zone.key].push(v)
  }
  const spots = []
  for (const zone of ZONES) {
    byZone[zone.key]
      .sort((a, b) => a.inDate.localeCompare(b.inDate) || a.id.localeCompare(b.id))
      .forEach((vehicle, i) => spots.push({ vehicle, zone, heading: zone.heading, ...slotOf(zone, i) }))
  }
  const counts = Object.fromEntries(ZONES.map((z) => [z.key, byZone[z.key].length]))
  return { spots, counts }
}

// Waypoints from one slot to another. Moving between zones goes via the road.
export function route(from, to, sameZone) {
  if (sameZone) return [[to.x, to.z]]
  return [
    [from.x, ROAD_Z],
    [to.x, ROAD_Z],
    [to.x, to.z],
  ]
}

// Last known position of each car, kept across visits to the page so a status
// change made elsewhere plays as the car driving to its new zone.
export const lastSeen = new Map()
