import { timeline, type TimelineEntry } from '../data/profile'
import Reveal from './Reveal'

const kindLabel: Record<TimelineEntry['kind'], string> = {
  work: 'Work',
  education: 'Education',
  project: 'Project',
}

/** Months elapsed and total between two ISO dates, for the degree progress bar. */
function progress(start?: string, end?: string) {
  if (!start || !end) return null
  const s = new Date(start)
  const e = new Date(end)
  const months = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth()
  const total = months(s, e)
  const done = Math.min(total, Math.max(0, months(s, new Date()) + 1))
  return total > 0 ? { done, total } : null
}

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="xp-h">
      <div className="wrap xp">
        <div className="xp__side">
          <Reveal>
            <h2 id="xp-h" className="section-title">
              Experience<span className="dot">.</span>
            </h2>
          </Reveal>
          <ul className="xp__legend mono muted">
            <li className="xp__key xp__key--work">Work</li>
            <li className="xp__key xp__key--education">Education</li>
            <li className="xp__key xp__key--project">Project</li>
          </ul>
        </div>

        <ol className="xp__list">
          <li className="xp__today mono accent">▽ Today</li>
          {timeline.map((t, i) => {
            const p = progress(t.start, t.end)
            return (
              <Reveal as="li" key={t.title} delay={0.05 * i} className={`xp__item xp__item--${t.kind}`}>
                  <div className="xp__when mono">
                    <span className="accent">{t.period}</span>
                    <span className="muted">
                      {kindLabel[t.kind]}
                      {t.now && ' · now'}
                    </span>
                  </div>
                  <div className="xp__body">
                    <span className="mono muted xp__num">{String(timeline.length - i).padStart(2, '0')}</span>
                    <h3 className="xp__title">{t.title}</h3>
                    <p className="muted">{t.org}</p>
                    {t.note && <p className="xp__note">{t.note}</p>}
                    {p && (
                      <div className="xp__progress" aria-label={`Month ${p.done} of ${p.total}`}>
                        <div style={{ width: `${(p.done / p.total) * 100}%` }} />
                        <span className="mono muted">
                          Month {p.done} of {p.total}
                        </span>
                      </div>
                    )}
                  </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
