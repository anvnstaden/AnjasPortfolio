import { useEffect, useRef, useState } from 'react'
import { FlagDE, FlagNL, FlagZA } from './Flags.jsx'
import { useLang } from '../i18n.js'

// Below this width there's no room for a two-page spread, so the notebook is a single page and the cover just flips away
const SPREAD = '(min-width: 1101px)'

function useSpread() {
  const [spread, setSpread] = useState(() => matchMedia(SPREAD).matches)
  useEffect(() => {
    const mq = matchMedia(SPREAD)
    const onChange = () => setSpread(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return spread
}

// The navbar's height plus a little room; the notebook stays pinned just under it while it opens
const PIN_TOP = 76

// Opens with the scroll, once you're on the section, and closes again as you scroll on past it: it's closed when the navbar's About Me link (or scrolling down)
// brings you there, then the title and notebook stay pinned under the navbar while you scroll through a stretch of
// page below them (the runway), and the cover turns with it. If the notebook is too tall to fit on the screen (on
// phones), nothing's pinned and it opens over the next bit of scrolling instead.
// --open goes from 0 to 1 and back to 0, and --lift peaks halfway, while the cover stands up off the page.
// The highlights and the sticky note wait until it's (nearly) open, then stay.
function useOpening(book, pin, runway) {
  // with reduced motion it's simply open
  const [still] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [opened, setOpened] = useState(still)
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const el = book.current
    if (still) {
      el.style.setProperty('--open', 1)
      el.style.setProperty('--lift', 0)
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const vh = innerHeight
      const box = pin.current.getBoundingClientRect()
      // pinned as high as it needs to be for the whole notebook to fit, tucking the title under the navbar if need be
      const top = Math.min(PIN_TOP, vh - box.height - 16)
      const fits = top + box.height - el.offsetHeight >= PIN_TOP
      setPinned(fits)
      pin.current.style.setProperty('--pin-top', `${top}px`)
      const run = runway.current.getBoundingClientRect()
      const clamp = (x) => Math.min(1, Math.max(0, x))
      // how far it's opened, and how far it's closed again after that
      let opening, closing
      if (run.height) {
        // the first third of the runway opens it, the middle keeps it open to read, the last third closes it
        const t = (box.bottom - run.top) / run.height
        opening = clamp(t / 0.3)
        closing = clamp((t - 0.7) / 0.3)
      } else {
        // where the About Me link leaves the title: the scroll padding plus the section's top padding
        const pad = (node) => parseFloat(getComputedStyle(node).paddingTop) || 0
        const landing =
          parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + pad(el.closest('section'))
        opening = clamp((landing + 8 - box.top) / (vh * 0.3))
        // closes as its bottom goes up past the middle of the screen
        closing = clamp((vh * 0.5 - box.bottom) / (vh * 0.3))
      }
      const p = opening - closing
      const open = p * p * (3 - 2 * p)
      el.style.setProperty('--open', open.toFixed(4))
      el.style.setProperty('--lift', Math.sin(open * Math.PI).toFixed(4))
      // past it, so the "scroll to open" hint stays hidden while it closes
      el.classList.toggle('past', closing > 0)
      if (opening > 0.9) setOpened(true)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [book, pin, runway, still])
  return { opened, pinned }
}

function Laptop() {
  return (
    <svg className="nb-doodle nb-laptop" viewBox="0 0 120 84" aria-hidden="true">
      <rect x="18" y="6" width="84" height="56" rx="5" fill="#fbf8f1" />
      <rect x="25" y="13" width="70" height="42" rx="2" fill="#0e4798" />
      <path d="M46 26l-8 8 8 8M74 26l8 8-8 8M64 22l-8 24" stroke="#fbf8f1" />
      <path d="M6 66h108l-8 12H14z" fill="#dfa4b8" />
      <path d="M50 71h20" />
    </svg>
  )
}

function Pencil() {
  return (
    <svg className="nb-doodle nb-pencil" viewBox="0 0 164 40" aria-hidden="true">
      <path d="M32 8h102v24H32z" fill="#f7de93" />
      <path d="M32 16h102M32 24h102" opacity="0.35" />
      <path d="M32 8 5 20l27 12z" fill="#f2ede2" />
      <path d="M5 20l10-4.5v9z" fill="#000a1a" />
      <path d="M134 8h9v24h-9z" fill="#c9ccd1" />
      <path d="M143 8h11a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-11z" fill="#dfa4b8" />
    </svg>
  )
}

// A pretzel, for Germany: one knot drawn twice, a thick ink line with the bake on top, and a few salt crystals
function Pretzel() {
  const knot =
    'M28 76C40 56 58 42 68 28 78 12 96 24 90 44 84 64 60 70 50 52 40 70 16 64 10 44 4 24 22 12 32 28 42 42 60 56 72 76'
  return (
    <svg className="nb-doodle nb-pretzel" viewBox="0 0 100 84" aria-hidden="true">
      <path d={knot} strokeWidth="15" />
      <path d={knot} stroke="#b4733a" strokeWidth="10" />
      <g fill="#fbf8f1" stroke="none">
        <rect x="20" y="30" width="4" height="3" rx="1" transform="rotate(20 22 31)" />
        <rect x="76" y="30" width="4" height="3" rx="1" transform="rotate(-25 78 31)" />
        <rect x="43" y="57" width="4" height="3" rx="1" />
        <rect x="14" y="50" width="3" height="3" rx="1" />
        <rect x="84" y="52" width="4" height="3" rx="1" transform="rotate(30 86 53)" />
      </g>
    </svg>
  )
}

// A wobbly hand-drawn checkbox; the ticked one gets its tick written in once the notebook's open
function Box({ ticked = false }) {
  return (
    <svg className="nb-box" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5c5-1.2 11-1 16-.4.8 5 .9 10 .3 15-5 .9-11 .8-16 .2-.9-5-1-9.8-.3-14.8z" />
      {ticked && <path className="nb-tick" pathLength="1" d="M5 11.5l5 6.5L22 1" />}
    </svg>
  )
}

// The left page (the inside of the cover): the sticky note, some doodles, and a little question with a link to
// the contact section
function Inside({ note, opened }) {
  const nb = useLang().t.about.notebook
  return (
    <div className="nb-inside">
      <Laptop />
      <div className={`nb-note${opened ? ' in' : ''}`}>{note}</div>
      <a className="nb-hire" href="#contact" aria-label={nb.hireLabel}>
        <span>{nb.hire}</span>
        <span className="nb-hire-opt">
          <Box />
          {nb.yes}
        </span>
        <span className="nb-hire-opt">
          <Box ticked />
          {nb.obviously}
        </span>
      </a>
      <Pretzel />
      <Pencil />
    </div>
  )
}

// The About Me section as a spiral notebook that starts closed and opens as you scroll on through it: the cover swings
// over to become the left page, with the sticky note on it, and the sentences are written on the lined right page.
export default function Notebook({ title, page, note }) {
  const { t } = useLang()
  const nb = t.about.notebook
  const book = useRef(null)
  const pin = useRef(null)
  const runway = useRef(null)
  const { opened, pinned } = useOpening(book, pin, runway)
  const spread = useSpread()
  const inside = <Inside note={note} opened={opened} />

  return (
    <div className={`nb-scroll${pinned ? ' pinned' : ''}`}>
      <div className="nb-pin" ref={pin}>
        {title}
        <div className={`notebook${opened ? ' opened' : ''}`} ref={book}>
          <div className="nb-book">
            <div className="nb-page nb-lined">
              {page}
              {!spread && inside}
            </div>
            <div className="nb-cover">
              <div className="nb-cover-front" aria-hidden="true">
                <div className="nb-label">
                  <small>{nb.owner}</small>
                  <b>Anja van Staden</b>
                  <small>{nb.subject}</small>
                </div>
                <span className="nb-sticker nb-sticker-za">
                  <FlagZA />
                </span>
                <span className="nb-sticker nb-sticker-nl">
                  <FlagNL />
                </span>
                <span className="nb-sticker nb-sticker-de">
                  <FlagDE />
                </span>
                <span className="nb-sticker nb-sticker-star">★</span>
                <span className="nb-hint">
                  {nb.hint}
                  <svg viewBox="0 0 24 24">
                    <path d="M12 4v15M6 13l6 6 6-6" />
                  </svg>
                </span>
                <span className="nb-band" />
              </div>
              {spread && <div className="nb-page nb-dotted nb-cover-back">{inside}</div>}
            </div>
            <span className="nb-rings" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="nb-runway" ref={runway} />
    </div>
  )
}
