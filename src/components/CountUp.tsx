import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

/** Counts a whole number up from zero the first time it scrolls into view. Other values render as-is. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()
  const target = /^\d+$/.test(value) ? Number(value) : null
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView || target === null || reduced) return
    const controls = animate(0, target, {
      duration: Math.min(1.8, 0.8 + target / 400),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, reduced])

  if (target === null) return <span ref={ref}>{value}</span>
  // With reduced motion the number simply appears at its final value
  return <span ref={ref}>{(reduced ? target : shown).toLocaleString('en-GB')}</span>
}
