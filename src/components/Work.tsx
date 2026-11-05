import { Link } from 'react-router-dom'

import { flagships, projects } from '../data/projects'
import Flagship from './Flagship'
import Reveal from './Reveal'

export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-h">
      <div className="wrap work__intro">
        <Reveal>
          <h2 id="work-h" className="section-title">
            Work<span className="dot">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="work__summary">
            A control monitor that screens procurement records against policy, a benchmark of two AI assistants on
            compliance questions, and a middleware layer for a logistics company. For each one I designed the data
            model, the workflow and the checks, and wrote down where it stops working.
          </p>
        </Reveal>
      </div>
      <p className="wrap mono muted work__note">Each system is drawn as a working diagram. Scroll and it runs, one step at a time.</p>

      {flagships.map((p, i) => (
        <Flagship key={p.slug} project={p} index={i} count={flagships.length} />
      ))}

      <div id="all-work" className="wrap all-work">
        <h3 className="mono muted all-work__head">All work ({projects.length})</h3>
        <ol>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link to={`/work/${p.slug}`}>
                <span className="mono muted">0{i + 1}</span>
                <span className="all-work__title">{p.title}</span>
                <span className="all-work__kind muted">{p.kind}</span>
                <span className={`badge badge--${p.tone}`}>{p.status}</span>
                <span className="accent all-work__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
