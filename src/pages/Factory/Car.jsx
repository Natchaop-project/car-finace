import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import { GATE, lastSeen, route } from './zones'

const SPEED = 9
const TAU = Math.PI * 2
const GLASS = '#273140'
const TIRE = '#1d1d1f'

// Low-poly proportions per body style: [width, height, length].
const BODIES = {
  sedan: { body: [1, 0.36, 2.1], cabin: [0.84, 0.3, 1.0], cabinZ: -0.1 },
  suv: { body: [1.06, 0.46, 2.15], cabin: [0.96, 0.38, 1.35], cabinZ: -0.18 },
  pickup: { body: [1.02, 0.42, 2.25], cabin: [0.94, 0.4, 0.82], cabinZ: 0.3 },
  hatch: { body: [0.96, 0.36, 1.8], cabin: [0.86, 0.32, 1.1], cabinZ: -0.12 },
}

const wrap = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI

function Part({ p, s, c, emissive }) {
  return (
    <mesh position={p} castShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.5} emissive={emissive ?? '#000'} />
    </mesh>
  )
}

// The canvas renders on demand; a car keeps requesting frames only while it is
// driving, turning or lifting.
function Car({ spot, hovered, reduceMotion, handlers }) {
  const { vehicle: v, zone, x, z, heading } = spot
  const invalidate = useThree((s) => s.invalidate)
  const outer = useRef()
  const inner = useRef()
  const nav = useRef({ path: [], zone: zone.key })

  const shape = BODIES[v.body] ?? BODIES.sedan
  const [bw, bh, bl] = shape.body
  const [cw, ch, cl] = shape.cabin
  const bodyY = 0.18 + bh / 2
  const cabinY = 0.18 + bh + ch / 2
  const paint = v.color?.hex ?? '#8e8e93'

  // Start where the car was last seen. A car never seen before drives in from
  // the gate, except on the very first render of the yard.
  useLayoutEffect(() => {
    const prev = lastSeen.get(v.id)
    const start =
      prev ?? (lastSeen.size > 0 && !reduceMotion ? { x: GATE.x, z: GATE.z, h: Math.PI, zone: null } : { x, z, h: heading, zone: zone.key })
    outer.current.position.set(start.x, 0, start.z)
    outer.current.rotation.y = start.h
    nav.current.zone = start.zone
    // Mount only: later slot changes are handled by the effect below.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Plan a drive whenever the slot changes.
  useLayoutEffect(() => {
    const g = outer.current
    const n = nav.current
    if (reduceMotion) {
      g.position.set(x, 0, z)
      g.rotation.y = heading
      n.path = []
    } else if (g.position.x !== x || g.position.z !== z) {
      n.path = route({ x: g.position.x, z: g.position.z }, { x, z }, n.zone === zone.key)
    }
    n.zone = zone.key
    invalidate()
  }, [x, z, heading, zone.key, reduceMotion, invalidate])

  useEffect(() => invalidate(), [hovered, invalidate])

  useFrame((_, delta) => {
    const g = outer.current
    const n = nav.current
    const dt = Math.min(delta, 0.05)
    let want = heading
    if (n.path.length) {
      const [tx, tz] = n.path[0]
      const dx = tx - g.position.x
      const dz = tz - g.position.z
      const d = Math.hypot(dx, dz)
      const step = SPEED * dt
      if (d <= step) {
        g.position.x = tx
        g.position.z = tz
        n.path.shift()
      } else {
        g.position.x += (dx / d) * step
        g.position.z += (dz / d) * step
      }
      if (d > 0.01) want = Math.atan2(dx, dz)
    }
    const turn = wrap(want - g.rotation.y)
    const lift = (hovered ? 0.18 : 0) - inner.current.position.y
    g.rotation.y += Math.abs(turn) < 0.002 ? turn : turn * Math.min(1, dt * 10)
    inner.current.position.y += Math.abs(lift) < 0.002 ? lift : lift * Math.min(1, dt * 14)
    lastSeen.set(v.id, { x: g.position.x, z: g.position.z, h: g.rotation.y, zone: n.zone })
    if (n.path.length || Math.abs(turn) >= 0.002 || Math.abs(lift) >= 0.002) invalidate()
  })

  const glow = hovered ? '#2a2a2a' : undefined

  return (
    <group ref={outer}>
      {hovered && (
        <mesh rotation-x={-Math.PI / 2} position-y={0.03}>
          <planeGeometry args={[bw + 0.5, bl + 0.5]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.5} />
        </mesh>
      )}
      <group ref={inner} {...handlers}>
        <Part p={[0, bodyY, 0]} s={shape.body} c={paint} emissive={glow} />
        <Part p={[0, cabinY, shape.cabinZ]} s={shape.cabin} c={GLASS} />
        <Part p={[0, cabinY + ch / 2 + 0.02, shape.cabinZ]} s={[cw + 0.02, 0.05, cl - 0.12]} c={paint} emissive={glow} />
        {v.body === 'pickup' && <Part p={[0, 0.18 + bh + 0.01, -0.55]} s={[bw - 0.16, 0.03, 0.95]} c="#3a3a3c" />}
        {[-1, 1].map((sx) => (
          <group key={sx}>
            <Part p={[sx * 0.3, bodyY + 0.05, bl / 2]} s={[0.22, 0.08, 0.03]} c="#fffbe6" emissive="#6b6650" />
            <Part p={[sx * 0.32, bodyY + 0.05, -bl / 2]} s={[0.2, 0.07, 0.03]} c="#d0302f" emissive="#4a0b0b" />
            {[-1, 1].map((sz) => (
              <mesh key={sz} position={[sx * (bw / 2 - 0.04), 0.21, sz * (bl / 2 - 0.4)]} rotation-z={Math.PI / 2} castShadow>
                <cylinderGeometry args={[0.21, 0.21, 0.16, 12]} />
                <meshStandardMaterial color={TIRE} roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}

export default memo(Car)
