import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import Title from '../components/Title.jsx'
import ProjectThumb from '../components/ProjectThumb.jsx'
import Journey from '../components/Journey.jsx'
import FactsWallet from '../components/FactsWallet.jsx'
import { FlagDE, FlagNL, FlagZA } from '../components/Flags.jsx'
import { Circle, NavArrow, PointingHand, Sparkle, Underline } from '../components/Doodles.jsx'
import { contact, funFacts, projects, skillProjects, skills } from '../data/content.js'

// Look and feel of each card in the "My Skills" grid, in the same order as `skills`.
const skillCards = [
  { color: 'blue', glyph: 'Aa', size: 'wide', note: 'my favourite!' },
  { color: 'butter', glyph: '</>' },
  { color: 'plum', glyph: '{ }' },
  { color: 'pink', glyph: 'f(x)' },
  { color: 'blue', glyph: 'git' },
]

// The big symbol in the corner of each skill card, each with its own little animation on hover:
// "Aa" flicks through fonts, "</>" types itself out, "{ }" opens and closes, "f(x)" draws its graph and
// "git" draws a branch that merges back in.
function SkillGlyph({ kind }) {
  if (kind === 'Aa') {
    return (
      <span className="bento-glyph glyph-fonts" aria-hidden="true">
        <span>Aa</span><span>Aa</span><span>Aa</span><span>Aa</span>
      </span>
    )
  }
  if (kind === '</>') {
    return (
      <span className="bento-glyph glyph-type" aria-hidden="true">
        {[...'</>'].map((ch, k) => <span key={k} style={{ '--k': k }}>{ch}</span>)}
        <i className="caret" />
      </span>
    )
  }
  if (kind === '{ }') {
    return (
      <span className="bento-glyph glyph-braces" aria-hidden="true">
        <span>{'{'}</span><span className="dots">···</span><span>{'}'}</span>
      </span>
    )
  }
  if (kind === 'f(x)') {
    return (
      <span className="bento-glyph glyph-graph" aria-hidden="true">
        f(x)
        <svg viewBox="0 0 200 60" preserveAspectRatio="none">
          <path pathLength="1" d="M0 46C18 46 22 10 42 10S66 50 86 50 110 6 130 6 156 40 176 30 196 14 200 12" />
        </svg>
      </span>
    )
  }
  return (
    <span className="bento-glyph glyph-git" aria-hidden="true">
      git
      <svg viewBox="0 0 200 70">
        <path className="trunk" pathLength="1" d="M8 52H192" />
        <path className="branch" pathLength="1" d="M48 52C68 52 68 16 92 16H120C144 16 144 52 164 52" />
        <circle cx="8" cy="52" r="7" />
        <circle cx="48" cy="52" r="7" />
        <circle className="late" cx="106" cy="16" r="7" />
        <circle className="late" cx="164" cy="52" r="7" />
        <circle cx="192" cy="52" r="7" />
      </svg>
    </span>
  )
}

const projectTitle = Object.fromEntries(projects.map((p) => [p.slug, p.title]))
const listOf = (names) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0])

// One skill card. Skills used in my projects are links: hovering (or tabbing to) one shows which projects
// at the bottom of the card, and clicking it opens the projects page showing just those.
function SkillCard({ group, items, look, i }) {
  const [active, setActive] = useState(null)
  const linked = items.some((s) => skillProjects[s])
  const used = active && skillProjects[active]
  return (
    <article
      className={`bento-card tilt reveal pop ${look.color} ${look.size || ''}`}
      style={{ '--d': `${i * 90}ms`, '--r': `${i % 2 ? 3 : -3}deg` }}
    >
      <SkillGlyph kind={look.glyph} />
      <h3>
        {group}
        {look.note && <span className="pen bento-note write">{look.note}</span>}
      </h3>
      <ul>
        {items.map((s) => (
          <li key={s} className={skillProjects[s] ? 'linked' : undefined}>
            {skillProjects[s] ? (
              <Link
                to={`/projects?skill=${encodeURIComponent(s)}`}
                onMouseEnter={() => setActive(s)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s)}
                onBlur={() => setActive(null)}
              >
                {s}
              </Link>
            ) : (
              s
            )}
          </li>
        ))}
      </ul>
      {linked && (
        <p className={`bento-used${used ? ' on' : ''}`} aria-live="polite">
          {used ? (
            <>
              <strong>{active}</strong> in{' '}
              {used.length === projects.length ? 'all my projects' : listOf(used.map((slug) => projectTitle[slug]))}
            </>
          ) : (
            <>
              <span className="pen hover-only">hover a skill to see where I used it</span>
              <span className="pen touch-only">tap a skill to see where I used it</span>
            </>
          )}
        </p>
      )}
    </article>
  )
}

// How far (px) you scroll before the badge rips off the navbar.
const RIP_AT = 60

// Keeps the badge hanging from the top of the browser: measures how long its strap must be to reach
// all the way up (behind the navbar), holds it in place as the page starts scrolling, and rips it
// (strap and all) off past RIP_AT.
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
      visual.style.setProperty('--reach', `${Math.max(0, top + 4)}px`)
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
        <span className="pen badge-hint" aria-hidden="true">psst... flip me!</span>
        <Sparkle className="s1" />
        <Sparkle className="s2" />
        <Sparkle className="s3" />
      </div>
    </section>
  )
}

