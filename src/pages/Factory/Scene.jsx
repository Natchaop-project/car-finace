import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { memo, useRef } from 'react'
import Car from './Car'
import YardBase from './Yard'
import { LabelTracker, ZoneLabels } from './ZoneLabels'

const PALETTES = {
  light: { bg: '#8fbbe8', base: '#f4f5f7', ground: '#dfe3e8', road: '#5b626d', wall: '#f2f2f4', building: '#f7f7f8', window: '#3d4a5c' },
  dark: { bg: '#0d1b2e', base: '#3a3d44', ground: '#2c3036', road: '#1b1d21', wall: '#4a4d55', building: '#d9dbe0', window: '#1e2733' },
}

// The yard never changes on hover; skip its re-render.
const Yard = memo(YardBase)

// Fit the whole yard on screen whenever the canvas resizes. On portrait
// screens look down the long side so the yard fills the height.
function FitCamera() {
  const size = useThree((s) => s.size)
  const portrait = size.height > size.width * 1.1
  const zoom = portrait ? Math.min(size.width / 40, size.height / 50) : Math.min(size.width / 54, size.height / 36)
  const position = portrait ? [40, 34, 12] : [30, 30, 30]
  return <OrthographicCamera makeDefault position={position} near={0.1} far={300} zoom={zoom} />
}

export default function Scene({ spots, counts, dark, reduceMotion, hoveredId, carHandlers, onMiss }) {
  const pal = dark ? PALETTES.dark : PALETTES.light
  const labels = useRef([])
  return (
    <div className="relative h-full">
      <Canvas shadows frameloop="demand" dpr={[1, 1.5]} onPointerMissed={onMiss}>
        <color attach="background" args={[pal.bg]} />
        <FitCamera />
        <hemisphereLight args={['#ffffff', dark ? '#1a2333' : '#b9cde3', dark ? 1.1 : 1.6]} />
        <directionalLight
          position={[18, 32, 12]}
          intensity={dark ? 1.4 : 2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-bias={-0.0005}
        />
        <Yard pal={pal} counts={counts} />
        <LabelTracker els={labels} />
        {spots.map((spot) => (
          <Car
            key={spot.vehicle.id}
            spot={spot}
            hovered={hoveredId === spot.vehicle.id}
            reduceMotion={reduceMotion}
            handlers={carHandlers[spot.vehicle.id]}
          />
        ))}
        {/* Fixed isometric angle: zoom and pan only. */}
        <OrbitControls makeDefault target={[0, 0, 0]} enableRotate={false} enableDamping={false} minZoom={5} maxZoom={70} />
      </Canvas>
      <ZoneLabels els={labels} counts={counts} />
    </div>
  )
}
