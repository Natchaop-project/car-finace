import { GROUND, ROAD_Z, SLOT_D, SLOT_W, ZONES, rowsFor } from './zones'

const HALF_W = GROUND.w / 2
const HALF_D = GROUND.d / 2

export function Box({ p, s, c, rot, shadow = true, opacity }) {
  return (
    <mesh position={p} rotation={rot} castShadow={shadow} receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.85} transparent={opacity != null} opacity={opacity ?? 1} />
    </mesh>
  )
}

function Cyl({ p, r, h, c, seg = 16 }) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, h, seg]} />
      <meshStandardMaterial color={c} roughness={0.8} />
    </mesh>
  )
}

// Row of windows on the +z face of a building.
function Windows({ x, y, z, count, gap = 1, c }) {
  return Array.from({ length: count }, (_, i) => (
    <Box key={i} p={[x + (i - (count - 1) / 2) * gap, y, z]} s={[0.5, 0.55, 0.05]} c={c} shadow={false} />
  ))
}

function Tree({ p }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0.4, 0]} r={0.12} h={0.8} c="#7a5a3a" seg={6} />
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.8, 1.9, 7]} />
        <meshStandardMaterial color="#3f9a5a" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

function Ground({ pal }) {
  const wall = (p, s) => <Box p={p} s={s} c={pal.wall} />
  const gateGap = 2.2
  const side = (HALF_W - gateGap) / 2 + gateGap
  return (
    <group>
      <Box p={[0, -0.6, 0]} s={[GROUND.w + 2, 1.2, GROUND.d + 2]} c={pal.base} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} receiveShadow>
        <planeGeometry args={[GROUND.w, GROUND.d]} />
        <meshStandardMaterial color={pal.ground} roughness={1} />
      </mesh>

      {/* Main road, the spur to the exit plaza, and lane markings */}
      <Box p={[0, 0.01, ROAD_Z]} s={[GROUND.w, 0.02, 3]} c={pal.road} shadow={false} />
      <Box p={[0, 0.01, 2.3]} s={[3, 0.02, 2]} c={pal.road} shadow={false} />
      {Array.from({ length: 14 }, (_, i) => (
        <Box key={i} p={[-19.5 + i * 3, 0.025, ROAD_Z]} s={[1.4, 0.01, 0.12]} c="#f5f5f7" shadow={false} />
      ))}

      {/* Perimeter wall with an opening for the gate */}
      {wall([0, 0.35, -HALF_D], [GROUND.w, 0.7, 0.4])}
      {wall([-HALF_W, 0.35, 0], [0.4, 0.7, GROUND.d])}
      {wall([HALF_W, 0.35, 0], [0.4, 0.7, GROUND.d])}
      {wall([-side, 0.35, HALF_D], [HALF_W - gateGap, 0.7, 0.4])}
      {wall([side, 0.35, HALF_D], [HALF_W - gateGap, 0.7, 0.4])}

      {[[-20, 0, -13.2], [20, 0, -13.2], [-20, 0, 2.6], [20, 0, 2.6], [7.2, 0, -13.3], [-7.2, 0, -13.3]].map((p) => (
        <Tree key={p.join()} p={p} />
      ))}
    </group>
  )
}

// Painted bays (or lifts / turntables) under the parked cars.
function Bays({ zone, count }) {
  const rows = rowsFor(zone, count)
  const width = zone.cols * SLOT_W
  return Array.from({ length: rows }, (_, r) => {
    const z = zone.z + r * SLOT_D
    return (
      <group key={r}>
        <mesh rotation-x={-Math.PI / 2} position={[zone.x, 0.015, z]}>
          <planeGeometry args={[width + 0.3, SLOT_D - 0.3]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.16} />
        </mesh>
        {Array.from({ length: zone.cols + 1 }, (_, c) => (
          <Box key={c} p={[zone.x - width / 2 + c * SLOT_W, 0.025, z]} s={[0.07, 0.01, SLOT_D - 0.5]} c="#ffffff" shadow={false} />
        ))}
        {Array.from({ length: zone.cols }, (_, c) => {
          const x = zone.x - width / 2 + (c + 0.5) * SLOT_W
          if (zone.key === 'repair') {
            return [-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
              <Box key={`${c}${sx}${sz}`} p={[x + sx * 0.66, 0.45, z + sz * 0.95]} s={[0.1, 0.9, 0.1]} c="#ffcc00" />
            )))
          }
          if (zone.key === 'showroom') return <Cyl key={c} p={[x, 0.03, z]} r={0.82} h={0.05} c="#f5f5f7" seg={24} />
          return null
        })}
      </group>
    )
  })
}

function Inspection({ pal }) {
  const { x } = ZONES[1]
  return (
    <group position={[x, 0, -10.5]}>
      <Box p={[0, 1.5, 0]} s={[9, 3, 4]} c={pal.building} />
      <Box p={[0, 2.85, 2.03]} s={[9, 0.3, 0.05]} c="#0a84ff" shadow={false} />
      <Box p={[-1.6, 1.1, 2.02]} s={[3.2, 2.2, 0.06]} c="#3d4a5c" shadow={false} />
      <Windows x={2.6} y={1.7} z={2.03} count={3} c={pal.window} />
      <Cyl p={[2.4, 3.6, -0.6]} r={0.55} h={1.2} c="#e8e8ec" />
      <Cyl p={[3.6, 3.6, -0.6]} r={0.55} h={1.2} c="#e8e8ec" />
      <Box p={[-2.5, 3.2, -0.5]} s={[1.6, 0.4, 1.2]} c="#b9bcc4" />
    </group>
  )
}

