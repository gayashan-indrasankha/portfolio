import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import type { Step } from '../data/projects'
import Model from './Model'

const pad = (n: number) => String(n).padStart(2, '0')
const STEP_MS = 2800
const RESUME_MS = 9000

/**
 * The case-file version of the working model: it plays through the steps on its own, and pauses
 * when the reader hovers it or picks a step, resuming a few seconds after they let go.
 */
export default function CaseRun({ steps, caption }: { steps: Step[]; caption?: string }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [pickedAt, setPickedAt] = useState(0)

  useEffect(() => {
    if (reduced || hovering) return
    const wait = Math.max(STEP_MS, pickedAt + RESUME_MS - Date.now())
    const id = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), wait)
    return () => window.clearTimeout(id)
  }, [active, hovering, pickedAt, reduced, steps.length])

  const pick = (i: number) => {
    setActive(i)
    setPickedAt(Date.now())
  }

  return (
    <section
      className="caserun"
      aria-label="How it runs"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="caserun__model">
        <Model steps={steps} active={active} onSelect={pick} />
      </div>

      <div className="caserun__side">
        <p className="mono muted">
          How it runs <span className="accent">{pad(active + 1)}</span> / {pad(steps.length)}
        </p>
        <ol className="caserun__steps">
          {steps.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                className={i === active ? 'is-active' : i < active ? 'is-past' : ''}
                aria-current={i === active ? 'step' : undefined}
                onClick={() => pick(i)}
              >
                <span className="mono">{pad(i + 1)}</span>
                <span className="caserun__title">{s.title}</span>
              </button>
              {i === active && <p className="caserun__detail">{s.detail}</p>}
            </li>
          ))}
        </ol>
        {caption && <p className="caserun__caption">{caption}</p>}
      </div>
    </section>
  )
}
