import { awards, certificates } from '../data/profile'
import Reveal from './Reveal'

/** Certificates and awards. Each block renders only when its list in profile.ts has entries. */
export default function Recognition() {
  if (!certificates.length && !awards.length) return null

  return (
    <>
      {certificates.length > 0 && (
        <section id="certificates" className="section" aria-labelledby="certs-h">
          <div className="wrap">
            <Reveal>
              <h2 id="certs-h" className="section-title">
                Certificates<span className="dot">.</span>
              </h2>
            </Reveal>
            <ol className="cards">
              {certificates.map((c, i) => (
                <Reveal as="li" key={c.title} delay={0.05 * i} className="card">
                    <p className="mono muted">
                      Cert. 0{i + 1} · {c.date}
                    </p>
                    <h3>{c.title}</h3>
                    <p className="muted">{c.issuer}</p>
                    {c.note && <p>{c.note}</p>}
                    {c.href && (
                      <a className="mono accent" href={c.href} target="_blank" rel="noreferrer">
                        Verify ↗
                      </a>
                    )}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {awards.length > 0 && (
        <section id="awards" className="section" aria-labelledby="aw-h">
          <div className="wrap">
            <Reveal>
              <h2 id="aw-h" className="section-title">
                Awards<span className="dot">.</span>
              </h2>
            </Reveal>
            <ol className="awards">
              {awards.map((a) => (
                <li key={a.title}>
                  <span className="mono accent">{a.year}</span>
                  <div>
                    <h3>{a.title}</h3>
                    <p className="muted">{a.org}</p>
                    {a.note && <p>{a.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </>
  )
}
