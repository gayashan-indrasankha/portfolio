import { motion } from 'motion/react'

import type { Step } from '../data/projects'

const COLS = 3
const GAP_X = 200
const GAP_Y = 130
const NODE_W = 150
const NODE_H = 58
const PAD_X = 100
const PAD_Y = 70

/** Lays nodes out as a serpentine: left-to-right, then down, then right-to-left. */
function layout(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / COLS)
    const colInRow = i % COLS
    const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow
    return { x: PAD_X + col * GAP_X, y: PAD_Y + row * GAP_Y }
  })
}

interface Props {
  steps: Step[]
  active: number
  onSelect?: (index: number) => void
}

/**
 * The "how it runs" diagram: a circuit of nodes, lit up to the active step, with a signal
 * travelling along the wire as you scroll.
 */
export default function Pipeline({ steps, active, onSelect }: Props) {
  const points = layout(steps.length)
  const rows = Math.ceil(steps.length / COLS)
  const width = PAD_X * 2 + GAP_X * (COLS - 1)
  const height = PAD_Y * 2 + GAP_Y * (rows - 1)

  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')

  // Fraction of the wire's length that leads up to the active node
  const segs = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y))
  const total = segs.reduce((a, b) => a + b, 0)
  const done = segs.slice(0, active).reduce((a, b) => a + b, 0)
  const fraction = total ? done / total : 0

  const current = points[active] ?? points[0]

  return (
    <svg className="pipeline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Diagram: ${steps.map((s) => s.label).join(', then ')}`}>
      <defs>
        <filter id="pl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <path d={d} className="pipeline__wire" />
      <motion.path
        d={d}
        className="pipeline__wire pipeline__wire--lit"
        initial={false}
        animate={{ pathLength: Math.max(fraction, 0.001) }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Glow that follows the active node */}
      <motion.circle
        r="34"
        className="pipeline__halo"
        filter="url(#pl-glow)"
        initial={false}
        animate={{ cx: current.x, cy: current.y }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {points.map((p, i) => {
        const state = i < active ? 'past' : i === active ? 'active' : 'future'
        return (
          <g
            key={steps[i].label}
            className={`pipeline__node pipeline__node--${state}`}
            transform={`translate(${p.x - NODE_W / 2} ${p.y - NODE_H / 2})`}
            onClick={onSelect ? () => onSelect(i) : undefined}
          >
            <rect width={NODE_W} height={NODE_H} rx="4" />
            <text x="12" y="20" className="pipeline__num">
              {String(i + 1).padStart(2, '0')}
            </text>
            <text x="12" y="42" className="pipeline__label">
              {steps[i].label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
