import { useLang } from '../i18n.js'

// The little website beside the quote form, drawn from the words picked in the sentence: what it is sets the
// layout, who it's for the name and pictures, the feel the colours and type, and when the stamp on the corner.
// The word lists line up by position in both languages, so it goes by index.
const WHAT = ['site', 'shop', 'landing', 'booking', 'redesign', 'portfolio']
const FEEL = ['fancy', 'playful', 'calm', 'bold', 'retro', 'unhinged']
const WHEN = ['month', 'weeks', 'whenever', 'yesterday']
const WHO = [
  { name: 'Crumb & Co.', pics: ['🥐', '🍰', '🥖', '🧁', '🍪', '🥨'] },
  { name: 'Smith & Daughters', pics: ['💼', '📈', '🤝', '📦', '🧾', '☕'] },
  { name: 'Studio Nº5', pics: ['🎨', '🖌️', '🪴', '📐', '🖼️', '✂️'] },
  { name: 'The Loud Ones', pics: ['🎸', '🥁', '🎤', '🎧', '📀', '🎟️'] },
  { name: 'Side Quest', pics: ['🚀', '💡', '🧶', '🕯️', '🧩', '🪄'] },
  { name: 'Good Boy Inc.', pics: ['🐶', '🦴', '🎾', '🐾', '🦮', '🛁'] },
]
const PRICES = [4, 12, 7, 3, 9, 15]
// which booking slots are taken, and the one that's picked
const TAKEN = [1, 2, 6, 9, 10, 13]
const PICKED = 7

export default function SiteSketch({ chosen }) {
  const t = useLang().t.projects.quote
  const what = WHAT[chosen.what]
  const who = WHO[chosen.who]
  const [pic, ...pics] = who.pics
  const slug = who.name.toLowerCase().replace(/[^a-z0-9]+/g, '')

  const hero = (
    <div className="sk-hero">
      <span className="sk-pic">{pic}</span>
      <div className="sk-hero-text">
        <b className="sk-title">{who.name}</b>
        <i className="sk-line" />
        <i className="sk-line short" />
        <span className="sk-btn" />
      </div>
    </div>
  )

  const cards = (
    <div className="sk-cards">
      {pics.slice(0, 3).map((p) => (
        <span key={p} className="sk-card">
          <span>{p}</span>
          <i className="sk-line" />
        </span>
      ))}
    </div>
  )

  const body = {
    site: (
      <>
        {hero}
        {cards}
      </>
    ),
    redesign: (
      <>
        {hero}
        {cards}
      </>
    ),
    shop: (
      <>
        {hero}
        <div className="sk-shop">
          {who.pics.map((p, i) => (
            <span key={p} className="sk-card">
              <span>{p}</span>
              <small>€{PRICES[i]}</small>
            </span>
          ))}
        </div>
      </>
    ),
    landing: (
      <>
        {hero}
        <div className="sk-dots"><i /><i /><i /></div>
      </>
    ),
    booking: (
      <>
        {hero}
        <div className="sk-cal">
          {Array.from({ length: 15 }, (_, i) => (
            <i key={i} className={i === PICKED ? 'picked' : TAKEN.includes(i) ? 'taken' : undefined} />
          ))}
        </div>
      </>
    ),
    portfolio: (
      <>
        <b className="sk-title big">{who.name}</b>
        <i className="sk-line short" />
        <div className="sk-gallery">
          {who.pics.map((p) => <span key={p} className="sk-card">{p}</span>)}
        </div>
      </>
    ),
  }[what]

  return (
    <div className={`sketch what-${what} feel-${FEEL[chosen.feel]} when-${WHEN[chosen.when]}`} aria-hidden="true">
      <div className="sketch-frame">
        {what === 'redesign' && <span className="sk-old" />}
        <div className="sk-browser">
          <div className="sk-bar">
            <i /><i /><i />
            <span>{slug}.com</span>
          </div>
          {/* a new key pops the page in again when the layout or the business changes */}
          <div className="sk-page" key={`${what}-${chosen.who}`}>
            <div className="sk-nav">
              <b>{who.name}</b>
              <i /><i /><i />
              {what === 'shop' && <span>🛒</span>}
            </div>
            {body}
          </div>
        </div>
        {what === 'redesign' && <span className="sk-new">{t.sketchNew}</span>}
        <span className="sk-stamp" key={chosen.when}>{t.stamps[chosen.when]}</span>
      </div>
    </div>
  )
}
