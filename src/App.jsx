import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import PenCursor from './components/PenCursor.jsx'
import NavTrip from './components/NavTrip.jsx'
import { Circle } from './components/Doodles.jsx'
import { LANGUAGES, useLang } from './i18n.js'
import './App.css'

// Scrolls to #section when the address has one, or else to the top
function scrollToPlace(hash, behavior) {
  if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior })
  else window.scrollTo({ top: 0, behavior })
}

// How long, at most, a section just arrived at on a new page is held in place while the page settles
const SETTLE = 2000

// Scrolls to the top on page change, or to #section when the link has one. Returns a function that makes the next one
// go straight there instead of scrolling, for under a nav link's trip (see useNavTrip).
// Arriving at a section of another page (e.g. /#contact from the projects page), the home page's scroll scenes are
// still sizing themselves, which pushes everything below them down, so the section is held at the top of the screen
// as the page grows, until it settles, the visitor scrolls themselves, or SETTLE runs out.
function useScrollOnNavigate(location) {
  const straight = useRef(false)
  const page = useRef(location.pathname)
  useEffect(() => {
    const newPage = page.current !== location.pathname
    page.current = location.pathname
    scrollToPlace(location.hash, straight.current || newPage ? 'instant' : 'auto')
    straight.current = false

    const target = newPage && location.hash && document.getElementById(location.hash.slice(1))
    if (!target) return
    const hold = new ResizeObserver(() => target.scrollIntoView({ behavior: 'instant' }))
    hold.observe(document.body)
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    const stop = () => {
      hold.disconnect()
      clearTimeout(timer)
      inputs.forEach((type) => window.removeEventListener(type, stop))
    }
    const timer = setTimeout(stop, SETTLE)
    inputs.forEach((type) => window.addEventListener(type, stop, { passive: true }))
    return stop
  }, [location.pathname, location.hash])
  return () => {
    straight.current = true
  }
}

// Adds .in to animated elements (.reveal, pen .write text, .draw strokes and sliding sections) as they
// scroll into view. Elements added later (e.g. after a layout switch or
// a hot reload) are picked up too, so nothing gets stuck hidden. The watched area reaches a full screen
// width past each side, so sections that start off to the side still count as scrolled into view.
const ANIMATED = '.reveal:not(.in), .write:not(.in), .draw:not(.in), .slide-section:not(.in)'

function useReveal(pathname) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 100% -10% 100%' },
    )
    const watch = (root) => {
      if (root.matches?.(ANIMATED)) observer.observe(root)
      root.querySelectorAll?.(ANIMATED).forEach((el) => observer.observe(el))
    }
    watch(document)
    const added = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach(watch)
    })
    added.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      added.disconnect()
    }
  }, [pathname])
}

