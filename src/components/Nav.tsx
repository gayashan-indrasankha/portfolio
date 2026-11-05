import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { profile } from '../data/profile'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  // On the home page anchors scroll in place; elsewhere they route back home first
  const sectionLink = (id: string, children: ReactNode) =>
    pathname === '/' ? (
      <a href={`#${id}`} onClick={close}>
        {children}
      </a>
    ) : (
      <Link to={{ pathname: '/', hash: id }} onClick={close}>
        {children}
      </Link>
    )

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__name">
          {profile.name.first} {profile.name.last}
          <span className="accent">.</span>
        </Link>

        <div className="nav__right">
          <span className="nav__status mono">
            <span className="status-dot" aria-hidden="true" />
            Open to work
          </span>
          {profile.resumeUrl && (
            <a className="btn nav__btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Résumé ↗
            </a>
          )}
          <button className="btn nav__btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu"
            className="menu"
            aria-label="Sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ol className="menu__list">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {sectionLink(
                    s.id,
                    <>
                      <span className="mono muted">0{i + 1}</span>
                      {s.label}
                      <span className="accent">.</span>
                    </>,
                  )}
                </motion.li>
              ))}
            </ol>
            <div className="menu__foot mono muted">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
