import { useId } from 'react'

// Side-view illustration used until real photos are uploaded.
// Bodies share wheel positions (x = 62, 182) so they line up across cards.
const BODIES = {
  sedan: {
    body: 'M18,80 C18,70 22,64 34,62 L70,56 C84,44 98,36 116,34 L150,34 C164,34 176,42 190,54 L212,60 C222,62 226,68 226,76 L226,80 C226,84 223,86 219,86 L200,86 A18,18 0 0 0 164,86 L80,86 A18,18 0 0 0 44,86 L24,86 C20,86 18,84 18,80 Z',
    windows: ['M80,57 C90,47 102,41 116,40 L131,40 L131,57 Z', 'M136,40 L150,40 C160,40 169,45 179,55 L179,57 L136,57 Z'],
  },
  suv: {
    body: 'M18,78 C18,66 22,60 34,58 L58,54 L74,30 C78,25 84,23 92,23 L176,23 C186,23 192,27 198,34 L212,54 C222,57 226,64 226,74 L226,80 C226,84 223,86 219,86 L200,86 A18,18 0 0 0 164,86 L80,86 A18,18 0 0 0 44,86 L24,86 C20,86 18,84 18,78 Z',
    windows: ['M82,53 L93,31 L130,31 L130,53 Z', 'M135,31 L174,31 C180,31 184,33 188,38 L199,53 L135,53 Z'],
  },
  pickup: {
    body: 'M18,58 L104,58 L112,30 C114,25 118,23 124,23 L170,23 C178,23 184,27 190,34 L204,54 C218,57 226,63 226,72 L226,80 C226,84 223,86 219,86 L200,86 A18,18 0 0 0 164,86 L80,86 A18,18 0 0 0 44,86 L24,86 C20,86 18,84 18,80 Z',
    windows: ['M117,53 L125,31 L150,31 L150,53 Z', 'M155,31 L168,31 C175,31 179,33 183,38 L195,53 L155,53 Z'],
    extra: 'M104,60 L104,84',
  },
  hatch: {
    body: 'M18,76 C18,66 22,60 30,56 L40,40 C44,34 50,32 58,32 L140,32 C154,32 166,40 180,52 L210,58 C221,61 226,67 226,75 L226,80 C226,84 223,86 219,86 L200,86 A18,18 0 0 0 164,86 L80,86 A18,18 0 0 0 44,86 L24,86 C20,86 18,84 18,76 Z',
    windows: ['M47,54 L58,39 L102,39 L102,54 Z', 'M107,39 L138,39 C149,39 159,44 169,54 L107,54 Z'],
  },
}

const luma = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
}

// Outline very light or very dark paint so the silhouette reads on any surface.
const outline = (hex) => (luma(hex) > 200 ? 'rgba(0,0,0,0.14)' : luma(hex) < 60 ? 'rgba(255,255,255,0.16)' : 'none')

export default function CarArt({ body = 'sedan', color = '#8e8e93', className = '' }) {
  const id = useId()
  const shape = BODIES[body] ?? BODIES.sedan

  return (
    <svg viewBox="0 0 240 110" className={className} role="img" aria-label="ภาพประกอบรถ">
      <defs>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a4352" />
          <stop offset="1" stopColor="#151a22" />
        </linearGradient>
      </defs>
      <ellipse cx="122" cy="100" rx="106" ry="5" fill="#000" opacity="0.13" />
      <path d={shape.body} fill={color} stroke={outline(color)} strokeWidth="1" />
      <path d={shape.body} fill={`url(#${id}-shine)`} />
      {shape.windows.map((d) => (
        <path key={d} d={d} fill={`url(#${id}-glass)`} opacity="0.92" />
      ))}
      {shape.extra && <path d={shape.extra} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />}
      <rect x="213" y="64" width="11" height="4" rx="2" fill="#fff" opacity="0.85" />
      <rect x="19" y="64" width="6" height="5" rx="1.5" fill="#d0302f" />
      {[62, 182].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="86" r="15" fill="#1d1d1f" />
          <circle cx={cx} cy="86" r="8.5" fill="#9a9aa0" />
          <circle cx={cx} cy="86" r="3" fill="#d6d6db" />
        </g>
      ))}
    </svg>
  )
}
