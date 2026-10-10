import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import { PointingHand, Sparkle, Underline } from '../components/Doodles.jsx'
import { projects } from '../data/content.js'

// Number of placeholder slots shown until a project has screenshots.
const PLACEHOLDER_SLOTS = 3

const pad = (n) => String(n).padStart(2, '0')

// Horizontal carousel of screenshots. Every slide keeps its screenshot's own proportions (nothing is
// cropped), the active one sits in the middle and its neighbours fade out towards the page background.
function Carousel({ project, onOpen }) {
  const [active, setActive] = useState(0)
  const swipe = useRef({ x: null, moved: false })
  const images = project.images
  const slots = images.length ? images : Array(PLACEHOLDER_SLOTS).fill(null)
  const go = (i) => setActive(Math.min(slots.length - 1, Math.max(0, i)))
  const current = slots[active]

  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, moved: false }
  }
  const onPointerUp = (e) => {
    const { x } = swipe.current
    if (x !== null && Math.abs(e.clientX - x) > 50) {
      swipe.current.moved = true
      go(active + (e.clientX < x ? 1 : -1))
    }
  }
  const onSlide = (img, i) => {
    if (swipe.current.moved) return
    if (i !== active) go(i)
    else if (img) onOpen(images, i)
  }

  return (
    <div
      className="visual carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={`${project.title} screenshots`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(active + 1)
        if (e.key === 'ArrowLeft') go(active - 1)
      }}
    >
      <div className="carousel-stage">
        <div className="carousel-view" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <ul className="carousel-track" style={{ '--i': active }}>
            {slots.map((img, i) => (
              <li key={img?.src ?? i} className={i === active ? 'slide active' : 'slide'}>
                <button
                  type="button"
                  className="slide-btn"
                  tabIndex={i === active ? 0 : -1}
                  aria-label={i === active ? (img ? 'Open this screenshot full size' : `Screenshot ${i + 1}`) : `Show screenshot ${i + 1}`}
                  onClick={() => onSlide(img, i)}
                >
                  {img ? (
                    <img src={img.src} alt={img.caption || `${project.title} screenshot ${i + 1}`} loading="lazy" draggable="false" />
                  ) : (
                    <span className="slide-empty">
                      <span>Screenshot {i + 1}</span>
                      <span className="pen">coming soon!</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {slots.length > 1 && (
          <>
            <button type="button" className="carousel-nav prev" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous screenshot">←</button>
            <button type="button" className="carousel-nav next" onClick={() => go(active + 1)} disabled={active === slots.length - 1} aria-label="Next screenshot">→</button>
          </>
        )}
      </div>
      <p className="carousel-caption" aria-live="polite">{current?.caption}</p>
      {slots.length > 1 && (
        <div className="carousel-dots">
          <span className="carousel-count">{active + 1} / {slots.length}</span>
          {slots.map((img, i) => (
            <button
              type="button"
              key={img?.src ?? i}
              className={i === active ? 'active' : ''}
              onClick={() => go(i)}
              aria-label={`Show screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// For projects without a user interface: key points in a terminal-style window.
function Highlights({ project }) {
  const language = project.kind.split(' · ')[0]
  return (
    <div className="visual terminal">
      <div className="frame-bar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="frame-count">{language} · command line</span>
      </div>
      <div className="terminal-body">
        <p className="terminal-head">{'// under the hood'}</p>
        <ul>
          {project.highlights.map((h, i) => (
            <li key={h} style={{ '--t': i }}>{h}</li>
          ))}
        </ul>
        <span className="cursor" aria-hidden="true" />
      </div>
      <span className="pen no-gui">no GUI, all logic!</span>
    </div>
  )
}

function Lightbox({ open, onClose }) {
  const dialog = useRef(null)
  const [index, setIndex] = useState(open?.index ?? 0)
  const images = open?.images ?? []

  useEffect(() => {
    if (open) dialog.current.showModal()
  }, [open])

  const step = (d) => setIndex((i) => (i + d + images.length) % images.length)
  const image = images[index]

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
    >
      {image && (
        <>
          <img src={image.src} alt={image.caption || ''} />
          <div className="lightbox-bar">
            <button type="button" onClick={() => step(-1)} aria-label="Previous screenshot">←</button>
            <span>{image.caption || `${index + 1} / ${images.length}`}</span>
            <button type="button" onClick={() => step(1)} aria-label="Next screenshot">→</button>
          </div>
          <button type="button" className="lightbox-close" onClick={() => dialog.current.close()} aria-label="Close">×</button>
        </>
      )}
    </dialog>
  )
}

// Two cartoon eyes that blink and follow the pointer around the page.
function PeekingEyes() {
  const eyes = useRef(null)

  useEffect(() => {
    const look = (e) => {
      const el = eyes.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, dist / 300) * 10
      el.style.setProperty('--px', `${(dx / dist) * reach}px`)
      el.style.setProperty('--py', `${(dy / dist) * reach}px`)
    }
    window.addEventListener('pointermove', look, { passive: true })
    return () => window.removeEventListener('pointermove', look)
  }, [])

  return (
    <div className="eyes" ref={eyes} aria-hidden="true">
      <span className="eye"><span className="pupil" /></span>
      <span className="eye"><span className="pupil" /></span>
    </div>
  )
}

// Toggles .shown on each project as it enters and leaves the viewport, so it animates both ways.
function useInOutView(selector) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('shown', e.isIntersecting)),
      { rootMargin: '-12% 0px -12% 0px' },
    )
    document.querySelectorAll(selector).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}

export default function Projects() {
  const [zoomed, setZoomed] = useState(null)
  useInOutView('.project-entry')

  return (
    <main className="projects-page">
      <header className="projects-head">
        <h1 className="ph-title title reveal">
          <Split text="All the cool things I've" className="ph-line" />
          <span className="ph-line">
            <span className="ph-box">
              <Split text="built" offset={10} />
            </span>
            <span className="ph-de pen write" lang="de">
              was ich gebaut habe
              <Underline className="draw" />
            </span>
          </span>
        </h1>
        <div className="ph-sticker" aria-hidden="true">
          <strong>{projects.length}</strong>
          <span>projects</span>
        </div>
        <Sparkle className="ph-spark a" />
        <Sparkle className="ph-spark b" />
        <p className="reveal">
          These are all my solo and group projects I have completed during University, spanning UI design, frontend, full-stack, networking and systems,
          newest first.
        </p>
        <ol className="project-index">
          {projects.map((p, i) => (
            <li key={p.slug} className="reveal" style={{ '--d': `${i * 40}ms` }}>
              <a href={`#${p.slug}`}>
                <span>{pad(i + 1)}</span> {p.title}
                {p.gui === false && <em>no GUI</em>}
              </a>
            </li>
          ))}
        </ol>
      </header>

      {projects.map((p, i) => (
        <article
          id={p.slug}
          key={p.slug}
          className={`project-entry${p.gui === false ? (i % 2 ? ' flip' : '') : ' wide'}`}
        >
          <span className="entry-bignum" aria-hidden="true">{pad(i + 1)}</span>
          <div className="project-info">
            <div className="project-head">
              <div className="project-top">
                <p className="card-kind">{p.kind}</p>
                <div className="project-badges">
                  {p.mark && (
                    <span className={`project-mark${p.mark === 'TBA' ? ' pending' : ''}`}>
                      {p.mark === 'TBA' ? 'Mark: TBA · in progress' : <>Mark <strong>{p.mark}</strong></>}
                    </span>
                  )}
                  {p.meta && <span className="project-meta">{p.meta}</span>}
                </div>
              </div>
              <h2 className="entry-title">
                <Split text={p.title} />
                {p.note && <span className="pen entry-note">{p.note}</span>}
              </h2>
            </div>
            <div className="project-body">
              <p>{p.description}</p>
              {p.theme && <p className="project-theme">{p.theme}</p>}
              <ul className="tags">
                {p.tags.map((t, j) => (
                  <li key={t} style={{ '--t': j }}>{t}</li>
                ))}
              </ul>
              {p.link && (
                <a href={p.link} className="text-link" target="_blank" rel="noreferrer">View project ↗</a>
              )}
            </div>
          </div>
          {p.gui === false ? (
            <Highlights project={p} />
          ) : (
            <Carousel project={p} onOpen={(images, index) => setZoomed({ images, index })} />
          )}
        </article>
      ))}

      <section className="cta">
        <div className="cta-card reveal pop" style={{ '--r': '-6deg' }}>
          <PeekingEyes />
          <h2 className="cta-title">
            Like what you <mark className="hl">see</mark>?
          </h2>
          <p className="pen cta-de write" lang="de">Gefällt es dir? Dann schreib mir!</p>
          <div className="cta-action">
            <Link to="/#contact" className="button primary big tap">Get in touch</Link>
            <PointingHand className="finger" />
          </div>
        </div>
      </section>

      <Lightbox key={zoomed ? `${zoomed.images[0].src}-${zoomed.index}` : 'closed'} open={zoomed} onClose={() => setZoomed(null)} />
    </main>
  )
}