function Repair({ pal }) {
  return (
    <group position={[0, 0, -10.5]}>
      <Box p={[0, 1.8, 0]} s={[10, 3.6, 4]} c={pal.building} />
      {[-3, 0, 3].map((dx) => (
        <group key={dx}>
          <Box p={[dx, 1.15, 2.02]} s={[2.2, 2.3, 0.06]} c="#ff9f0a" shadow={false} />
          {[0.4, 0.9, 1.4, 1.9].map((y) => (
            <Box key={y} p={[dx, y, 2.06]} s={[2.2, 0.04, 0.02]} c="#c76f00" shadow={false} />
          ))}
        </group>
      ))}
      <Windows x={0} y={3.0} z={2.03} count={7} gap={1.3} c={pal.window} />
      {/* Striped chimney, as in the reference art */}
      <Cyl p={[3.6, 4.6, -0.8]} r={0.38} h={2.4} c="#f2f2f4" />
      <Cyl p={[3.6, 5.5, -0.8]} r={0.4} h={0.35} c="#ff3b30" />
      <Cyl p={[3.6, 5.95, -0.8]} r={0.4} h={0.25} c="#ff3b30" />
      {[-3.4, -2, -0.6].map((dx) => (
        <Box key={dx} p={[dx, 3.85, -0.6]} s={[1, 0.5, 1]} c="#8e8e93" />
      ))}
      <Box p={[1.4, 3.75, -0.2]} s={[0.12, 0.3, 2.6]} c="#3a7f8c" />
    </group>
  )
}

function Showroom({ pal }) {
  const { x } = ZONES[3]
  return (
    <group position={[x, 0, -10.5]}>
      <Box p={[0, 1.7, 0]} s={[9, 3.4, 4]} c={pal.building} />
      <Box p={[0, 1.4, 2.02]} s={[7.6, 2.4, 0.08]} c="#7cc3ff" opacity={0.75} shadow={false} />
      {[-2.5, 0, 2.5].map((dx) => (
        <Box key={dx} p={[dx, 1.4, 2.08]} s={[0.08, 2.4, 0.04]} c={pal.building} shadow={false} />
      ))}
      <Box p={[0, 3.25, 2.5]} s={[9.4, 0.15, 1.2]} c="#30d158" />
      {[-4, 4].map((dx) => (
        <group key={dx} position={[dx, 0, 3.6]}>
          <Cyl p={[0, 1.6, 0]} r={0.05} h={3.2} c="#d1d1d6" seg={6} />
          <Box p={[0.35, 2.85, 0]} s={[0.7, 0.5, 0.03]} c="#30d158" shadow={false} />
        </group>
      ))}
    </group>
  )
}

function Intake() {
  return (
    <group>
      <group position={[-19.6, 0, 9.5]}>
        <Box p={[0, 1, 0]} s={[1.6, 2, 2]} c="#f7f7f8" />
        <Box p={[0, 2.1, 0]} s={[1.9, 0.18, 2.3]} c="#8e8e93" />
        <Box p={[0.82, 1.2, 0]} s={[0.04, 0.7, 1.2]} c="#3d4a5c" shadow={false} />
      </group>
      {/* Yellow water tower */}
      <group position={[-19.4, 0, 5]}>
        {[-0.5, 0.5].flatMap((dx) => [-0.5, 0.5].map((dz) => <Box key={`${dx}${dz}`} p={[dx, 1.2, dz]} s={[0.1, 2.4, 0.1]} c="#6e6e73" />))}
        <Cyl p={[0, 3.1, 0]} r={0.85} h={1.6} c="#ffd60a" />
        <mesh position={[0, 4.2, 0]} castShadow>
          <coneGeometry args={[1, 0.6, 16]} />
          <meshStandardMaterial color="#5ac8fa" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

function Booked() {
  return (
    <group position={[19.6, 0, 7]}>
      <Box p={[0, 1.2, 0]} s={[2.2, 2.4, 4]} c="#f7f7f8" />
      <Box p={[-1.3, 2.1, 0]} s={[0.6, 0.12, 3.6]} c="#bf5af2" />
      <Box p={[-1.12, 1.1, 0]} s={[0.04, 1.6, 0.9]} c="#3d4a5c" shadow={false} />
      <Box p={[-1.12, 1.4, 1.3]} s={[0.04, 0.6, 0.8]} c="#3d4a5c" shadow={false} />
    </group>
  )
}

function Gate() {
  return (
    <group position={[0, 0, HALF_D]}>
      {[-2.2, 2.2].map((dx) => (
        <Box key={dx} p={[dx, 1, 0]} s={[0.5, 2, 0.5]} c="#f7f7f8" />
      ))}
      {/* Raised barrier, striped red and white */}
      <group position={[-1.95, 1.3, 0]} rotation-z={1.05}>
        {Array.from({ length: 6 }, (_, i) => (
          <Box key={i} p={[0.2 + i * 0.36, 0, 0]} s={[0.36, 0.1, 0.1]} c={i % 2 ? '#ffffff' : '#ff3b30'} />
        ))}
      </group>
      <group position={[3.6, 0, -1.4]}>
        <Box p={[0, 1, 0]} s={[1.4, 2, 1.4]} c="#f7f7f8" />
        <Box p={[0, 2.08, 0]} s={[1.6, 0.15, 1.6]} c="#5e5ce6" />
        <Box p={[-0.72, 1.2, 0]} s={[0.04, 0.6, 0.8]} c="#3d4a5c" shadow={false} />
      </group>
    </group>
  )
}

export default function Yard({ pal, counts }) {
  return (
    <group>
      <Ground pal={pal} />
      <Inspection pal={pal} />
      <Repair pal={pal} />
      <Showroom pal={pal} />
      <Intake />
      <Booked />
      <Gate />
      {ZONES.map((zone) => (
        <Bays key={zone.key} zone={zone} count={counts[zone.key]} />
      ))}
    </group>
  )
}
