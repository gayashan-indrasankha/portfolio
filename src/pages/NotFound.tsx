import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="wrap">
        <p className="mono muted">Error 404</p>
        <h1 className="section-title">
          Not found<span className="dot">.</span>
        </h1>
        <p className="notfound__text">That page doesn’t exist.</p>
        <Link className="btn btn--solid" to="/">
          ← Back home
        </Link>
      </div>
    </section>
  )
}
