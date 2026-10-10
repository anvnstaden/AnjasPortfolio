import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import Title from '../components/Title.jsx'
import ProjectThumb from '../components/ProjectThumb.jsx'
import { FlagDE, FlagNL, FlagZA } from '../components/Flags.jsx'
import { Circle, PointingHand, Sparkle, Underline } from '../components/Doodles.jsx'
import { contact, funFacts, projects, skills } from '../data/content.js'

// Look and feel of each card in the "What I bring" grid, in the same order as `skills`.
const skillCards = [
  { color: 'blue', glyph: 'Aa', size: 'wide', note: 'my favourite!' },
  { color: 'butter', glyph: '</>' },
  { color: 'plum', glyph: '{ }' },
  { color: 'pink', glyph: 'f(x)' },
  { color: 'blue', glyph: 'git' },
]

const facts = [
  { label: 'Citizenship', value: 'South African & Dutch', flags: [FlagZA, FlagNL] },
  { label: 'Work rights', value: 'EU authorisation, no visa or sponsorship needed' },
  { label: 'Looking for', value: 'Roles anywhere in Germany from 2027', flags: [FlagDE] },
  { label: 'Languages', value: 'English, Afrikaans, Deutsch (learning), Dutch (understands)' },
]

// How far (px) you scroll before the badge rips off the navbar.
const RIP_AT = 60

// Keeps the badge hanging from the navbar: measures how long its strap must be to reach up under
// the navbar, holds it in place as the page starts scrolling, and rips it (strap and all) off past RIP_AT.
// It hangs back up when you return to the top.
function useRipOffNavbar(badge) {
  const [state, setState] = useState('hanging') // 'hanging' | 'ripped' | 'rehung'

  useEffect(() => {
    const visual = badge.current.parentElement
    const nav = document.querySelector('.nav')
    if (!nav) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let ripped = false
    let frame = 0

    // Offsets ignore transforms, so this works while the hero is still popping in.
    const measure = () => {
      let top = badge.current.offsetTop
      for (let el = visual; el; el = el.offsetParent) top += el.offsetTop
      const navBottom = parseFloat(getComputedStyle(nav).top) + nav.offsetHeight
      visual.style.setProperty('--reach', `${Math.max(0, top - navBottom + 16)}px`)
    }

    const update = () => {
      frame = 0
      const y = window.scrollY
      if (!ripped && y >= RIP_AT && !still) {
        ripped = true
        visual.style.setProperty('--pull', `${RIP_AT}px`)
        visual.style.setProperty('--tension', 1)
        setState('ripped')
      } else if (ripped && y < 10) {
        ripped = false
        setState('rehung')
      }
      if (!ripped && !still) {
        visual.style.setProperty('--pull', `${y}px`)
        visual.style.setProperty('--tension', (y / RIP_AT) ** 2)
      }
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }

    // Re-measure whenever the hero's layout shifts (resizing, web fonts loading in).
    const hero = visual.parentElement
    const resized = new ResizeObserver(measure)
    for (const el of [hero, ...hero.children, nav]) resized.observe(el)
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [badge])

  return state === 'hanging' ? '' : ` ${state}`
}

// A small spinning globe: a strip of landmasses (two copies of the same map) slides sideways behind a round window.
function Globe() {
  const land = [
    'M18 22 34 14 52 16 62 24 56 34 48 44 40 46 34 36 22 32Z',
    'M46 52 58 52 66 62 60 78 52 88 48 72Z',
    'M92 22 104 14 116 18 112 28 100 32 92 30Z',
    'M96 36 112 34 124 44 118 62 108 72 100 58 94 46Z',
    'M118 18 140 10 170 14 178 28 166 40 150 46 136 38 124 30Z',
    'M162 62 178 60 184 72 170 80 160 72Z',
  ]
  return (
    <span className="globe" aria-hidden="true">
      <svg className="globe-map" viewBox="0 0 400 100">
        {[0, 200].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            {land.map((d) => <path key={d} d={d} />)}
          </g>
        ))}
      </svg>
    </span>
  )
}

