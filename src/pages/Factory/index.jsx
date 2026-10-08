import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, cx } from '../../components/ui'
import { longDate } from '../../lib/format'
import { useStore } from '../../store'
import CarTooltip from './CarTooltip'
import { placeTooltip } from './placeTooltip'
import { ZONES, placeVehicles } from './zones'

const Scene = lazy(() => import('./Scene'))

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const onChange = (e) => setMatch(e.matches)
    m.addEventListener('change', onChange)
    return () => m.removeEventListener('change', onChange)
  }, [query])
  return match
}

// Home: the whole yard as a 3D sandbox, one zone per lifecycle stage.
export default function Factory() {
  const { vehicles } = useStore()
  const navigate = useNavigate()
  const dark = useMedia('(prefers-color-scheme: dark)')
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')
  const [hover, setHover] = useState(null) // { id, touch }
  const hoverRef = useRef(null)
  useEffect(() => {
    hoverRef.current = hover
  }, [hover])
  // Pointer position lives in a ref: moving the mouse only restyles the tooltip.
  const pointer = useRef({ x: 0, y: 0 })
  const tip = useRef(null)

  const { spots, counts } = useMemo(() => placeVehicles(vehicles), [vehicles])
  const hovered = hover && vehicles.find((v) => v.id === hover.id)

  const makeHandlers = useCallback(
    (id) => {
      const track = (e) => {
        pointer.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
        if (tip.current) placeTooltip(tip.current, pointer.current)
      }
      return {
        onPointerOver: (e) => {
          e.stopPropagation()
          if (e.pointerType === 'touch') return
          track(e)
          setHover({ id, touch: false })
        },
        onPointerMove: (e) => {
          if (e.pointerType !== 'touch' && hoverRef.current?.id === id) track(e)
        },
        onPointerOut: () => setHover((h) => (h?.id === id && !h.touch ? null : h)),
        onClick: (e) => {
          e.stopPropagation()
          if (e.delta > 4) return // a drag to pan, not a click
          // Touch has no hover: first tap shows details, second tap opens.
          if (e.pointerType === 'touch' && hoverRef.current?.id !== id) {
            track(e)
            setHover({ id, touch: true })
          } else navigate(`/vehicles/${id}`)
        },
      }
    },
    [navigate],
  )
  // One stable handler object per car, so memoised cars skip re-rendering on hover.
  const carHandlers = useMemo(
    () => Object.fromEntries(spots.map(({ vehicle }) => [vehicle.id, makeHandlers(vehicle.id)])),
    [spots, makeHandlers],
  )

  const clearHover = useCallback(() => setHover(null), [])

  return (
    <div className={cx('relative isolate h-[calc(100svh-3.25rem)] overflow-hidden', hover && !hover.touch && 'cursor-pointer')}>
      <Suspense fallback={<div className="grid h-full place-items-center text-sm text-ink-3">กำลังโหลดฉาก 3D…</div>}>
        <Scene
          spots={spots}
          counts={counts}
          dark={dark}
          reduceMotion={reduceMotion}
          hoveredId={hover?.id}
          carHandlers={carHandlers}
          onMiss={clearHover}
        />
      </Suspense>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5.5 max-sm:p-3">
        <div className="pointer-events-auto max-w-md rounded-panel border border-line bg-surface/95 p-5 shadow-lift max-sm:p-4">
          <div className="text-xs text-ink-3">{longDate()}</div>
          <h1 className="mt-0.5 text-[26px] leading-tight font-semibold tracking-[-0.02em] max-sm:text-xl">ภาพรวมเต็นท์รถ</h1>
          <div className="mt-1 text-[13px] text-ink-2">
            ในลานตอนนี้ <span className="font-semibold text-ink tabular-nums">{spots.length}</span> คัน
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5 max-sm:hidden">
            {ZONES.map((z) => (
              <li key={z.key} className="flex items-center gap-1.5 rounded-full bg-fill px-2.5 py-1 text-xs text-ink-2">
                <span className="size-2 rounded-full" style={{ background: z.color }} />
                {z.label}
                <span className="font-semibold text-ink tabular-nums">{counts[z.key]}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button to="/dashboard" variant="secondary" size="sm" className="pointer-events-auto bg-surface/95">
          แดชบอร์ด
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
        <div className="rounded-full bg-surface/90 px-3.5 py-1.5 text-xs text-ink-2 max-sm:text-[11px]">
          ลากเพื่อเลื่อน · ซูมด้วยล้อเมาส์หรือสองนิ้ว · คลิกรถเพื่อดูรายละเอียด
        </div>
      </div>

      {hovered && <CarTooltip vehicle={hovered} touch={hover.touch} elRef={tip} pointer={pointer} />}
    </div>
  )
}
