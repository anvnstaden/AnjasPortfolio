import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
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

// Adds .in to animated elements (.reveal, pen .write text and .draw strokes) as they scroll into view.
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
      { rootMargin: '0px 0px -10% 0px' },
    )
    document.querySelectorAll('.reveal:not(.in), .write:not(.in), .draw:not(.in)').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
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

function App() {
  const location = useLocation()
  useScrollOnNavigate(location)
  useReveal(location.pathname)
  useTilt()
  const scrolled = useScrolled()

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo" aria-label="Anja van Staden, home">
          <img src="/favicon.svg" alt="" />
        </Link>
        <nav>
          <Link to="/#about" className="nav-link">About</Link>
          <NavLink to="/projects" className="nav-link">Projects</NavLink>
          <Link to="/#skills" className="nav-link">Skills</Link>
          <Link to="/#contact" className="nav-cta">Contact</Link>
          <ThemeToggle />
        </nav>
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
