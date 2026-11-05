import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { stack } from '../data/profile'
import Reveal from './Reveal'

export default function Stack() {
  const [open, setOpen] = useState(stack[0].key)

  return (
    <section id="stack" className="section" aria-labelledby="stack-h">
      <div className="wrap stack">
        <div>
          <Reveal>
            <h2 id="stack-h" className="section-title">
              Stack<span className="dot">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="stack__intro">
              The tools behind the projects above, grouped by layer. Each note says where it was actually used.
            </p>
          </Reveal>
        </div>

        <ul className="stack__groups">
          {stack.map((g) => {
            const isOpen = g.key === open
            return (
              <li key={g.key} className={isOpen ? 'is-open' : ''}>
                <button className="stack__toggle" aria-expanded={isOpen} onClick={() => setOpen(g.key)}>
                  <span className="mono accent">{g.key}</span>
                  <span className="stack__name">{g.name}</span>
                  <span className="mono muted">{g.items.length}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="stack__panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ul className="stack__items">
                        {g.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="stack__note">{g.note}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
