import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
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
// Screens marked `more` stay out of it and only show in the lightbox, under "See all screens".
function Carousel({ project, onOpen }) {
  const t = useLang().t.projects
  const [active, setActive] = useState(0)
  const swipe = useRef({ x: null, moved: false })
  const all = project.images
  const images = all.filter((img) => !img.more)
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
    else if (img) onOpen(all, all.indexOf(img))
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
      {all.length > images.length && (
        <button type="button" className="see-all" onClick={() => onOpen(all, 0)}>
          <span className="see-all-grid" aria-hidden="true"><i /><i /><i /><i /></span>
          {t.seeAllScreens(all.length)}
        </button>
      )}
    </div>
  )
}

// The story behind a project (`caseStudy` in content.js): a folder button beside "View project" that opens the
// story in a pop-up over the blurred page. The sections always come in this order, and any a project leaves out
// are skipped.
const CASE_SECTIONS = ['problem', 'user', 'research', 'decisions', 'outcome', 'reflection']

// A hand-drawn doodle for each section: a warning sign, a person, a magnifying glass, a lightbulb, a star and a
// looping arrow. The filled shape takes its colour from CSS (--fill), the strokes are ink.
const CASE_ICONS = {
  problem: ['M12 3.6c.4 0 .7.2.9.6l7.6 13.6c.4.8-.1 1.7-1 1.7H4.6c-.9 0-1.4-.9-1-1.7L11.1 4.2c.2-.4.5-.6.9-.6Z', 'M12 9.3c.1 1.6 0 3.1-.1 4.6M12 16.6v.1'],
  user: ['M12 4.3a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4ZM4.8 20c.6-3.9 3.4-6.1 7.2-6.1s6.6 2.2 7.2 6.1Z', ''],
  research: ['M10.4 4.2a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4Z', 'M15 15.1c1.9 1.7 3.6 3.4 5.2 5.2M7.6 9.3c.4-1.2 1.3-2 2.6-2.3'],
  decisions: ['M12 3.2a6.1 6.1 0 0 0-3.6 11c.6.5 1 1.2 1 2h5.2c0-.8.4-1.5 1-2A6.1 6.1 0 0 0 12 3.2Z', 'M9.6 18.6h4.8M10.5 21h3'],
  outcome: ['M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8l-5.3 2.9 1.1-6-4.4-4.2 6-.8Z', ''],
  reflection: ['', 'M18.6 13.2a6.8 6.8 0 1 1-1.9-5.9M17.4 3.6l-.4 4.2-4.1-.3'],
}

function CaseIcon({ name }) {
  const [shape, strokes] = CASE_ICONS[name]
  return (
    <svg className="case-icon" viewBox="0 0 24 24" aria-hidden="true">
      {shape && <path className="fill" d={shape} />}
      {strokes && <path d={strokes} />}
    </svg>
  )
}

// Whether a project's case study is open, shared by its button and its pop-up
function useCaseStudy(project) {
  const [open, setOpen] = useState(false)
  const id = `${project.slug}-case-study`

  // A link straight to the case study (/projects#<slug>-case-study) opens it; App.jsx scrolls to its button
  const { hash } = useLocation()
  const [seenHash, setSeenHash] = useState(null)
  if (hash !== seenHash) {
    setSeenHash(hash)
    if (hash === `#${id}`) setOpen(true)
  }

  return { id, open, setOpen }
}

function CaseToggle({ study }) {
  const t = useLang().t.projects.caseStudy
  return (
    <div className="case-bar" id={study.id}>
      <button type="button" className="case-toggle" aria-haspopup="dialog" onClick={() => study.setOpen(true)}>
        <span className="case-page" aria-hidden="true" />
        <span className="case-front">
          <span className="case-plus" aria-hidden="true" />
          {t.open}
        </span>
      </button>
      <span className="pen case-hint" aria-hidden="true">{t.hint}</span>
    </div>
  )
}