// Tilts any .tilt element towards the mouse.
function useTilt() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    let current = null
    const reset = () => {
      current?.style.removeProperty('--rx')
      current?.style.removeProperty('--ry')
      current = null
    }
    const move = (e) => {
      const el = e.target.closest?.('.tilt.in')
      if (el !== current) reset()
      if (!el) return
      current = el
      const r = el.getBoundingClientRect()
      el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`)
      el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', reset)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', reset)
    }
  }, [])
}

function ThemeToggle() {
  const { t } = useLang()
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const next = theme === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage unavailable (private mode); the choice just won't be remembered.
    }
    setTheme(next)
  }

  return (
    <button type="button" className="nav-charm theme-toggle" onClick={toggle} aria-label={t.nav.theme(next)}>
      <span className="charm-knob">
        <svg key={theme} viewBox="0 0 24 24" aria-hidden="true">
          {theme === 'dark' ? (
            <>
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
            </>
          ) : (
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
          )}
        </svg>
      </span>
    </button>
  )
}

// The language switch: a segmented control hanging off the rail, with a bubble that slides to the current language.
function LanguageSwitch() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="nav-charm lang-switch" role="group" aria-label={t.nav.language}>
      <span className="charm-knob" style={{ '--at': LANGUAGES.findIndex((l) => l.code === lang) }}>
        <span className="lang-bubble" aria-hidden="true" />
        {LANGUAGES.map(({ code, label, name }) => (
          <button
            key={code}
            type="button"
            lang={code}
            className={code === lang ? 'on' : undefined}
            aria-pressed={code === lang}
            aria-label={name}
            onClick={() => setLang(code)}
          >
            {label}
          </button>
        ))}
      </span>
    </div>
  )
}

// True once the page has scrolled a little, so the nav can tighten up.
function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

// True while scrolling down, so the nav slides out of the way; scrolling up brings it straight back. It always
// stays near the top of the page. Small movements are ignored so a shaky trackpad doesn't make it flicker.
function useHiddenOnScrollDown(offset = 120, slack = 8) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < offset) setHidden(false)
      else if (Math.abs(y - last) < slack) return
      else setHidden(y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset, slack])
  return hidden
}

// Which nav link the visitor is "at": on the home page it follows the section in the middle of the
// screen as you scroll (the facts and the journey count as About); on a projects page it's that page's link.
// Listed in page order, since the last one that has reached the middle wins.
const SECTION_LINKS = [
  ['about', 'about'],
  ['work', 'projects'],
  ['skills', 'skills'],
  ['facts', 'about'],
  ['journey', 'about'],
  ['contact', 'contact'],
]

function useCurrentSection(pathname) {
  const [current, setCurrent] = useState('')
  useEffect(() => {
    if (pathname.startsWith('/projects')) {
      setCurrent(pathname.startsWith('/projects/personal') ? 'personal' : 'projects')
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight * 0.45
      let found = ''
      for (const [id, link] of SECTION_LINKS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) found = link
      }
      // At the very bottom the contact section may never reach the middle, so count it as reached
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) found = 'contact'
      setCurrent(found)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])
  return current
}

// Open/closed state for the phone menu. It closes on Escape and on a tap outside the nav (links close it
// themselves, see the nav's onClick).
function useMenu(header) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onTap = (e) => header.current?.contains(e.target) || setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onTap)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onTap)
    }
  }, [open, header])
  return [open, setOpen]
}

// A link's name, with a pen ring round it when it's the page you're on (shown in the phone menu)
function NavLabel({ current, children }) {
  return (
    <span className="nav-label">
      {children}
      {current && <Circle className="nav-ring" />}
    </span>
  )
}

// Link, name, the section it marks as current, and its little icon (a graduation cap, a heart)
const PROJECT_SIGNS = [
  [
    '/projects',
    'university',
    'projects',
    <>
      <path d="M2 9.5 12 5l10 4.5-10 4.5z" />
      <path d="M6.5 11.8V16c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2M21 10v5" />
    </>,
  ],
  [
    '/projects/personal',
    'personal',
    'personal',
    <path d="M12 19.5s-7.5-4.4-7.5-9.7A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4c0 5.3-7.5 9.7-7.5 9.7z" />,
  ],
]

// The Projects tab: opens its dropdown on hover with a mouse, on tap on a touch screen and on Enter from the keyboard.
// In the phone menu it's a tag like the others, and tapping it drops the sign down underneath it (or folds it away).
const WIDE = '(min-width: 901px)'

function ProjectsMenu({ current }) {
  const { t } = useLang()
  const root = useRef(null)
  const [open, setOpen] = useMenu(root)
  const onMouse = (value) => (e) => e.pointerType === 'mouse' && matchMedia(WIDE).matches && setOpen(value)
  const onCurrent = current === 'projects' || current === 'personal'

  return (
    <div
      ref={root}
      className={`nav-drop${open ? ' open' : ''}`}
      onPointerEnter={onMouse(true)}
      onPointerLeave={onMouse(false)}
      onBlur={(e) => root.current.contains(e.relatedTarget) || setOpen(false)}
    >
      <button
        type="button"
        className={`nav-link link-projects${onCurrent ? ' current' : ''}`}
        aria-expanded={open}
        aria-controls="projects-menu"
        onClick={() => setOpen(matchMedia(`${WIDE} and (hover: hover)`).matches || !open)}
      >
        <span className="nav-drop-label">
          <NavLabel current={onCurrent}>{t.nav.projects}</NavLabel>
          <svg className="nav-caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.5 6 6l4.5-4.5" /></svg>
        </span>
      </button>
      <div id="projects-menu" className="nav-drop-menu" onClick={() => setOpen(false)}>
        {/* a road sign: two plates, one above the other on the same string (the fold is what the phone menu
            opens and shuts) */}
        <div className="nav-fold">
          <div className="nav-sign">
            {PROJECT_SIGNS.map(([to, id, section, icon]) => (
              <Link key={id} to={to} data-trip={id} className={`nav-drop-item${current === section ? ' current' : ''}`}>
                <span className="nav-plate-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{icon}</svg></span>
                <NavLabel current={current === section}>{t.nav[id]}</NavLabel>
                <svg className="nav-plate-arrow" viewBox="0 0 16 12" aria-hidden="true"><path d="M1 6h13M9.5 1.5 14 6l-4.5 4.5" /></svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// True when a link goes to the part of the page you're already looking at, so there's nowhere to take you
function alreadyAt(location, to) {
  const { pathname, hash } = new URL(to, window.location.href)
  if (pathname !== location.pathname) return false
  const el = hash && document.getElementById(hash.slice(1))
  if (!el) return window.scrollY < 1
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const end = document.documentElement.scrollHeight - window.innerHeight
  return Math.abs(Math.min(window.scrollY + el.getBoundingClientRect().top - pad, end) - window.scrollY) < 2
}

// Links marked data-trip (the nav's, and the hero's buttons) take you where they go on a trip: rather than scroll all
// the way there, past every section in between, a sheet of paper covers the page while it jumps there (see NavTrip.jsx).
// The value names the note written on it. Returns the trip under way ({ key, to, note }) or null, the jump and the end
// of the trip.
function useNavTrip(location, goStraight) {
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)

  const jump = (to) => {
    const { pathname, hash } = new URL(to, window.location.href)
    if (pathname === location.pathname && hash === location.hash) {
      scrollToPlace(hash, 'instant')
    } else {
      goStraight()
      navigate(to)
    }
  }

  const onClick = useEffectEvent((e) => {
    const link = e.target.closest?.('a[data-trip]')
    const to = link?.getAttribute('href')
    // opening it in a new tab or window is left to the browser, and so is a link to where you already are
    if (!to || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || alreadyAt(location, to)) return
    e.preventDefault()
    if (trip) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) jump(to)
    else setTrip({ key: Date.now(), to, note: link.dataset.trip })
  })
  // Listening on the whole document as the click comes down, it's in before the link's own navigation
  useEffect(() => {
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return [trip, jump, () => setTrip(null)]
}

function App() {
  const { t } = useLang()
  const location = useLocation()
  const goStraight = useScrollOnNavigate(location)
  const [trip, jump, endTrip] = useNavTrip(location, goStraight)
  useReveal(location.pathname)
  useTilt()
  const scrolled = useScrolled()
  const hidden = useHiddenOnScrollDown()
  const current = useCurrentSection(location.pathname)
  const header = useRef(null)
  const [menuOpen, setMenuOpen] = useMenu(header)
  const link = (id) => `nav-link link-${id}${current === id ? ' current' : ''}`

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <PenCursor />
      {trip && <NavTrip key={trip.key} to={trip.to} note={t.nav.trips[trip.note]} onCovered={() => jump(trip.to)} onDone={endTrip} />}
      <header ref={header} className={`nav${scrolled ? ' scrolled' : ''}${hidden && !menuOpen ? ' hidden' : ''}${menuOpen ? ' open' : ''}`}>
        <Link to="/" data-trip="home" className="nav-charm nav-logo" aria-label={t.nav.home} onClick={() => setMenuOpen(false)}>
          <span className="charm-knob"><img src="/favicon.svg" alt="" /></span>
        </Link>
        <nav id="site-menu" onClick={(e) => e.target.closest('a') && setMenuOpen(false)}>
          <Link to="/#about" data-trip="about" className={link('about')}><NavLabel current={current === 'about'}>{t.nav.about}</NavLabel></Link>
          <ProjectsMenu current={current} />
          <Link to="/#skills" data-trip="skills" className={link('skills')}><NavLabel current={current === 'skills'}>{t.nav.skills}</NavLabel></Link>
          <Link to="/#contact" data-trip="contact" className={`nav-cta${current === 'contact' ? ' current' : ''}`}><NavLabel current={current === 'contact'}>{t.nav.contact}</NavLabel></Link>
        </nav>
        {/* Site settings hang here as .nav-charm buttons */}
        <div className="nav-prefs">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          <span aria-hidden="true" />
        </button>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects key="university" page="university" />} />
        <Route path="/projects/personal" element={<Projects key="personal" page="personal" />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <footer className="footer">
        © {new Date().getFullYear()} Anja van Staden · {t.footer}
      </footer>
    </>
  )
}

export default App
