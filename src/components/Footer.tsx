import { profile } from '../data/profile'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <p>
          © {year} {profile.name.first} {profile.name.last}
        </p>
        <p className="mono muted footer__colophon">
          Set in Bricolage Grotesque, Instrument Serif, Manrope and JetBrains Mono · Built with React and Vite
        </p>
        <a className="mono" href="#top" onClick={() => window.scrollTo({ top: 0 })}>
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
