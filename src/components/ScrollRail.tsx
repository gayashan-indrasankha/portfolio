import { motion, useScroll, useSpring, useTransform } from 'motion/react'

/** A thin line down the left edge that fills as the page scrolls, with a glowing dot at its tip. */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const top = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div className="rail" aria-hidden="true">
      <motion.div className="rail__fill" style={{ scaleY: progress }} />
      <motion.div className="rail__dot" style={{ top }} />
    </div>
  )
}
