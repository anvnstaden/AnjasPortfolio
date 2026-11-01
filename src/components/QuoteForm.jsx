import { useState } from 'react'
import { Link } from 'react-router-dom'
import Split from './Split.jsx'
import { contact } from '../data/content.js'
import { useLang } from '../i18n.js'

const fill = (sentence, word) => sentence.replace(/\{(\w+)\}/g, (_, blank) => word(blank))

// The last entry on the personal page: visitors tap the words to build a sentence about the website they want,
// and the button opens an email to me with it already written.
export default function QuoteForm({ number }) {
  const t = useLang().t.projects.quote
  const blanks = Object.keys(t.options)
  const [chosen, setChosen] = useState(() => Object.fromEntries(blanks.map((b) => [b, 0])))
  const [copied, setCopied] = useState(false)
  const word = (b) => t.options[b][chosen[b]]
  const sentence = fill(t.sentence, word)
  const body = `${sentence}\n\n${t.more}\n\n`
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`

  const change = (updates) => {
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
          {t.sentence.split(/(\{\w+\})/).map((part) => {
            const b = part.match(/^\{(\w+)\}$/)?.[1]
            if (!b) return part
            return (
              <button
                type="button"
                key={b}
                className={`quote-word ${b}`}
                onClick={() => next(b)}
                aria-label={`${t.labels[b]}: ${word(b)}. ${t.tapToChange}`}
              >
                {/* A new key restarts the little pop each time the word changes */}
                <span key={word(b)}>{word(b)}</span>
              </button>
            )
          })}
        </p>
        <div className="quote-actions">
          <a href={mailto} className="button primary tap">{t.send}</a>
          <button type="button" className="quote-surprise" onClick={surprise}>{t.surprise}</button>
        </div>
        <p className="quote-fallback">
          {t.noEmail} <button type="button" onClick={copy}>{copied ? t.copied : t.copy}</button> {t.sendTo} {contact.email}{' '}
          {t.orUse} <Link to="/#contact">{t.contactSection}</Link>.
        </p>
      </div>
    </article>
  )
}
