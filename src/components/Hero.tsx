import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { profile } from '../data/profile'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  // The photo drifts down and dims slightly as the page scrolls away from it
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const photoY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 140])
  const photoOpacity = useTransform(scrollY, [0, 700], [1, reduced ? 1 : 0.35])

  const facts = [
    { label: 'Status', value: profile.status, live: true },
    { label: 'Based', value: profile.based },
    { label: 'Currently', value: profile.currently },
    { label: 'Focus', value: profile.focus },
  ]

  const hasPhoto = Boolean(profile.portraitUrl)

  return (
    <section id="top" className={`hero${hasPhoto ? ' hero--photo' : ''}`} aria-labelledby="hero-name">
      {hasPhoto && (
        <motion.div
          className="hero__photo"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 0.15, ease }}
        >
          <motion.div className="hero__photo-inner" style={{ y: photoY, opacity: photoOpacity }}>
            <img src={profile.portraitUrl} alt={`${profile.name.first} ${profile.name.last}`} fetchPriority="high" />
          </motion.div>
        </motion.div>
      )}

      <motion.a
        href="#about"
        className="hero__cue mono muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2, ease }}
      >
        <span className="hero__cue-line" aria-hidden="true" />
        Scroll
      </motion.a>

      <div className="wrap hero__grid">
        <div className="hero__copy">
          <motion.p
            className="mono muted hero__eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            {profile.role} <span className="accent">—</span> {profile.org}
          </motion.p>

          <h1 id="hero-name" className="hero__name">
            {[profile.name.first, profile.name.last].map((word, i) => (
              <span className="hero__line" key={word}>
                <motion.span
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease }}
                >
                  {word}
                  {i === 1 && <span className="accent">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="hero__pitch"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
          >
            {profile.pitch}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
          >
            <a className="btn btn--solid" href="#work">
              See the work <span aria-hidden="true">↓</span>
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              Email me <span aria-hidden="true">↗</span>
            </a>
          </motion.div>

          <motion.dl
            className="hero__facts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease }}
          >
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="mono muted">{f.label}</dt>
                <dd>
                  {f.live && <span className="status-dot" aria-hidden="true" />} {f.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {!hasPhoto && (
          <motion.div
            className="hero__portrait"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
          >
            <Monogram />
          </motion.div>
        )}
      </div>
    </section>
  )
}

/** Placeholder until a portrait is added: initials on a blueprint plate. */
function Monogram() {
  const initials = profile.name.first[0] + profile.name.last[0]
  return (
    <div className="monogram" aria-hidden="true">
      <svg viewBox="0 0 320 400" role="presentation">
        <defs>
          <pattern id="mg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="320" height="400" fill="url(#mg-grid)" />
        <circle cx="160" cy="190" r="118" fill="none" stroke="var(--line)" />
        <circle cx="160" cy="190" r="118" fill="none" stroke="var(--signal)" strokeDasharray="4 10" className="monogram__ring" />
        <text x="160" y="232" textAnchor="middle" className="monogram__text">
          {initials}
        </text>
        <text x="20" y="380" className="monogram__label">
          FIG. 00 — {profile.name.first.toUpperCase()} {profile.name.last.toUpperCase()}
        </text>
      </svg>
    </div>
  )
}
