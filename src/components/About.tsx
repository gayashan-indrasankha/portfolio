import { Link } from 'react-router-dom'

import { about } from '../data/profile'
import { projects } from '../data/projects'
import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-h">
      <div className="wrap about">
        <div className="about__main">
          <Reveal>
            <h2 id="about-h" className="section-title">
              About<span className="dot">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lede about__headline">{about.headline}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="about__body">{about.body}</p>
          </Reveal>

          <ol className="about__focus">
            {about.focus.map((item, i) => (
              <Reveal as="li" key={item} delay={0.04 * i}>
                <span className="mono accent">A.0{i + 1}</span>
                <p>{item}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="about__index" delay={0.15}>
          <div className="index">
            <div className="index__head mono muted">
              <span>Built</span>
              <span>{projects.length} projects</span>
            </div>
            <ol>
              {projects.map((p, i) => {
                const row = (
                  <>
                    <span className="mono muted">0{i + 1}</span>
                    <span className="index__title">{p.title}</span>
                    <span className={`badge badge--${p.tone}`}>{p.status}</span>
                    <span className="mono muted index__go">{p.flagship ? 'In full below ↓' : 'Case file ↗'}</span>
                  </>
                )
                return (
                  <li key={p.slug}>
                    {p.flagship ? <a href={`#w-${p.slug}`}>{row}</a> : <Link to={`/work/${p.slug}`}>{row}</Link>}
                  </li>
                )
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
