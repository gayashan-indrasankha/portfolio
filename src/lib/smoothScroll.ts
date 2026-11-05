import Lenis from 'lenis'

let lenis: Lenis | null = null

/** Starts Lenis smooth scrolling unless the visitor prefers reduced motion. Returns a cleanup function. */
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ autoRaf: true, anchors: { offset: -8 } })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

/** Scrolls to an absolute page offset, smoothly when Lenis is running. */
export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top)
  else window.scrollTo({ top })
}

/** Tells Lenis the page height changed (e.g. after a route change). */
export function refreshSmoothScroll() {
  lenis?.resize()
}
