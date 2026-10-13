import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
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
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={`Switch to ${next} mode`}>
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
    </button>
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

// Which nav link the visitor is "at": on the home page it follows the section in the middle of the
// screen as you scroll (the journey counts as About); on the projects page it's always Projects.
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
      setCurrent('projects')
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

function App() {
  const location = useLocation()
  useScrollOnNavigate(location)
  useReveal(location.pathname)
  useTilt()
  const scrolled = useScrolled()
  const current = useCurrentSection(location.pathname)
  const header = useRef(null)
  const [menuOpen, setMenuOpen] = useMenu(header)
  // Each link gets a little handwritten German note that writes itself in on hover
  const link = (id) => `nav-link link-${id}${current === id ? ' current' : ''}`

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header ref={header} className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="nav-logo" aria-label="Anja van Staden, home">
          <img src="/favicon.svg" alt="" />
        </Link>
        <nav id="site-menu" onClick={(e) => e.target.closest('a') && setMenuOpen(false)}>
          <Link to="/#about" className={link('about')}>
            About Me<span className="nav-de pen" lang="de" aria-hidden="true">über mich</span>
          </Link>
          <Link to="/projects" className={link('projects')}>
            My Projects<span className="nav-de pen" lang="de" aria-hidden="true">meine Projekte</span>
          </Link>
          <Link to="/#skills" className={link('skills')}>
            My Skills<span className="nav-de pen" lang="de" aria-hidden="true">Fähigkeiten</span>
          </Link>
          <Link to="/#contact" className={`nav-cta${current === 'contact' ? ' current' : ''}`}>
            Contact Me<span className="nav-de pen" lang="de" aria-hidden="true">Kontaktieren Sie mich</span>
          </Link>
        </nav>
        <ThemeToggle />
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span aria-hidden="true" />
        </button>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <footer className="footer">
        © {new Date().getFullYear()} Anja van Staden · Stellenbosch, South Africa
      </footer>
    </>
  )
}

export default App
