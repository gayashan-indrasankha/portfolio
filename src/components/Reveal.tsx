import type { ReactNode } from 'react'
import { motion } from 'motion/react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  /** Render as a list item when the reveal sits directly inside an <ol>/<ul>. */
  as?: 'div' | 'li'
}

/** Fades and lifts its children into view once, the first time they scroll on screen. */
export default function Reveal({ children, delay = 0, className, as = 'div' }: Props) {
  const Tag = as === 'li' ? motion.li : motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  )
}
