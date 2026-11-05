import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollRail from './components/ScrollRail'
import Home from './pages/Home'
import CaseFile from './pages/CaseFile'
import NotFound from './pages/NotFound'
import { refreshSmoothScroll, startSmoothScroll } from './lib/smoothScroll'

export default function App() {
  const { pathname, hash } = useLocation()

  useEffect(startSmoothScroll, [])

  // On route change, jump to the hash target (e.g. /#work from a case file) or to the top
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView()
      })
    } else {
      window.scrollTo(0, 0)
    }
    refreshSmoothScroll()
  }, [pathname, hash])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grid-bg" aria-hidden="true" />
      <ScrollRail />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseFile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
