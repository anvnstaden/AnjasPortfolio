import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import { Sparkle, Underline } from '../components/Doodles.jsx'
import { projects } from '../data/content.js'

// Number of placeholder slots shown until a project has screenshots.
const PLACEHOLDER_SLOTS = 3

const pad = (n) => String(n).padStart(2, '0')

function Gallery({ project, onOpen }) {
  const [active, setActive] = useState(0)
  const images = project.images
  const slots = images.length ? images : Array(PLACEHOLDER_SLOTS).fill(null)
  const current = slots[active]
  const step = (d) => setActive((a) => (a + d + slots.length) % slots.length)

  return (
    <div className="visual gallery">
      <figure className="frame">
        <div className="frame-bar">
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="frame-count">{active + 1} / {slots.length}</span>
        </div>
        <div className="frame-view">
          {current ? (
            <button type="button" className="frame-image" onClick={() => onOpen(images, active)}>
              <img src={current.src} alt={current.caption || `${project.title} screenshot ${active + 1}`} loading="lazy" />
            </button>
          ) : (
            <div className="frame-empty">
              <span>Screenshot {active + 1}</span>
              <span className="pen">coming soon!</span>
            </div>
          )}
          {slots.length > 1 && (
            <>
              <button type="button" className="frame-nav prev" onClick={() => step(-1)} aria-label="Previous screenshot">←</button>
              <button type="button" className="frame-nav next" onClick={() => step(1)} aria-label="Next screenshot">→</button>
            </>
          )}
        </div>
        {current?.caption && <figcaption>{current.caption}</figcaption>}
      </figure>
      <div className="thumbs">
        {slots.map((img, i) => (
          <button
            type="button"
            key={img?.src ?? i}
            className={i === active ? 'active' : ''}
            onClick={() => setActive(i)}
            aria-label={`Show screenshot ${i + 1}`}
          >
            {img ? <img src={img.src} alt="" loading="lazy" /> : <span>{i + 1}</span>}
          </button>
        ))}
      </div>
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

// A cartoon hand pointing left, used to tap the "Get in touch" button.
function PointingHand({ className }) {
  return (
    <svg className={className} viewBox="0 0 124 72" aria-hidden="true">
      <path d="M88 10h28a4 4 0 0 1 4 4v42a4 4 0 0 1-4 4H88Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M90 14H60c-8 0-14 5-16 12H14a9 9 0 0 0 0 18h30c2 8 8 14 17 14h29Z"
        fill="#f6c9a8"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M58 44h22M58 51h20M60 26c6-6 16-6 22-2" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 30c4 0 6 2 6 5" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
        <article id={p.slug} key={p.slug} className={`project-entry${i % 2 ? ' flip' : ''}`}>
          <span className="entry-bignum" aria-hidden="true">{pad(i + 1)}</span>
          <div className="project-info">
            <div className="project-top">
              <p className="card-kind">{p.kind}</p>
              {p.meta && <span className="project-meta">{p.meta}</span>}
            </div>
            <h2 className="entry-title">
              <Split text={p.title} />
              {p.note && <span className="pen entry-note">{p.note}</span>}
            </h2>
            <p>{p.description}</p>
            <ul className="tags">
              {p.tags.map((t, j) => (
                <li key={t} style={{ '--t': j }}>{t}</li>
              ))}
            </ul>
            {p.link && (
              <a href={p.link} className="text-link" target="_blank" rel="noreferrer">View project ↗</a>
            )}
          </div>
          {p.gui === false ? (
            <Highlights project={p} />
          ) : (
            <Gallery project={p} onOpen={(images, index) => setZoomed({ images, index })} />
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
