import { useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import Title from '../components/Title.jsx'
import ProjectThumb from '../components/ProjectThumb.jsx'
import { FlagDE, FlagNL, FlagZA } from '../components/Flags.jsx'
import { Circle, Sparkle, Underline } from '../components/Doodles.jsx'
import { contact, projects, skills } from '../data/content.js'

// Look and feel of each card in the "What I bring" grid, in the same order as `skills`.
const skillCards = [
  { color: 'lilac', glyph: 'Aa', size: 'wide', note: 'my favourite!' },
  { color: 'butter', glyph: '</>' },
  { color: 'plum', glyph: '{ }' },
  { color: 'green', glyph: 'f(x)' },
  { color: 'pink', glyph: 'git' },
]

const facts = [
  { label: 'Citizenship', value: 'South African & Dutch', flags: [FlagZA, FlagNL] },
  { label: 'Work rights', value: 'EU authorisation, no visa or sponsorship needed' },
  { label: 'Looking for', value: 'Roles anywhere in Germany from 2027', flags: [FlagDE] },
  { label: 'Languages', value: 'English, Afrikaans, Deutsch (learning), Dutch (understands)' },
]

function Hero() {
  const [photoMissing, setPhotoMissing] = useState(false)

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
        <div className="photo-dot" aria-hidden="true" />
        <div className="photo">
          {photoMissing ? (
            <span className="monogram">AvS</span>
          ) : (
            <img src="/profile.jpeg" alt="Anja van Staden" onError={() => setPhotoMissing(true)} />
          )}
        </div>
        <span className="photo-status">
          <i aria-hidden="true" /> open to work from 2027
        </span>
        <Sparkle className="s1" />
        <Sparkle className="s2" />
        <Sparkle className="s3" />
      </div>
    </section>
  )
}

export default function Home() {
  const featured = projects.filter((p) => p.featured)

  return (
    <main>
      <Hero />

      <section id="about" className="section">
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
            <p>Currently…</p>
            <ul>
              <li>finishing up my BSc Computer Science degree</li>
              <li>practising my German Vokabeln</li>
            </ul>
          </aside>
        </div>
        <dl className="facts">
          {facts.map((f, i) => (
            <div key={f.label} className="fact tilt reveal" style={{ '--d': `${i * 90}ms` }}>
              <dt>{f.label}</dt>
              <dd>
                {f.value}
                {f.flags && (
                  <span className="fact-flags">
                    {f.flags.map((Flag, j) => <Flag key={j} />)}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="work" className="section">
        <div className="section-head">
          <Title en="My Projects" de="Ausgewählte Projekte" />
          <Link to="/projects" className="more-link reveal">
            <span className="pen write">psst… there&apos;s more!</span>
            All {projects.length} projects →
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
                <p className="card-kind">{p.kind}</p>
                <h3>{p.title}</h3>
                <p className="card-desc">{p.description}</p>
                <span className="card-more">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="skills" className="section">
        <Title en="What I Bring" de="Was ich mitbringe" />
        <div className="bento">
          {Object.entries(skills).map(([group, items], i) => {
            const look = skillCards[i % skillCards.length]
            return (
              <article
                key={group}
                className={`bento-card tilt reveal pop ${look.color} ${look.size || ''}`}
                style={{ '--d': `${i * 90}ms`, '--r': `${i % 2 ? 3 : -3}deg` }}
              >
                <span className="bento-glyph" aria-hidden="true">{look.glyph}</span>
                <p className="bento-count">
                  {String(items.length).padStart(2, '0')} skills
                  {look.note && <span className="pen bento-note write">{look.note}</span>}
                </p>
                <h3>{group}</h3>
                <ul>
                  {items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section id="contact" className="contact">
        <h2 className="contact-big zoom reveal">
          <Split text="Let's Talk" className="wobble" />
        </h2>
        <p className="pen contact-de write">
          Lass uns reden!
          <Underline className="draw" />
        </p>
        <p className="contact-translations reveal">Kom ons gesels · Laten we praten</p>
        <a href={`mailto:${contact.email}`} className="button primary big reveal pop">{contact.email}</a>
        <div className="socials reveal">
          <a href={contact.github} target="_blank" rel="noreferrer" className="social github">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
            </svg>
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social linkedin">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
            </svg>
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  )
}