// The case study as a pop-up: the project's name in a header that stays put while the story scrolls under it,
// and the path from the problem to the reflection. Closing (×, Escape, or a click on the blurred page around it)
// fades it out first.
function CaseModal({ project, study }) {
  const t = useLang().t.projects.caseStudy
  const dialog = useRef(null)
  const [closing, setClosing] = useState(false)
  const { id, open, setOpen } = study
  const story = project.caseStudy
  const sections = CASE_SECTIONS.filter((key) => story[key])

  useEffect(() => {
    if (open) dialog.current.showModal()
  }, [open])

  const close = () => {
    if (closing) return
    setClosing(true)
    const fade = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220
    // Escape can close it straight away instead (browsers don't always let the fade hold it open), and then
    // there's nothing left to close, only the fade to reset
    setTimeout(() => (dialog.current?.open ? dialog.current.close() : setClosing(false)), fade)
  }

  return (
    <dialog
      ref={dialog}
      className={`case-modal${closing ? ' closing' : ''}`}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClose={() => {
        setClosing(false)
        setOpen(false)
      }}
      onClick={(e) => e.target === dialog.current && close()}
    >
      {open && (
        <>
          <header className="case-head">
            <div>
              <p className="case-kicker">{t.title}</p>
              <h2 id={`${id}-title`}>{project.title}</h2>
            </div>
            <button type="button" className="case-x" onClick={close} aria-label={t.close}>×</button>
          </header>
          <div className="case-sheet">
            {story.role && (
              <p className="case-role">
                <span className="pen">{t.role}</span> {story.role}
              </p>
            )}
            <ol className="case-list">
              {sections.map((key, i) => (
                <li key={key} className={`case-${key}`} style={{ '--n': i }}>
                  <CaseIcon name={key} />
                  <div className="case-label">
                    <span className="case-num">{pad(i + 1)}</span>
                    <h3>{t.sections[key][0]}</h3>
                    <p className="pen">{t.sections[key][1]}</p>
                  </div>
                  <div className="case-text">
                    <p>{story[key]}</p>
                    {key === 'outcome' && story.learned && <p>{story.learned}</p>}
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" className="case-close" onClick={close}>
              {t.close}
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}

// The year, and a badge like "Client work" for projects that aren't coursework
function Badges({ project }) {
  if (!project.meta && !project.label) return null
  return (
    <div className="project-badges">
      {project.label && <span className="project-label">{project.label}</span>}
      {project.meta && <span className="project-meta">{project.meta}</span>}
    </div>
  )
}

// Role, team size and how long it took, at a glance under the title
function Glance({ project }) {
  const t = useLang().t.projects.glance
  if (!project.role) return null
  return (
    <dl className="project-glance">
      <div>
        <dt>{t.role}</dt>
        <dd>{project.role}</dd>
      </div>
      <div>
        <dt>{t.team}</dt>
        <dd>{project.team > 1 ? t.people(project.team) : t.solo}</dd>
      </div>
      <div>
        <dt>{t.time}</dt>
        <dd>{project.time}</dd>
      </div>
    </dl>
  )
}

// The final mark and (in German, or when the site is pointed at Germany) its German grade, as one small line under
// the tech stack
function Grade({ mark }) {
  const { t: { projects: t }, content, germanGrades } = useLang()
  if (!mark) return null
  const grade = germanGrades && germanGrade(mark)
  return (
    <p className="project-grade">
      {t.mark} <strong>{mark === 'TBA' ? t.tba : content.mark(mark)}</strong>
      {grade && (
        <>
          <span aria-hidden="true"> · </span>
          {t.germanGrade} <strong>≈ {grade}</strong>
        </>
      )}
    </p>
  )
}

function Stack({ project }) {
  const t = useLang().t.projects
  return (
    <div className="project-tech">
      <h3>{t.techStack}</h3>
      <ul className="stack-list">
        {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
      </ul>
      {project.technical && (
        <>
          <h3>{t.underTheHood}</h3>
          <ul className="tech-notes">
            {project.technical.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </>
      )}
    </div>
  )
}

// A project with screens: its title, one-liner and summary on the left, the details on the right, and then the
// carousel
function ProjectEntry({ project: p, num, onOpen }) {
  const t = useLang().t.projects
  const study = useCaseStudy(p)
  return (
    <article id={p.slug} className="project-entry wide">
      <span className="entry-bignum" aria-hidden="true">{num}</span>
      <div className="project-info">
        <div className="project-head">
          <Badges project={p} />
          <h2 className="entry-title">
            <Split text={p.title} />
            {p.note && <span className="pen entry-note">{p.note}</span>}
          </h2>
          {p.tagline && <p className="project-tagline">{p.tagline}</p>}
          <Glance project={p} />
          {p.module && <p className="project-module">{t.module} <strong>{p.module}</strong></p>}
        </div>
        <div className="project-body">
          <p>{p.description}</p>
          {p.theme && <p className="project-theme">{p.theme}</p>}
          <Stack project={p} />
          <Grade mark={p.mark} />
          {(p.link || p.caseStudy) && (
            <div className="project-actions">
              {p.link && (
                <a href={p.link} className="project-link" target="_blank" rel="noreferrer">{p.linkLabel ?? t.viewProject} <NavArrow inline out /></a>
              )}
              {p.caseStudy && <CaseToggle study={study} />}
            </div>
          )}
        </div>
      </div>
      <Carousel project={p} onOpen={onOpen} />
      {p.caseStudy && <CaseModal project={p} study={study} />}
    </article>
  )
}

// A project without a GUI, as a compact card in the engineering section: its summary and its key points as
// command-line output in a little terminal
function EngineeringCard({ project: p, num }) {
  const t = useLang().t.projects
  const study = useCaseStudy(p)
  return (
    <article id={p.slug} className="eng-card">
      <div className="eng-body">
        <div className="eng-top">
          <span className="eng-num" aria-hidden="true">{num}</span>
          {p.meta && <span className="project-meta">{p.meta}</span>}
        </div>
        <h3 className="eng-title">{p.title}</h3>
        {p.module && <p className="project-module">{t.module} <strong>{p.module}</strong></p>}
        <p>{p.description}</p>
        <div className="eng-term">
          <div className="frame-bar">
            <span className="dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="frame-count">{p.kind}</span>
          </div>
          <ul className="eng-lines">
            {p.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
        <ul className="stack-list">
          {p.stack.map((tech) => <li key={tech}>{tech}</li>)}
        </ul>
        <Grade mark={p.mark} />
        {p.caseStudy && <CaseToggle study={study} />}
      </div>
      {p.caseStudy && <CaseModal project={p} study={study} />}
    </article>
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
  const { lang, t: { projects: t }, content, germanGrades } = useLang()
  const list = page === 'personal' ? content.personalProjects : content.projects
  const { word, intro } = t[page]
  const [zoomed, setZoomed] = useState(null)
  // Coming from a skill on the home page (?skill=Java) shows only the projects on this page that use it
  const [params, setParams] = useSearchParams()
  const skill = params.get('skill')
  const used = skill && skillProjects[skill]?.filter((slug) => list.some((p) => p.slug === slug))
  const only = used?.length ? used : null
  const shown = only ? list.filter((p) => only.includes(p.slug)) : list
  // The projects without a GUI are grouped at the end as compact engineering cards
  const engineering = shown.filter((p) => p.gui === false)
  const num = (p) => pad(list.indexOf(p) + 1)
  const open = (images, index) => setZoomed({ images, index })
  useInOutView('.project-entry, .eng-card', skill)

  return (
    <main className="projects-page">
      <header className="projects-head">
        <h1 className={`ph-title title reveal${page === 'personal' ? ' ph-one-line' : ''}`}>
          <span className="ph-line">
            <Split text={word} />
            <span className="ph-box">
              <Split text={t.projects} offset={word.length} />
            </span>
          </span>
        </h1>
        {page !== 'personal' && (
          <div className="ph-sticker" aria-hidden="true">
            <strong>{list.length}</strong>
            <span>{t.sticker}</span>
          </div>
        )}
        {page !== 'personal' && (
          <>
            <Sparkle className="ph-spark a" />
            <Sparkle className="ph-spark b" />
          </>
        )}
        {intro && <p className="reveal">{intro}</p>}
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
                  Piratenschiff gemacht, also stell dir vor, was ich mit deiner Website anstellen könnte. Ich bin
                  außerdem der Kopf hinter <mark className="hl">Alist Websites</mark>, einem Studio für individuelles
                  Webdesign und Webentwicklung, und würde gern hören, wovon du träumst.
                </p>
              ) : (
                <p>
                  I&apos;ve turned a computer lab into a medieval castle and a file-sharing app into a pirate ship, so
                  imagine what I could do with your website. I&apos;m also the brains behind{' '}
                  <mark className="hl">Alist Websites</mark>, a custom web design and development studio, and I&apos;d
                  love to hear what you&apos;re dreaming up.
                </p>
              )}
              <div className="freelance-links">
                <a href="#your-website" className="freelance-cta">{t.freelance.cta} <NavArrow inline /></a>
                <a href="https://www.alistwebsites.co.za" className="freelance-site" target="_blank" rel="noreferrer">
                  {t.freelance.site} <NavArrow inline out />
                </a>
              </div>
            </div>
            <Sparkle className="freelance-spark a" />
            <Sparkle className="freelance-spark b" />
            <Sparkle className="freelance-spark c" />
          </aside>
        )}
        {page === 'university' && germanGrades && (
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
        {/* A contents list for the university projects; the personal page is short enough without one */}
        {page !== 'personal' && (
          <ol className="project-index">
            {shown.map((p, i) => (
              <li key={p.slug} className="reveal" style={{ '--d': `${i * 40}ms` }}>
                <a href={`#${p.slug}`}>
                  <span>{num(p)}</span> {p.title}
                  {p.gui === false && <em>{t.noGui}</em>}
                </a>
              </li>
            ))}
          </ol>
        )}
      </header>

      {shown.filter((p) => p.gui !== false).map((p) => (
        <ProjectEntry key={p.slug} project={p} num={num(p)} onOpen={open} />
      ))}

      {engineering.length > 0 && (
        <section className="eng-section" aria-labelledby="engineering">
          <div className="eng-head">
            <h2 id="engineering" className="eng-heading reveal">{t.engineering}</h2>
            <span className="pen eng-note reveal">{t.noGuiNote}</span>
          </div>
          <div className="eng-grid">
            {engineering.map((p) => <EngineeringCard key={p.slug} project={p} num={num(p)} />)}
          </div>
        </section>
      )}

      {page === 'personal' && <QuoteForm number={list.length + 1} />}

      {page === 'university' && (
        <section className="cta">
          <div className="cta-card reveal pop" style={{ '--r': '-6deg' }}>
            <PeekingEyes />
            <h2 className="cta-title">
              {t.ctaTitle[0]}<mark className="hl">{t.ctaTitle[1]}</mark>{t.ctaTitle[2]}
            </h2>
            <div className="cta-action">
              <Link to="/#contact" data-trip="contact" className="button primary big tap">{t.getInTouch}</Link>
              <PointingHand className="finger" />
            </div>
          </div>
        </section>
      )}

      <Lightbox key={zoomed ? `${zoomed.images[0].src}-${zoomed.index}` : 'closed'} open={zoomed} onClose={() => setZoomed(null)} />
    </main>
  )
}
