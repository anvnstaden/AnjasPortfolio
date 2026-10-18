import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import Title from '../components/Title.jsx'
import ProjectThumb from '../components/ProjectThumb.jsx'
import Journey from '../components/Journey.jsx'
import FactsWallet from '../components/FactsWallet.jsx'
import Blueprint from '../components/Blueprint.jsx'
import { Circle, NavArrow, PointingHand, Sparkle, Underline } from '../components/Doodles.jsx'
import { contact, projects, skillProjects, skills } from '../data/content.js'

const projectTitle = Object.fromEntries(projects.map((p) => [p.slug, p.title]))
const listOf = (names) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0])

// The "My Skills" desk: a big desktop computer whose screen is a little file browser. Each skill group is a
// folder in the sidebar; its skills are the files. Skills used in my projects are links: hovering (or tabbing
// to) one shows which projects in the status bar, and clicking it opens the projects page showing just those.
const skillIcons = ['✎', '</>', '{ }', 'f(x)', '⑂']
// Each folder has its own colour (and the text colour that reads on it)
const skillColors = [
  ['#2f6fd6', '#fff'],
  ['#f08fb0', '#000a1a'],
  ['#f7c948', '#000a1a'],
  ['#4fc08d', '#000a1a'],
  ['#9a7cf0', '#fff'],
]

// Scrolling through the section is a camera move: it starts on the whole desk, pushes in until the
// monitor fills the screen (and holds there so the skills can be used), then pulls back out again.
const ZOOM_IN = 0.28
const ZOOM_OUT = 0.72
const smooth = (x) => x * x * (3 - 2 * x)

function useDeskZoom() {
  const pin = useRef(null)
  const stage = useRef(null)
  const desk = useRef(null)
  const monitor = useRef(null)
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const update = () => {
      frame = 0
      const area = stage.current
      const el = desk.current
      const box = monitor.current
      const rect = pin.current.getBoundingClientRect()
      const range = rect.height - area.offsetHeight
      const t = Math.min(1, Math.max(0, -rect.top / range))
      const k = still ? 1 : smooth(Math.min(1, t / ZOOM_IN)) * smooth(Math.min(1, (1 - t) / (1 - ZOOM_OUT)))
      // Scale that shows the whole desk, and the scale that fits the monitor in the view
      const out = Math.min((area.offsetWidth * 0.94) / el.offsetWidth, (area.offsetHeight * 0.86) / el.offsetHeight)
      const fit = Math.min((area.offsetWidth * 0.94) / box.offsetWidth, (area.offsetHeight * 0.78) / box.offsetHeight)
      const scale = out + (fit - out) * k
      // The point of the desk that sits in the middle of the view: its centre, sliding to the monitor
      const fx = el.offsetWidth / 2
      const fy = el.offsetHeight / 2 + (box.offsetTop + box.offsetHeight / 2 - el.offsetHeight / 2) * k
      const x = area.offsetWidth / 2 - el.offsetLeft - scale * fx
      const y = area.offsetHeight / 2 + 32 * k - el.offsetTop - scale * fy
      el.style.transformOrigin = '0 0'
      el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
      area.style.setProperty('--title', String(1 - Math.min(1, k * 2.2)))
      // the screen's own animations only play once the camera has pushed all the way in
      el.classList.toggle('zoomed', k > 0.95)
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    if (!still) window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])
  return { pin, stage, desk, monitor }
}

// Faint moving doodles behind each folder's skills, in the folder's colour: fonts flicking for design, code
// typing itself out, braces opening and closing, a graph drawing itself and a git branch merging back in.
function Backdrop({ kind }) {
  if (kind === 0) {
    return (
      <span className="bd bd-fonts" aria-hidden="true">
        {['Aa', 'Gg', 'Rr'].map((t, n) => (
          <span key={t} className="bd-stack" style={{ '--n': n }}>
            <span>{t}</span><span>{t}</span><span>{t}</span><span>{t}</span>
          </span>
        ))}
      </span>
    )
  }
  if (kind === 1) {
    return (
      <span className="bd bd-code" aria-hidden="true">
        {[...'</>'].map((ch, k) => <span key={k} style={{ '--k': k }}>{ch}</span>)}
        <i className="caret" />
      </span>
    )
  }
  if (kind === 2) {
    return (
      <span className="bd bd-braces" aria-hidden="true">
        <span>{'{'}</span><span className="dots">···</span><span>{'}'}</span>
      </span>
    )
  }
  if (kind === 3) {
    return (
      <span className="bd bd-graph" aria-hidden="true">
        <svg viewBox="0 0 400 200">
          {[40, 100, 160, 220, 280, 340].map((x, n) => (
            <rect key={x} x={x} y={190 - (n % 3) * 20 - 30} width="28" height={(n % 3) * 20 + 30} rx="6" style={{ '--n': n }} />
          ))}
          <path pathLength="1" d="M0 150C40 150 50 70 100 70S160 130 210 110 270 20 320 40 380 80 400 60" />
        </svg>
      </span>
    )
  }
  return (
    <span className="bd bd-git" aria-hidden="true">
      <svg viewBox="0 0 400 140">
        <path className="trunk" pathLength="1" d="M10 100H390" />
        <path className="branch" pathLength="1" d="M90 100C130 100 130 30 180 30H260C310 30 310 100 350 100" />
        <circle cx="10" cy="100" r="11" />
        <circle cx="90" cy="100" r="11" />
        <circle className="late" cx="220" cy="30" r="11" />
        <circle className="late" cx="350" cy="100" r="11" />
        <circle cx="390" cy="100" r="11" />
      </svg>
    </span>
  )
}