// Hanging ID badge with the profile photo. It flips over on hover (or tap / Enter) to show fun facts.
function IdBadge() {
  const [photoMissing, setPhotoMissing] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const flip = () => setFlipped((f) => !f)
  const badge = useRef(null)
  const rip = useRipOffNavbar(badge)

  return (
    <div
      ref={badge}
      className={`badge${flipped ? ' flipped' : ''}${rip}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="ID badge for Anja van Staden. Flip it over for some fun facts."
      onClick={() => !window.matchMedia('(hover: hover)').matches && flip()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          flip()
        }
      }}
    >
      <span className="badge-strap" aria-hidden="true" />
      <span className="badge-clip" aria-hidden="true" />
      <div className="badge-card">
        <div className="badge-face badge-front">
          <span className="badge-slot" aria-hidden="true" />
          <p className="badge-head">
              <Globe /> open to work from 2027
            </p>
          <div className="badge-photo">
            {photoMissing ? (
              <span className="monogram">AvS</span>
            ) : (
              <img src="/profile.jpeg" alt="Anja van Staden" onError={() => setPhotoMissing(true)} />
            )}
          </div>
          <p className="badge-name">Anja<br />van Staden</p>
          <p className="badge-role">UI/UX designer &amp; software engineer</p>
          <span className="badge-barcode" aria-hidden="true" />
        </div>
        <div className="badge-face badge-back">
          <span className="badge-slot" aria-hidden="true" />
          <p className="pen badge-back-title">fun facts!</p>
          <ul>
            {funFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="hello hero-fade">
          Hallo! <FlagZA /> <FlagNL /> <FlagDE />
        </p>
        <h1 className="hero-name">
          <Split text="Anja" />
          <Split text="van Staden" className="accent-line" offset={4} />
        </h1>
        <p className="hero-role hero-fade" style={{ '--d': '700ms' }}>
          UI/UX designer <span className="pen amp">&amp;</span> software engineer
        </p>
        <p className="pen hero-note write" style={{ '--d': '1100ms' }}>
          designer at heart, software engineer by degree
          <Underline className="draw" />
        </p>
        <p className="hero-sub hero-fade" style={{ '--d': '850ms' }}>
          Final-year Computer Science &amp; Operations Research student at Stellenbosch University.
        </p>
        <div className="hero-actions hero-fade" style={{ '--d': '950ms' }}>
          <Link to="/projects" className="button primary">View projects</Link>
          <Link to="/#contact" className="button">Get in touch</Link>
        </div>
      </div>

      <div className="hero-visual">
        <div className="photo-blob" aria-hidden="true" />
        <IdBadge />
        <span className="pen badge-hint" aria-hidden="true">psst… flip me!</span>
        <Sparkle className="s1" />
        <Sparkle className="s2" />
        <Sparkle className="s3" />
      </div>
    </section>
  )
}

export default function Home() {
  const featured = projects.filter((p) => p.featured)

  return (
    <main>
      <Hero />

      <section id="about" className="section">
        <Title en="About Me" de="Über mich" />
        <div className="about-grid">
          <div className="statements">
            <p className="statement reveal">
              I design <mark className="hl">interfaces people enjoy</mark> and build the{' '}
              <span className="circled">software<Circle className="draw" /></span> behind them.
            </p>
            <p className="statement reveal">
              Final-year <mark className="hl">Computer Science &amp; Operations Research</mark> student at
              Stellenbosch University, with a soft spot for UI/UX, product design and frontend.
            </p>
            <p className="statement reveal">
              <span className="underlined">Proudly South African &amp; Dutch<Underline className="draw" /></span>,
              learning German, and looking for roles <mark className="hl">anywhere in Germany</mark> from 2027.
            </p>
          </div>
          <aside className="sticky-note reveal pop" style={{ '--d': '200ms' }}>
            <p>Currently…</p>
            <ul>
              <li>finishing up my BSc Computer Science degree</li>
              <li>practising my German Vokabeln</li>
            </ul>
            <PointingHand className="note-hand" />
          </aside>
        </div>
        <dl className="facts">
          {facts.map((f, i) => (
            <div key={f.label} className="fact tilt reveal" style={{ '--d': `${i * 90}ms` }}>
              <dt>{f.label}</dt>
              <dd>
                {f.value}
                {f.flags && (
                  <span className="fact-flags">
                    {f.flags.map((Flag, j) => <Flag key={j} />)}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="work" className="section">
        <div className="section-head">
          <Title en="My Projects" de="Ausgewählte Projekte" />
          <Link to="/projects" className="more-link reveal">
            <span className="pen write">psst… there&apos;s more!</span>
            All {projects.length} projects →
          </Link>
        </div>
        <div className="featured">
          {featured.map((p, i) => (
            <Link
              to={`/projects#${p.slug}`}
              key={p.slug}
              className="card tilt reveal pop"
              style={{ '--d': `${i * 120}ms`, '--r': `${(i - 1) * 4}deg` }}
            >
              <ProjectThumb project={p} index={projects.indexOf(p)} />
              <div className="card-body">
                <p className="card-kind">{p.kind}</p>
                <h3>{p.title}</h3>
                <p className="card-desc">{p.description}</p>
                <span className="card-more">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="skills" className="section">
        <Title en="What I Bring" de="Was ich mitbringe" />
        <div className="bento">
          {Object.entries(skills).map(([group, items], i) => {
            const look = skillCards[i % skillCards.length]
            return (
              <article
                key={group}
                className={`bento-card tilt reveal pop ${look.color} ${look.size || ''}`}
                style={{ '--d': `${i * 90}ms`, '--r': `${i % 2 ? 3 : -3}deg` }}
              >
                <span className="bento-glyph" aria-hidden="true">{look.glyph}</span>
                <p className="bento-count">
                  {String(items.length).padStart(2, '0')} skills
                  {look.note && <span className="pen bento-note write">{look.note}</span>}
                </p>
                <h3>{group}</h3>
                <ul>
                  {items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section id="contact" className="contact">
        <h2 className="contact-big zoom reveal">
          <Split text="Let's Talk" className="wobble" />
        </h2>
        <p className="pen contact-de write">
          Lass uns reden!
          <Underline className="draw" />
        </p>
        <p className="contact-translations reveal">Kom ons gesels · Laten we praten</p>
        <a href={`mailto:${contact.email}`} className="button primary big reveal pop">{contact.email}</a>
        <div className="socials reveal">
          <a href={contact.github} target="_blank" rel="noreferrer" className="social github">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
            </svg>
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social linkedin">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
            </svg>
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  )
}
