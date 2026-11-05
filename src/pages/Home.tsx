import { useEffect } from 'react'

import About from '../components/About'
import Contact from '../components/Contact'
import Experience from '../components/Experience'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Recognition from '../components/Recognition'
import Stack from '../components/Stack'
import Work from '../components/Work'
import { profile } from '../data/profile'

export default function Home() {
  useEffect(() => {
    document.title = `${profile.name.first} ${profile.name.last} — ${profile.role} | Portfolio`
  }, [])

  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Experience />
      <Stack />
      <Recognition />
      <Contact />
    </>
  )
}