// The wall clock: the clock face drawing with real hands on top that keep the time (the viewer's local time)
function WallClock() {
  const hour = useRef(null)
  const minute = useRef(null)
  const second = useRef(null)
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const s = now.getSeconds()
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60
      hour.current.style.transform = `rotate(${(h * 30).toFixed(2)}deg)`
      minute.current.style.transform = `rotate(${(m * 6).toFixed(2)}deg)`
      second.current.style.transform = `rotate(${s * 6}deg)`
    }
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="decor decor-clock">
      <img src="/desk_decor/wall-clock-face.svg" alt="" loading="lazy" />
      <svg viewBox="0 0 375 375">
        <g ref={hour} className="hand hour"><rect x="183.5" y="112" width="8" height="84" rx="4" /></g>
        <g ref={minute} className="hand minute"><rect x="184.5" y="78" width="6" height="118" rx="3" /></g>
        <g ref={second} className="hand second">
          <rect x="186.2" y="66" width="2.6" height="140" rx="1.3" />
          <circle cx="187.5" cy="187.5" r="6" />
        </g>
        <circle cx="187.5" cy="187.5" r="5" className="hub" />
      </svg>
    </span>
  )
}

function SkillsDesk() {
  const { pin, stage, desk, monitor } = useDeskZoom()
  const groups = Object.entries(skills)
  const [open, setOpen] = useState(0)
  const [active, setActive] = useState(null)
  const [group, items] = groups[open]
  const used = active && skillProjects[active]
  return (
    <div className="desk-pin" ref={pin}>
      <div className="desk-stage" ref={stage}>
        <div className="desk-title">
          <Title en="My Skills" de="Meine Fähigkeiten" />
        </div>
    <div className="desk" ref={desk} translate="no">
      <div className="desk-wall" aria-hidden="true">
        {[
          ['bottle', 'water'],
          ['coffee', 'coffee'],
          ['pens', 'penholder'],
          ['plant', 'plant'],
        ].map(([cls, file]) => (
          <img key={cls} className={`decor decor-${cls}`} src={`/desk_decor/${file}.svg`} alt="" loading="lazy" />
        ))}
        <WallClock />
        {/* the lamp: the switched-off drawing with the lit one on top, which flickers on and off */}
        <span className="decor decor-lamp">
          <img src="/desk_decor/lamp_off.svg" alt="" loading="lazy" />
          <img className="lamp-on" src="/desk_decor/lamp.svg" alt="" loading="lazy" />
        </span>
      </div>

      <div className="monitor" ref={monitor}>
        <div className="monitor-bezel">
          <div className="screen" style={{ '--c': skillColors[open % skillColors.length][0], '--on': skillColors[open % skillColors.length][1] }}>
            <div className="screen-window">
            <div className="screen-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="screen-path">anja / skills / {group.toLowerCase()}</span>
            </div>
            <div className="screen-body">
              <nav className="screen-side" aria-label="Skill groups">
                {groups.map(([name], k) => (
                  <button
                    key={name}
                    type="button"
                    className={k === open ? 'on' : undefined}
                    style={{ '--c': skillColors[k % skillColors.length][0], '--on': skillColors[k % skillColors.length][1] }}
                    aria-pressed={k === open}
                    onClick={() => {
                      setOpen(k)
                      setActive(null)
                    }}
                  >
                    <span className="side-icon" aria-hidden="true">{skillIcons[k % skillIcons.length]}</span>
                    <span className="side-name">{name}</span>
                  </button>
                ))}
              </nav>
              <div className="screen-main" key={group}>
                <Backdrop kind={open % 5} />
                <h3>{group}</h3>
                <ul>
                  {items.map((s, k) => (
                    <li key={s} className={skillProjects[s] ? 'linked' : undefined} style={{ '--k': k }}>
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
              </div>
            </div>
            </div>
            <p className={`screen-status${used ? ' on' : ''}`} aria-live="polite">
              {used ? (
                <>
                  <strong>{active}</strong>{' in '}
                  {used.length === projects.length ? 'all my projects' : listOf(used.map((slug) => projectTitle[slug]))}
                </>
              ) : (
                <>
                  <span className="hover-only">hover a skill to see where I used it</span>
                  <span className="touch-only">tap a skill to see where I used it</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="monitor-neck" aria-hidden="true" />
        <div className="monitor-foot" aria-hidden="true" />
      </div>

      <div className="desk-furniture" aria-hidden="true">
        <i className="desk-leg back left" />
        <i className="desk-leg back right" />
        <i className="desk-leg front left" />
        <i className="desk-leg front right" />
        <i className="desk-apron" />
        <i className="desk-slab" />
      </div>
    </div>
      </div>
    </div>
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

// Hanging ID badge with the profile photo. It flips over when you click (or tap / press Enter) to show the back of the card.
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
      aria-label="ID badge for Anja van Staden. Click to flip it over."
      onClick={flip}
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
          {/* the back of a real access card: magnetic stripe, the areas this card opens, a signature
              strip, and a barcode with the card number */}
          <span className="badge-stripe" aria-hidden="true" />
          <div className="badge-back-main" aria-hidden="true">
            <span className="badge-seal"><img src="/favicon.svg" alt="" /></span>
            <ul className="badge-back-info">
              <li><small>Based in</small>Stellenbosch, ZA</li>
              <li><small>Moving to</small>Germany</li>
              <li><small>Valid from</small>2027</li>
            </ul>
          </div>
          <span className="badge-signature" aria-hidden="true">
            <span className="pen">Anja van Staden</span>
            <small>Authorised signature</small>
          </span>
          <span className="badge-back-foot" aria-hidden="true">
            <span className="badge-barcode small" />
            <span>ID 2027-0001</span>
          </span>
          <p className="badge-small-print">If found, please return to Germany (from 2027)</p>
        </div>
      </div>
    </div>
  )
}

// The text side of the hero. It is drawn twice: once for real, and once as the blueprint under it (`copy`),
// where elements carry their name and the code behind them for the blueprint's labels (see Blueprint.jsx).
function HeroText({ copy = false }) {
  const bp = (name, code) => (copy ? { 'data-bp': name, ...(code && { 'data-code': code }) } : {})
  const Name = copy ? 'div' : 'h1'
  return (
    <div className={`hero-text${copy ? ' bp-copy' : ''}`}>
      <Name className="hero-name" {...bp('h1.hero-name', '<h1 className="hero-name">Anja</h1>')}>
        <Split text="Anja" />
        <Split text="van Staden" className="accent-line" offset={4} />
      </Name>
      <p className="hero-role hero-fade" style={{ '--d': '700ms' }} {...bp('p.hero-role')}>
        UI/UX designer <span className="pen amp">&amp;</span> software engineer
      </p>
      <p className="pen hero-note write" style={{ '--d': '1100ms' }} {...bp('p.hero-note')}>
        designer at heart, software engineer by degree
        <Underline className="draw" />
      </p>
      {copy ? (
        <div className="hero-actions">
          <span className="button primary" {...bp('Button/primary', '<Link to="/projects" />')}>View projects</span>
          <span className="button">Get in touch</span>
        </div>
      ) : (
        <div className="hero-actions hero-fade" style={{ '--d': '950ms' }}>
          <Link to="/projects" className="button primary">View projects</Link>
          <Link to="/#contact" className="button">Get in touch</Link>
        </div>
      )}
      {copy && (
        <div className="bp-palette">
          {[['--ink', '#000A1A'], ['--blue', '#0E4798'], ['--pink', '#DFA4B8'], ['--butter', '#F7DE93'], ['--cream', '#FBF8F1']].map(([name, value]) => (
            <span key={name}>
              <i style={{ background: value }} />
              {name} <b>{value}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Hero() {
  return (
    <section className="hero">
      <HeroText />

      <div className="hero-visual">
        <div className="photo-blob" aria-hidden="true" />
        <IdBadge />
        <Sparkle className="s1" />
        <Sparkle className="s2" />
        <Sparkle className="s3" />
      </div>

      {/* Under it all, its blueprint: move the mouse over the hero to look through (see Blueprint.jsx) */}
      <Blueprint>
        <HeroText copy />
      </Blueprint>
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

      <section id="skills" className="skills-section">
        <SkillsDesk />
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
            <span className="pop" style={{ '--d': '440ms', '--from': '60px' }}>
              <a href={contact.cv} download className="social cv">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download my CV
              </a>
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
