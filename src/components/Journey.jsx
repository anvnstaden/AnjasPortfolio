import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Title from './Title.jsx'
import { NavArrow } from './Doodles.jsx'
import { FlagDE, FlagZA } from './Flags.jsx'
import { Europe, MosselBay, Stellenbosch } from './JourneyScenes.jsx'
import { journey } from '../data/content.js'

// Postcard art and stamp for each `scene` in content.js.
const scenes = {
  'mossel-bay': { Art: MosselBay, Flag: FlagZA, greeting: 'Greetings from Mossel Bay!' },
  stellenbosch: { Art: Stellenbosch, Flag: FlagZA, greeting: 'Groete uit Stellenbosch!' },
  europe: { Art: Europe, Flag: FlagDE, greeting: 'Grüße aus Deutschland!' },
}

// The sideways timeline only runs on wide screens; phones get a simple vertical list.
const WIDE = '(min-width: 900px)'

function useWide() {
  const [wide, setWide] = useState(() => matchMedia(WIDE).matches)
  useEffect(() => {
    const mq = matchMedia(WIDE)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}

const clamp01 = (n) => Math.min(1, Math.max(0, n))

// Pins the timeline while you scroll down and turns that scroll into sideways movement: the scroller is
// made as tall as the track is wide, and the track slides left as you scroll through it. Also fills the
// road up to the pin (--fill) and gives each stop an --enter value (0 → 1) as it slides onto the screen.
function useSideScroll(scroller, track, line, enabled) {
  useEffect(() => {
    if (!enabled) return
    const wrap = scroller.current
    const row = track.current
    const road = line.current
    const stops = road.querySelectorAll('.stop')
    let frame = 0
    let distance = 0

    const update = () => {
      frame = 0
      const vw = window.innerWidth
      const progress = distance > 0 ? clamp01(-wrap.getBoundingClientRect().top / distance) : 0
      const x = progress * distance
      row.style.translate = `${-x}px 0`
      road.style.setProperty('--fill', `${x + vw * 0.5 - road.offsetLeft}px`)
      for (const stop of stops) {
        const enter = clamp01((vw - stop.getBoundingClientRect().left) / (vw * 0.6))
        stop.style.setProperty('--enter', enter.toFixed(3))
        if (enter > 0.6) stop.querySelector('.postcard').classList.add('in')
      }
    }
    const end = row.querySelector('.journey-end')
    // The sideways scroll runs until "to be continued" sits in the middle of the screen. Measured from the
    // note itself (offsets ignore the track's translate), so it can't stop short of it.
    const measure = () => {
      distance = Math.max(0, end.offsetLeft + end.offsetWidth / 2 - window.innerWidth / 2)
      wrap.style.height = `${window.innerHeight + distance}px`
      update()
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }

    // Re-measure whenever the track's size changes (fonts loading, content or style changes), not only
    // on window resizes, so the scroll always runs all the way to "to be continued"
    const resized = new ResizeObserver(measure)
    resized.observe(row)
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      wrap.style.height = ''
      row.style.translate = ''
    }
  }, [scroller, track, line, enabled])
}

function Pin() {
  return (
    <svg className="journey-pin" viewBox="0 0 40 52" aria-hidden="true">
      <path d="M20 50C20 50 4 32 4 19a16 16 0 0 1 32 0c0 13-16 31-16 31Z" />
      <circle cx="20" cy="19" r="6" />
    </svg>
  )
}

export default function Journey() {
  const wide = useWide()
  const scroller = useRef(null)
  const track = useRef(null)
  const line = useRef(null)
  useSideScroll(scroller, track, line, wide)

  // On phones the postcards and cards use the usual scroll-in reveals instead of --enter.
  const reveal = (kind) => (wide ? '' : ` reveal ${kind}`)

  return (
    <section id="journey" className={`section journey-section${wide ? ' sideways' : ''} slide-section from-right`}>
      <div className="journey-scroller" ref={scroller}>
        <div className="journey-sticky">
          <div className="journey-track" ref={track}>
            <div className="journey-lead">
              <Title en="My Journey" de="Meine Reise" />
              <p className="journey-intro">
                From a seaside town on the Garden Route to Stellenbosch, and next, <mark className="hl">Germany</mark>.
              </p>
              {wide && (
                <p className="pen journey-hint" aria-hidden="true">
                  keep scrolling <NavArrow inline pen />
                </p>
              )}
            </div>

            <div className="journey-line" ref={line}>
              <span className="journey-road" aria-hidden="true" />
              <span className="journey-traveller" aria-hidden="true"><Pin /></span>
              <ol className="journey-stops">
                {journey.map((stop, i) => {
                  const { Art, Flag, greeting } = scenes[stop.scene]
                  const town = stop.place.split(',')[0]
                  return (
                    <li key={stop.scene} className={`stop${i % 2 ? ' flip' : ''}`}>
                      <span className="stop-when">{stop.when}</span>

                      <figure className={`postcard${reveal('pop')}`} style={{ '--r': i % 2 ? '3deg' : '-3deg' }}>
                        <div className="postcard-art">
                          <Art />
                        </div>
                        <span className="postcard-stamp" aria-hidden="true"><Flag /></span>
                        <span className="postcard-postmark" aria-hidden="true">
                          <span>{town}</span>
                          <span>{stop.when}</span>
                        </span>
                        <figcaption className="pen">{greeting}</figcaption>
                      </figure>

                      <div className={`stop-card${reveal('slide')}`} style={{ '--d': '150ms' }}>
                        <p className="stop-place">
                          <span className="stop-num">{String(i + 1).padStart(2, '0')}</span> {stop.place}
                        </p>
                        <h3>
                          {stop.title}
                          {stop.note && <span className="pen stop-note write">{stop.note}</span>}
                        </h3>
                        <p className="stop-text">{stop.text}</p>
                        <ul className="stop-stats">
                          {stop.stats.map((s) => (
                            <li key={s.label}>
                              <strong lang={s.lang}>{s.value}</strong>
                              <span>{s.label}</span>
                            </li>
                          ))}
                        </ul>
                        {stop.footnote && <p className="stop-footnote">{stop.footnote}</p>}
                        {stop.link && (
                          <Link to={stop.link.to} className="text-link">{stop.link.label} <NavArrow inline /></Link>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
            {/* The end of the road: a paper plane takes off from the note and loops away along a dashed
                trail, and the dots keep bouncing (see .journey-end in App.css) */}
            <div className="journey-end reveal">
              <svg className="end-trail" viewBox="0 0 260 150" aria-hidden="true">
                <path d="M30 128C80 130 96 84 132 82S176 120 196 96 214 30 250 16" />
              </svg>
              <span className="end-plane" aria-hidden="true">
                <svg viewBox="0 0 40 30">
                  <path className="plane-top" d="M2 15 38 2 26 28 18 18Z" />
                  <path className="plane-fold" d="M38 2 18 18 16 27 22 21" />
                </svg>
              </span>
              <p className="pen journey-end-text">
                to be continued
                <span className="end-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