// Opens the contact envelope every time most of it scrolls into view: the flap folds open, the letter
// slides up, and the links pop out (all timed in CSS off the .open class). Once it has gone completely
// off screen it closes again, ready to open the next time you come back.
function useEnvelope(envelope) {
  useEffect(() => {
    const el = envelope.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          el.classList.add('open')
          el.classList.remove('shut')
        } else if (!entry.isIntersecting) el.classList.remove('open', 'shut')
      },
      { threshold: [0, 0.6] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [envelope])

  // Clicking the envelope (anywhere but the email link) closes the letter back up, or opens it again.
  // Closing it this way (.shut) shows a little "click me!" prompt until it's opened again.
  const toggle = (e) => {
    if (e.target.closest('a')) return
    if (e.type === 'keydown') {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
    }
    const open = envelope.current.classList.toggle('open')
    envelope.current.classList.toggle('shut', !open)
  }
  return toggle
}

export default function Home() {
  const featured = projects.filter((p) => p.featured)
  const envelope = useRef(null)
  const toggleEnvelope = useEnvelope(envelope)

  return (
    <main>
      <Hero />

      <section id="about" className="section slide-section from-left">
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
            <p>Currently...</p>
            <ul>
              <li><NavArrow inline pen />finishing up my BSc Computer Science degree</li>
              <li><NavArrow inline pen />practising my German Vokabeln</li>
            </ul>
            <PointingHand className="note-hand" />
          </aside>
        </div>
      </section>

      <FactsWallet />

      <Journey />

      <section id="work" className="section slide-section from-left">
        <div className="section-head">
          <Title en="My Projects" de="Ausgewählte Projekte" />
          <Link to="/projects" className="more-link reveal" aria-label={`See all ${projects.length} projects`}>
            <span className="pen write" aria-hidden="true">psst... there&apos;s more!</span>
            {/* A round sticker: the text spins around the rim, the count and an arrow sit in the middle */}
            <span className="more-stamp" aria-hidden="true">
              <svg className="more-ring" viewBox="0 0 120 120">
                <path id="more-ring-path" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" fill="none" />
                <text>
                  <textPath href="#more-ring-path" textLength="282" lengthAdjust="spacing">
                    ALL PROJECTS • ALLE PROJEKTE •
                  </textPath>
                </text>
              </svg>
              <span className="more-core">
                <strong>{projects.length}</strong>
                <small>projects</small>
                <NavArrow inline />
              </span>
            </span>
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
                <h3>{p.title}</h3>
                <p className="card-desc">{p.description}</p>
                <span className="card-more">
                  <span className="card-more-text">
                    <span>Read more</span>
                    <span className="pen" lang="de" aria-hidden="true">mehr lesen!</span>
                  </span>
                  <span className="card-more-arrow"><NavArrow inline /></span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="skills" className="section slide-section from-right">
        <Title en="My Skills" de="Meine Fähigkeiten" />
        <div className="bento">
          {Object.entries(skills).map(([group, items], i) => (
            <SkillCard key={group} group={group} items={items} look={skillCards[i % skillCards.length]} i={i} />
          ))}
        </div>
      </section>

      <section id="contact" className="contact slide-section from-left">
        <h2 className="contact-big zoom reveal">
          <Split text="Let's Talk" className="wobble" />
        </h2>
        <p className="pen contact-de write">
          Lass uns reden!
          <Underline className="draw" />
        </p>
        <p className="contact-translations reveal">Kom ons gesels · Laten we praten</p>

        {/* An envelope that opens as it scrolls into view: the flap folds back, the letter with my email
            slides up out of it, and the links pop out and plop down below (see .envelope in App.css) */}
        <div className="envelope" ref={envelope}>
          <div
            className="env-body"
            role="button"
            tabIndex={0}
            aria-label="Open or close the envelope"
            onClick={toggleEnvelope}
            onKeyDown={toggleEnvelope}
          >
            <svg className="env-back" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="597" height="377" rx="14" />
            </svg>
            <div className="env-letter">
              <p className="pen env-hi">Write to me at</p>
              <a href={`mailto:${contact.email}`} className="pen env-email">{contact.email}</a>
              <p className="pen env-sign">bis bald, Anja x</p>
            </div>
            <svg className="env-front" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
              <path className="env-side" d="M2 4 300 214 2 376Z" />
              <path className="env-side" d="M598 4 300 214 598 376Z" />
              <path className="env-bottom" d="M2 378 300 196 598 378Z" />
            </svg>
            <div className="env-flap" aria-hidden="true">
              <svg className="flap-out" viewBox="0 0 600 230" preserveAspectRatio="none">
                <path d="M2 2H598L312 222Q300 230 288 222Z" />
              </svg>
              <svg className="flap-in" viewBox="0 0 600 230" preserveAspectRatio="none">
                <path d="M2 2H598L312 222Q300 230 288 222Z" />
              </svg>
              <span className="env-seal"><img src="/favicon.svg" alt="" /></span>
            </div>
            <span className="pen env-hint" aria-hidden="true">click me!</span>
          </div>

          <div className="env-links">
            <span className="pop" style={{ '--d': '0ms', '--from': '70px' }}>
              <a href={contact.github} target="_blank" rel="noreferrer" className="social github">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
                </svg>
                GitHub <NavArrow inline out />
              </a>
            </span>
            <span className="pop" style={{ '--d': '220ms', '--from': '-70px' }}>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social linkedin">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
                </svg>
                LinkedIn <NavArrow inline out />
              </a>
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
