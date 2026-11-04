import { useState } from 'react'
import { Link } from 'react-router-dom'
import Split from './Split.jsx'
import SiteSketch from './SiteSketch.jsx'
import { contact } from '../data/content.js'
import { useLang } from '../i18n.js'

const fill = (sentence, word) => sentence.replace(/\{(\w+)\}/g, (_, blank) => word(blank))

// The buttons' labels, letter by letter so they can hop on hover (like the hero's buttons)
const hop = (text) => (
  <span className="fun-label" aria-hidden="true">
    {[...text].map((ch, i) => (
      <i style={{ '--i': i }} key={i}>{ch}</i>
    ))}
  </span>
)

// Where the pips sit on each face of the die, on a 3x3 grid (0 to 8, row by row)
const PIPS = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]]

// The last entry on the personal page: visitors tap the words to build a sentence about the website they want,
// watching a little sketch of it change beside them, and the button opens an email to me with it already written.
export default function QuoteForm({ number }) {
  const t = useLang().t.projects.quote
  const blanks = Object.keys(t.options)
  const [chosen, setChosen] = useState(() => Object.fromEntries(blanks.map((b) => [b, 0])))
  // the word each blank had before its last change, which gets scribbled out as the new one is written in
  const [prev, setPrev] = useState({})
  const [copied, setCopied] = useState(false)
  // the die on the Surprise me button: its face, and how many times it's been rolled (to restart the roll)
  const [die, setDie] = useState({ face: 4, rolls: 0 })
  const word = (b) => t.options[b][chosen[b]]
  const sentence = fill(t.sentence, word)
  const body = `${sentence}\n\n${t.more}\n\n`
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`

  const change = (updates) => {
    setPrev((p) => ({ ...p, ...Object.fromEntries(Object.keys(updates).map((b) => [b, chosen[b]])) }))
    setChosen((c) => ({ ...c, ...updates }))
    setCopied(false)
  }
  const next = (b) => change({ [b]: (chosen[b] + 1) % t.options[b].length })
  const surprise = () => {
    const updates = {}
    for (const b of blanks) {
      // Picks from the words after the current one, so every word always changes
      updates[b] = (chosen[b] + 1 + Math.floor(Math.random() * (t.options[b].length - 1))) % t.options[b].length
    }
    change(updates)
    setDie((d) => ({ face: (d.face + 1 + Math.floor(Math.random() * 5)) % 6, rolls: d.rolls + 1 }))
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sentence)
      setCopied(true)
    } catch {
      // Clipboard blocked; the sentence is still there to select, and the email address is right next to the button.
    }
  }

  return (
    <article id="your-website" className="project-entry wide quote">
      <span className="entry-bignum" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      <div className="project-info">
        <div className="project-head">
          <h2 className="entry-title">
            <Split text={t.title} />
            <span className="pen entry-note">{t.note}</span>
          </h2>
        </div>
        <div className="project-body">
          <p>{t.text}</p>
        </div>
      </div>
      <div className="visual quote-card">
        <p className="quote-sentence">
          {t.sentence.split(/(\{\w+\})/).map((part, i, parts) => {
            const b = part.match(/^\{(\w+)\}$/)?.[1]
            // punctuation straight after a word stays with it (below), so a full stop never ends up on its own line
            if (!b) return /^\{\w+\}$/.test(parts[i - 1] ?? '') ? part.replace(/^[.,!?;:]/, '') : part
            const tail = parts[i + 1]?.match(/^[.,!?;:]/)?.[0]
            return (
              <span className="quote-glue" key={b}>
                <button
                  type="button"
                  className={`quote-word ${b}`}
                  onClick={() => next(b)}
                  aria-label={`${t.labels[b]}: ${word(b)}. ${t.tapToChange}`}
                >
                  {/* Every option sits invisibly underneath, so the button is always as wide as its longest word
                      and the sentence never reflows when one changes */}
                  <span className="quote-ghosts" aria-hidden="true">
                    {t.options[b].map((o) => <span key={o}>{o}</span>)}
                  </span>
                  {/* New keys restart the scribble over the old word and the writing of the new one on every change */}
                  {prev[b] !== undefined && (
                    <span className="quote-old" key={`old-${prev[b]}-${chosen[b]}`} aria-hidden="true">
                      {t.options[b][prev[b]]}
                    </span>
                  )}
                  <span className="quote-pick" key={word(b)}>{word(b)}</span>
                  <span className="quote-redo" aria-hidden="true">↻</span>
                </button>
                {tail}
              </span>
            )
          })}
        </p>
        <SiteSketch chosen={chosen} />
        <div className="quote-actions">
          {/* A paper plane that flies off and loops back in on hover... */}
          <a href={mailto} className="fun-btn send-btn" aria-label={t.send}>
            <span className="fun-face">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="plane" d="M21.5 2.5 2.5 10l7.2 2.8 2.8 7.2z" />
                <path d="M21.5 2.5 9.7 12.8" />
              </svg>
              {hop(t.send)}
            </span>
          </a>
          {/* ...and a die that rolls to a new face with every surprise */}
          <button type="button" className="fun-btn dice-btn" aria-label={t.surprise} onClick={surprise}>
            <span className="fun-face">
              <svg viewBox="0 0 24 24" aria-hidden="true" key={die.rolls} className={die.rolls ? 'rolled' : undefined}>
                <rect x="3" y="3" width="18" height="18" rx="4.5" />
                {PIPS[die.face].map((p) => (
                  <circle key={p} cx={7.5 + (p % 3) * 4.5} cy={7.5 + Math.floor(p / 3) * 4.5} r="1.5" />
                ))}
              </svg>
              {hop(t.surprise)}
            </span>
          </button>
        </div>
        <p className="quote-fallback">
          {t.noEmail} <button type="button" onClick={copy}>{copied ? t.copied : t.copy}</button> {t.sendTo} {contact.email}{' '}
          {t.orUse} <Link to="/#contact">{t.contactSection}</Link>.
        </p>
      </div>
    </article>
  )
}
