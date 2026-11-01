import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import PenCursor from './components/PenCursor.jsx'
import { LANGUAGES, useLang } from './i18n.js'
import './App.css'

// Scrolls to the top on page change, or to #section when the link has one.
function useScrollOnNavigate(location) {
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])
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
// screen as you scroll (the journey counts as About); on a projects page it's that page's link.
const SECTION_LINKS = [
  ['about', 'about'],
  ['journey', 'about'],
  ['work', 'projects'],
  ['skills', 'skills'],
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

// Link, name, and the section it marks as current
const PROJECT_SIGNS = [
  ['/projects', 'university', 'projects'],
  ['/projects/personal', 'personal', 'personal'],
]

// The Projects tab: opens its dropdown on hover with a mouse, on tap on a touch screen and on Enter from the keyboard.
function ProjectsMenu({ current }) {
  const { t } = useLang()
  const root = useRef(null)
  const [open, setOpen] = useMenu(root)
  const onMouse = (value) => (e) => e.pointerType === 'mouse' && setOpen(value)
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
        onClick={() => setOpen(matchMedia('(hover: hover)').matches || !open)}
      >
        <span className="nav-drop-label">
          {t.nav.projects}
          <svg className="nav-caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.5 6 6l4.5-4.5" /></svg>
        </span>
      </button>
      <div id="projects-menu" className="nav-drop-menu" onClick={() => setOpen(false)}>
        {/* a road sign: two plates, one above the other on the same string */}
        <div className="nav-sign">
          {PROJECT_SIGNS.map(([to, id, section]) => (
            <Link key={id} to={to} className={`nav-drop-item${current === section ? ' current' : ''}`}>
              {t.nav[id]}
              <svg className="nav-plate-arrow" viewBox="0 0 16 12" aria-hidden="true"><path d="M1 6h13M9.5 1.5 14 6l-4.5 4.5" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const { t } = useLang()
  const location = useLocation()
  useScrollOnNavigate(location)
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
      <header ref={header} className={`nav${scrolled ? ' scrolled' : ''}${hidden && !menuOpen ? ' hidden' : ''}${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="nav-charm nav-logo" aria-label={t.nav.home}>
          <span className="charm-knob"><img src="/favicon.svg" alt="" /></span>
        </Link>
        <nav id="site-menu" onClick={(e) => e.target.closest('a') && setMenuOpen(false)}>
          <Link to="/#about" className={link('about')}>{t.nav.about}</Link>
          <ProjectsMenu current={current} />
          <Link to="/#skills" className={link('skills')}>{t.nav.skills}</Link>
          <Link to="/#contact" className={`nav-cta${current === 'contact' ? ' current' : ''}`}>{t.nav.contact}</Link>
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
