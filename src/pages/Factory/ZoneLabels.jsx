import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { Vector3 } from 'three'
import { ZONES } from './zones'

// Zone signs are plain DOM laid over the canvas. LabelTracker (inside the
// Canvas) moves them to their projected 3D anchor every frame.

export function LabelTracker({ els }) {
  const { camera, size } = useThree()
  const v = useMemo(() => new Vector3(), [])
  useFrame(() => {
    // Read every width first, then write, so layout is computed once per frame.
    const halves = els.current.map((el) => (el ? el.offsetWidth / 2 + 6 : 0))
    ZONES.forEach((zone, i) => {
      const el = els.current[i]
      if (!el) return
      v.set(...zone.labelAt).project(camera)
      // Keep the whole sign on screen when the anchor is near an edge.
      const x = Math.min(Math.max(((v.x + 1) / 2) * size.width, halves[i]), size.width - halves[i])
      const y = ((1 - v.y) / 2) * size.height
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
    })
  })
  return null
}

export function ZoneLabels({ els, counts }) {
  return ZONES.map((zone, i) => (
    <div
      key={zone.key}
      ref={(el) => {
        els.current[i] = el
      }}
      className="pointer-events-none absolute top-0 left-0 flex items-center gap-1.5 rounded-full border border-line bg-surface/95 py-1 pr-3 pl-1 text-[12.5px] font-semibold whitespace-nowrap text-ink shadow-lift max-sm:text-[11px]"
      style={{ transform: 'translate(-9999px, 0)' }}
    >
      <span className="grid size-5 place-items-center rounded-full text-[11px] text-white" style={{ background: zone.color }}>
        {zone.step}
      </span>
      {zone.label}
      <span className="font-normal text-ink-2">· {counts[zone.key]} คัน</span>
    </div>
  ))
}
