import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'

import type { Project } from '../data/projects'
import { scrollToY } from '../lib/smoothScroll'
import CountUp from './CountUp'
import { hasWebGL } from '../lib/webgl'
import Model from './Model'
import Reveal from './Reveal'

interface Props {
  project: Project
  index: number
  count: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * One flagship project: a header with problem, solution and numbers, then a pinned "how it runs"
 * stage that advances one step at a time as the reader scrolls through it.
 */
export default function Flagship({ project, index, count }: Props) {
  const steps = project.steps ?? []
  const runRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  // Progress through the run is measured from live layout on every scroll, so it stays right
  // even after fonts or images above it change the page height.
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', () => {
    const el = runRef.current
    if (!el || !steps.length) return
    const span = el.offsetHeight - window.innerHeight
    const progress = span > 0 ? -el.getBoundingClientRect().top / span : 0
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)))
    setStep((s) => (s === next ? s : next))
  })

  // Clicking a node scrolls to the point in the run where that step is shown
  const goTo = (i: number) => {
    const el = runRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    scrollToY(top + span * ((i + 0.5) / steps.length))
  }

  const current = steps[step]

  return (
    <article id={`w-${project.slug}`} className="flagship" aria-labelledby={`t-${project.slug}`}>
      <header className="wrap flagship__head">
        <Reveal>
          <p className="mono muted">
            <span className="accent">{pad(index + 1)}</span> / {pad(count)} · {project.kind}
          </p>
          <h3 id={`t-${project.slug}`} className="flagship__title">
            {project.title}
          </h3>
          <p className={`badge badge--${project.tone}`}>{project.status}</p>
        </Reveal>

        <Reveal delay={0.08} className="flagship__ps">
          <dl>
            <div>
              <dt className="mono muted">Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt className="mono muted">Solution</dt>
              <dd className="flagship__solution">{project.solution}</dd>
            </div>
          </dl>
        </Reveal>
      </header>

      {steps.length > 0 && (
        <div ref={runRef} className="run" style={{ '--steps': steps.length } as CSSProperties}>
          <div className="run__stage wrap">
            <div className="run__text">
              <p className="mono muted run__counter">
                How it runs <span className="accent">{pad(step + 1)}</span> / {pad(steps.length)}
              </p>
              {/* Keyed so each new step replays a short enter animation; no exit, so fast scrolling never stalls */}
              <motion.div
                key={step}
                className="run__current"
                aria-hidden="true"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="mono accent run__label">{current.label}</p>
                <h4 className="run__title">{current.title}</h4>
                <p className="run__detail">{current.detail}</p>
              </motion.div>

              <ol className="run__ticks" aria-hidden="true">
                {steps.map((s, i) => (
                  <li key={s.label} className={i <= step ? 'is-on' : ''} />
                ))}
              </ol>

              {/* Full list for small screens and screen readers, where the pinned stage doesn't apply */}
              <ol className="run__list">
                {steps.map((s, i) => (
                  <li key={s.label}>
                    <span className="mono accent">{pad(i + 1)}</span>
                    <div>
                      <p className="run__list-title">{s.title}</p>
                      <p className="muted">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <figure className="run__figure">
              <Model steps={steps} active={step} onSelect={goTo} />
              {project.figureCaption && (
                <figcaption>
                  <span className="mono accent">Fig. {pad(index + 1)}</span> {project.figureCaption}
                </figcaption>
              )}
              <p className="mono muted run__hint">
                Scroll to run it · {hasWebGL ? 'drag to turn · ' : ''}click a step to jump
              </p>
            </figure>
          </div>
        </div>
      )}

      <footer className="wrap flagship__foot">
        <dl className="stats">
          {project.stats.map((s) => (
            <div key={s.label}>
              <dt>
                <CountUp value={s.value} />
              </dt>
              <dd className="mono muted">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="flagship__stack muted">{project.stack.join(' · ')}</p>
        <div className="flagship__links">
          <Link className="btn btn--solid" to={`/work/${project.slug}`}>
            Read the case file <span aria-hidden="true">→</span>
          </Link>
          {project.links.repo && (
            <a className="btn" href={project.links.repo} target="_blank" rel="noreferrer">
              Code <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.links.live && (
            <a className="btn" href={project.links.live} target="_blank" rel="noreferrer">
              Live <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </footer>
    </article>
  )
}
