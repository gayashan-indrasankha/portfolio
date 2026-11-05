import { useState } from 'react'

import { profile } from '../data/profile'
import { useLocalTime } from '../hooks/useLocalTime'
import Reveal from './Reveal'

export default function Contact() {
  const time = useLocalTime(profile.timeZone)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="ct-h">
      <div className="wrap">
        <Reveal>
          <h2 id="ct-h" className="section-title">
            Contact<span className="dot">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="contact__intro">
            For software engineering internships, or to talk through any of the projects above, email is the best way to
            reach me.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="contact__email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button className="btn" onClick={copy} aria-live="polite">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </Reveal>

        <dl className="contact__grid">
          {profile.links.map((l) => (
            <div key={l.label}>
              <dt className="mono muted">{l.label}</dt>
              <dd>
                <a href={l.href} target="_blank" rel="noreferrer me">
                  {l.handle} <span className="accent">↗</span>
                </a>
              </dd>
            </div>
          ))}
          {profile.resumeUrl && (
            <div>
              <dt className="mono muted">Résumé</dt>
              <dd>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  PDF <span className="accent">↗</span>
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="mono muted">Based</dt>
            <dd>
              {profile.based}{' '}
              <span className="mono muted">
                {time} {profile.timeZoneLabel}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
