import { stack } from '../data/profile'

/** An endless strip of every technology in the stack. The list is rendered twice so the loop is seamless. */
export default function Marquee() {
  const items = stack.flatMap((g) => g.items)
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>
          {item}
          <span className="marquee__sep" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="marquee" aria-label="Technologies I use">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
