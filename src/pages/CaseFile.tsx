import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'

import CaseRun from '../components/CaseRun'
import Reveal from '../components/Reveal'
import { profile } from '../data/profile'
import { findProject, projects } from '../data/projects'
import NotFound from './NotFound'

const pad = (n: number) => String(n).padStart(2, '0')
const ease = [0.16, 1, 0.3, 1] as const

export default function CaseFile() {
  const { slug } = useParams()
  const project = findProject(slug)

  useEffect(() => {
    if (project) document.title = `${project.title} — case file by ${profile.name.first} ${profile.name.last}`
  }, [project])

  if (!project) return <NotFound />

  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]
  const meta = [
    { label: 'Role', value: project.meta.role },
    { label: 'Runs on', value: project.meta.runsOn },
    { label: 'Where', value: project.meta.where },
    { label: 'Scale', value: project.meta.scale },
  ]

  return (
    <article className="casefile">
      <div className="wrap">
        <div className="casefile__bar mono">
          <Link to="/#work" className="muted">
            ← Work
          </Link>
          <span className={`badge badge--${project.tone}`}>{project.status}</span>
        </div>

        <header className="casefile__head">
          <p className="mono muted">
            <span className="accent">{pad(index + 1)}</span> — {project.kind}
          </p>
          <h1 className="casefile__title">
            <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>
              {project.title}
            </motion.span>
          </h1>
          <motion.p
            className="lede casefile__lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            {project.lede}
          </motion.p>
        </header>

        <dl className="casefile__meta">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="mono muted">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>

        {project.steps && project.steps.length > 0 && (
          <Reveal>
            <CaseRun steps={project.steps} caption={project.figureCaption} />
          </Reveal>
        )}

        <ol className="chapters">
          {project.chapters.map((c, i) => (
            <li key={c.tag} className="chapter">
              <Reveal className="chapter__side">
                <p className="mono accent">{c.tag}</p>
                <p className="mono muted">
                  {pad(i + 1)} / {pad(project.chapters.length)}
                </p>
              </Reveal>
              <div className="chapter__main">
                <Reveal>
                  <h2 className="chapter__heading">{c.heading}</h2>
                </Reveal>
                {c.body.map((para) => (
                  <Reveal key={para.slice(0, 32)}>
                    <p className="chapter__p">{para}</p>
                  </Reveal>
                ))}
                {c.figure && (
                  <Reveal>
                    <figure className="chapter__figure">
                      {c.figure.src ? (
                        <img src={c.figure.src} alt={c.figure.caption} loading="lazy" />
                      ) : (
                        <div className="chapter__placeholder mono muted">Screenshot to add</div>
                      )}
                      <figcaption className="muted">{c.figure.caption}</figcaption>
                    </figure>
                  </Reveal>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="casefile__links">
          {project.links.repo && (
            <a className="btn btn--solid" href={project.links.repo} target="_blank" rel="noreferrer">
              Read the code ↗
            </a>
          )}
          {project.links.live && (
            <a className="btn" href={project.links.live} target="_blank" rel="noreferrer">
              Open it live ↗
            </a>
          )}
          <p className="muted casefile__stack">{project.stack.join(' · ')}</p>
        </div>

        <Link to={`/work/${next.slug}`} className="casefile__next">
          <span className="mono muted">Next case file</span>
          <span className="casefile__next-title">
            {next.title} <span className="accent">→</span>
          </span>
        </Link>
      </div>
    </article>
  )
}
