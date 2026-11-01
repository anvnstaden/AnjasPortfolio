import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Split from '../components/Split.jsx'
import Media from '../components/Media.jsx'
import QuoteForm from '../components/QuoteForm.jsx'
import { NavArrow, PointingHand, Sparkle } from '../components/Doodles.jsx'
import { skillProjects } from '../data/content.js'
import { useLang } from '../i18n.js'

// Number of placeholder slots shown until a project has screenshots.
const PLACEHOLDER_SLOTS = 3

const pad = (n) => String(n).padStart(2, '0')

// German grade for a percentage, using the modified Bavarian formula with a 50% pass mark. Like German
// universities it cuts off after the first decimal instead of rounding. Returns null for marks like 'TBA'.
function germanGrade(mark) {
  const percent = parseFloat(mark)
  if (Number.isNaN(percent)) return null
  const grade = Math.floor((1 + (3 * (100 - percent)) / 50) * 10 + 1e-9) / 10
  return grade.toFixed(1).replace('.', ',')
}

// Horizontal carousel of screenshots. Every slide keeps its screenshot's own proportions (nothing is
// cropped), the active one sits in the middle and its neighbours fade out towards the page background.
function Carousel({ project, onOpen }) {
  const t = useLang().t.projects
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
      className={`visual carousel${project.portrait ? ' portrait' : ''}`}
      style={project.ratio && { '--ratio': project.ratio }}
      role="group"
      aria-roledescription="carousel"
      aria-label={t.screenshots(project.title)}
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
                  aria-label={i === active ? (img ? t.openFull : `${t.screenshot} ${i + 1}`) : t.showScreenshot(i + 1)}
                  onClick={() => onSlide(img, i)}
                >
                  {img ? (
                    <Media skeleton src={img.src} alt={img.caption || t.screenshotOf(project.title, i + 1)} loading="lazy" draggable="false" />
                  ) : (
                    <span className="slide-empty">
                      <span>{t.screenshot} {i + 1}</span>
                      <span className="pen">{t.comingSoon}</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {slots.length > 1 && (
          <>
            <button type="button" className="carousel-nav prev" onClick={() => go(active - 1)} disabled={active === 0} aria-label={t.previous}><NavArrow left /></button>
            <button type="button" className="carousel-nav next" onClick={() => go(active + 1)} disabled={active === slots.length - 1} aria-label={t.next}><NavArrow /></button>
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
              aria-label={t.showScreenshot(i + 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// For projects without a user interface: key points in a terminal-style window.
function Highlights({ project }) {
  const t = useLang().t.projects
  const language = project.kind.split(' · ')[0]
  return (
    <div className="visual terminal">
      <div className="frame-bar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="frame-count">{language} · {t.commandLine}</span>
      </div>
      <div className="terminal-body">
        <p className="terminal-head">{t.terminalHead}</p>
        <ul>
          {project.highlights.map((h, i) => (
            <li key={h} style={{ '--t': i }}>{h}</li>
          ))}
        </ul>
        <span className="cursor" aria-hidden="true" />
      </div>
      <span className="pen no-gui">{t.noGuiNote}</span>
    </div>
  )
}

function Lightbox({ open, onClose }) {
  const t = useLang().t.projects
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
          <Media src={image.src} alt={image.caption || ''} />
          <div className="lightbox-bar">
            <button type="button" onClick={() => step(-1)} aria-label={t.previous}><NavArrow left /></button>
            <span>{image.caption || `${index + 1} / ${images.length}`}</span>
            <button type="button" onClick={() => step(1)} aria-label={t.next}><NavArrow /></button>
          </div>
          <button type="button" className="lightbox-close" onClick={() => dialog.current.close()} aria-label={t.close}>×</button>
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
function useInOutView(selector, key) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('shown', e.isIntersecting)),
      { rootMargin: '-12% 0px -12% 0px' },
    )
    document.querySelectorAll(selector).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector, key])
}

export default function Projects({ page = 'university' }) {
  const { lang, t: { projects: t }, content } = useLang()
  const list = page === 'personal' ? content.personalProjects : content.projects
  const { word, intro } = t[page]
  const [zoomed, setZoomed] = useState(null)
  // Coming from a skill on the home page (?skill=Java) shows only the projects that use it
  const [params, setParams] = useSearchParams()
  const skill = params.get('skill')
  const only = page === 'university' && skill && skillProjects[skill]
  const shown = only ? list.filter((p) => only.includes(p.slug)) : list
  const num = (p) => pad(list.indexOf(p) + 1)
  useInOutView('.project-entry', skill)

  return (
    <main className="projects-page">
      <header className="projects-head">
        <h1 className="ph-title title reveal">
          <span className="ph-line">
            <Split text={word} />
            <span className="ph-box">
              <Split text={t.projects} offset={word.length} />
            </span>
          </span>
        </h1>
        <div className="ph-sticker" aria-hidden="true">
          <strong>{list.length}</strong>
          <span>{t.sticker}</span>
        </div>
        <Sparkle className="ph-spark a" />
        <Sparkle className="ph-spark b" />
        <p className="reveal">{intro}</p>
        {page === 'personal' && (
          <aside className="freelance-note reveal">
            <span className="freelance-stamp" aria-hidden="true">
              <svg className="freelance-ring" viewBox="0 0 120 120">
                <path id="freelance-ring-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" fill="none" />
                <text>
                  <textPath href="#freelance-ring-path" textLength="285" lengthAdjust="spacing">
                    {t.freelance.ring}
                  </textPath>
                </text>
              </svg>
              <span className="mini-site">
                <span className="mini-bar"><i /><i /><i /></span>
                <span className="mini-hero" />
                <span className="mini-line" />
                <span className="mini-cards"><i /><i /><i /></span>
              </span>
            </span>
            <div className="freelance-copy">
              <p className="freelance-psst pen write">{t.freelance.psst}</p>
              {lang === 'de' ? (
                <p>
                  Ich habe aus einem Computerraum eine mittelalterliche Burg und aus einer Filesharing-App ein
                  Piratenschiff gemacht, also stell dir vor, was ich mit deiner Website anstellen könnte. Ich arbeite
                  auch als <mark className="hl">freiberufliche Webdesignerin und -entwicklerin</mark> und würde gern
                  hören, wovon du träumst.
                </p>
              ) : (
                <p>
                  I&apos;ve turned a computer lab into a medieval castle and a file-sharing app into a pirate ship, so
                  imagine what I could do with your website. I also work as a{' '}
                  <mark className="hl">freelance web designer and developer</mark>, and I&apos;d love to hear what
                  you&apos;re dreaming up.
                </p>
              )}
              <a href="#your-website" className="freelance-cta">{t.freelance.cta} <NavArrow inline /></a>
            </div>
            <Sparkle className="freelance-spark a" />
            <Sparkle className="freelance-spark b" />
            <Sparkle className="freelance-spark c" />
          </aside>
        )}
        {page === 'university' && (
          <p className="grade-note reveal">
            {t.gradeNote}
          </p>
        )}
        {only && (
          <p className="skill-filter">
            <span>
              {t.showing(shown.length)}<strong>{content.skillName(skill)}</strong>{t.showingEnd}
            </span>
            <button type="button" onClick={() => setParams({})}>{t.showAll}</button>
          </p>
        )}
        <ol className="project-index">
          {shown.map((p, i) => (
            <li key={p.slug} className="reveal" style={{ '--d': `${i * 40}ms` }}>
              <a href={`#${p.slug}`}>
                <span>{num(p)}</span> {p.title}
                {p.gui === false && <em>{t.noGui}</em>}
              </a>
            </li>
          ))}
          {page === 'personal' && (
            <li className="reveal" style={{ '--d': `${shown.length * 40}ms` }}>
              <a href="#your-website">
                <span>{pad(list.length + 1)}</span> {t.quote.title}
                <em>{t.quote.short}</em>
              </a>
            </li>
          )}
        </ol>
      </header>

      {shown.map((p, i) => (
        <article
          id={p.slug}
          key={p.slug}
          className={`project-entry${p.gui === false ? (i % 2 ? ' flip' : '') : ' wide'}`}
        >
          <span className="entry-bignum" aria-hidden="true">{num(p)}</span>
          <div className="project-info">
            <div className="project-head">
              <div className="project-top">
                <div className="project-badges">
                  {p.mark && (
                    <span className={`project-mark${p.mark === 'TBA' ? ' pending' : ''}`}>
                      {t.mark} <strong>{p.mark === 'TBA' ? t.tba : content.mark(p.mark)}</strong>
                    </span>
                  )}
                  {germanGrade(p.mark) && (
                    <span className="project-mark german">
                      {t.germanGrade} <strong>≈ {germanGrade(p.mark)}</strong>
                    </span>
                  )}
                  {p.meta && <span className="project-meta">{p.meta}</span>}
                </div>
              </div>
              <h2 className="entry-title">
                <Split text={p.title} />
                {p.note && <span className="pen entry-note">{p.note}</span>}
              </h2>
              {p.module && <p className="project-module">{t.module} <strong>{p.module}</strong></p>}
            </div>
            <div className="project-body">
              <p>{p.description}</p>
              {p.theme && <p className="project-theme">{p.theme}</p>}
              <div className="project-tech">
                <h3>{t.techStack}</h3>
                <ul className="stack-list">
                  {p.stack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                {p.technical && (
                  <>
                    <h3>{t.underTheHood}</h3>
                    <ul className="tech-notes">
                      {p.technical.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                  </>
                )}
              </div>
              {p.link && (
                <a href={p.link} className="project-link" target="_blank" rel="noreferrer">{p.linkLabel ?? t.viewProject} <NavArrow inline out /></a>
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

      {page === 'personal' && <QuoteForm number={list.length + 1} />}

      {page === 'university' && (
        <section className="cta">
          <div className="cta-card reveal pop" style={{ '--r': '-6deg' }}>
            <PeekingEyes />
            <h2 className="cta-title">
              {t.ctaTitle[0]}<mark className="hl">{t.ctaTitle[1]}</mark>{t.ctaTitle[2]}
            </h2>
            <div className="cta-action">
              <Link to="/#contact" className="button primary big tap">{t.getInTouch}</Link>
              <PointingHand className="finger" />
            </div>
          </div>
        </section>
      )}

      <Lightbox key={zoomed ? `${zoomed.images[0].src}-${zoomed.index}` : 'closed'} open={zoomed} onClose={() => setZoomed(null)} />
    </main>
  )
}
