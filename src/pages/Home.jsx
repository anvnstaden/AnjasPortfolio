import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Split from '../components/Split.jsx'
import Title from '../components/Title.jsx'
import ProjectThumb from '../components/ProjectThumb.jsx'
import Journey from '../components/Journey.jsx'
import FactsWallet from '../components/FactsWallet.jsx'
import Blueprint from '../components/Blueprint.jsx'
import Lanyard from '../components/Lanyard.jsx'
import Notebook from '../components/Notebook.jsx'
import { Circle, NavArrow, PointingHand, Underline } from '../components/Doodles.jsx'
import { contact, skillProjects, skills } from '../data/content.js'
import { useLang } from '../i18n.js'

const listOf = (names, and) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} ${and} ${names.at(-1)}` : names[0])

// The "My Skills" desk: a big desktop computer whose screen is a little file browser. Each skill group is a
// folder in the sidebar; its skills are the files. Skills used in my projects are links: hovering (or tabbing
// to) one shows which projects in the status bar, and clicking it opens the projects page showing just those.
const skillIcons = ['✎', '</>', '{ }', 'f(x)', '⑂']
// Each folder has its own colour (and the text colour that reads on it)
const skillColors = [
  ['#2f6fd6', '#fff'],
  ['#f08fb0', '#000a1a'],
  ['#f7c948', '#000a1a'],
  ['#4fc08d', '#000a1a'],
  ['#9a7cf0', '#fff'],
]

// On phones the monitor is drawn as a phone held up in a hand instead, with the groups as an app's tab bar along the
// bottom. A tap picks a skill and slides up a card with where I used it (and a link to those projects); tapping it
// again opens them.
const PHONE = '(max-width: 760px)'

function usePhone() {
  const [phone, setPhone] = useState(() => matchMedia(PHONE).matches)
  useEffect(() => {
    const mq = matchMedia(PHONE)
    const onChange = () => setPhone(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return phone
}

// The phone's status bar clock: the visitor's own time, ticking over on the minute
function PhoneClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer
    const tick = () => {
      setNow(new Date())
      timer = setTimeout(tick, 60000 - (Date.now() % 60000))
    }
    timer = setTimeout(tick, 60000 - (Date.now() % 60000))
    return () => clearTimeout(timer)
  }, [])
  return <span>{now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}</span>
}

// Scrolling through the section is a camera move: it starts on the whole desk, pushes in until the
// monitor fills the screen (and holds there so the skills can be used), then pulls back out again.
const ZOOM_IN = 0.28
const ZOOM_OUT = 0.72
const smooth = (x) => x * x * (3 - 2 * x)

function useDeskZoom() {
  const pin = useRef(null)
  const stage = useRef(null)
  const desk = useRef(null)
  const monitor = useRef(null)
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const update = () => {
      frame = 0
      const area = stage.current
      const el = desk.current
      const box = monitor.current
      const rect = pin.current.getBoundingClientRect()
      const range = rect.height - area.offsetHeight
      const t = Math.min(1, Math.max(0, -rect.top / range))
      const k = still ? 1 : smooth(Math.min(1, t / ZOOM_IN)) * smooth(Math.min(1, (1 - t) / (1 - ZOOM_OUT)))
      area.style.setProperty('--title', String(1 - Math.min(1, k * 2.2)))
      // the screen's own animations only play once the camera has pushed all the way in
      el.classList.toggle('zoomed', k > 0.95)
      // On phones there's no desk: the hand brings the phone up from below the screen, tipping it upright as it
      // comes, holds it while you use it, and lowers it again. The title stays up, with the phone fitted below it
      if (matchMedia(PHONE).matches) {
        area.style.setProperty('--title', '1')
        const title = area.querySelector('.desk-title')
        const top = title.offsetTop + title.firstElementChild.offsetTop + title.firstElementChild.offsetHeight + 28
        const scale = Math.min((area.offsetWidth * 0.75) / box.offsetWidth, (area.offsetHeight - top - 20) / box.offsetHeight)
        const fx = el.offsetWidth / 2
        const x = area.offsetWidth * 0.5 - el.offsetLeft - scale * fx
        const y = top - el.offsetTop - scale * box.offsetTop + (1 - k) * area.offsetHeight * 0.9
        el.style.transformOrigin = '0 0'
        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
        box.style.rotate = `${((1 - k) * -14).toFixed(2)}deg`
        return
      }
      box.style.rotate = ''
      // Scale that shows the whole desk, and the scale that fits the monitor in the view
      const out = Math.min((area.offsetWidth * 0.94) / el.offsetWidth, (area.offsetHeight * 0.86) / el.offsetHeight)
      const fit = Math.min((area.offsetWidth * 0.94) / box.offsetWidth, (area.offsetHeight * 0.78) / box.offsetHeight)
      const scale = out + (fit - out) * k
      // The point of the desk that sits in the middle of the view: its centre, sliding to the monitor
      const fx = el.offsetWidth / 2
      const fy = el.offsetHeight / 2 + (box.offsetTop + box.offsetHeight / 2 - el.offsetHeight / 2) * k
      const x = area.offsetWidth / 2 - el.offsetLeft - scale * fx
      const y = area.offsetHeight / 2 + 32 * k - el.offsetTop - scale * fy
      el.style.transformOrigin = '0 0'
      el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    if (!still) window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])
  return { pin, stage, desk, monitor }
}

// Faint moving doodles behind each folder's skills, in the folder's colour: fonts flicking for design, code
// typing itself out, braces opening and closing, a graph drawing itself and a git branch merging back in.
function Backdrop({ kind }) {
  if (kind === 0) {
    return (
      <span className="bd bd-fonts" aria-hidden="true">
        {['Aa', 'Gg', 'Rr'].map((t, n) => (
          <span key={t} className="bd-stack" style={{ '--n': n }}>
            <span>{t}</span><span>{t}</span><span>{t}</span><span>{t}</span>
          </span>
        ))}
      </span>
    )
  }
  if (kind === 1) {
    return (
      <span className="bd bd-code" aria-hidden="true">
        {[...'</>'].map((ch, k) => <span key={k} style={{ '--k': k }}>{ch}</span>)}
        <i className="caret" />
      </span>
    )
  }
  if (kind === 2) {
    return (
      <span className="bd bd-braces" aria-hidden="true">
        <span>{'{'}</span><span className="dots">···</span><span>{'}'}</span>
      </span>
    )
  }
  if (kind === 3) {
    return (
      <span className="bd bd-graph" aria-hidden="true">
        <svg viewBox="0 0 400 200">
          {[40, 100, 160, 220, 280, 340].map((x, n) => (
            <rect key={x} x={x} y={190 - (n % 3) * 20 - 30} width="28" height={(n % 3) * 20 + 30} rx="6" style={{ '--n': n }} />
          ))}
          <path pathLength="1" d="M0 150C40 150 50 70 100 70S160 130 210 110 270 20 320 40 380 80 400 60" />
        </svg>
      </span>
    )
  }
  return (
    <span className="bd bd-git" aria-hidden="true">
      <svg viewBox="0 0 400 140">
        <path className="trunk" pathLength="1" d="M10 100H390" />
        <path className="branch" pathLength="1" d="M90 100C130 100 130 30 180 30H260C310 30 310 100 350 100" />
        <circle cx="10" cy="100" r="11" />
        <circle cx="90" cy="100" r="11" />
        <circle className="late" cx="220" cy="30" r="11" />
        <circle className="late" cx="350" cy="100" r="11" />
        <circle cx="390" cy="100" r="11" />
      </svg>
    </span>
  )
}

// The wall clock: the clock face drawing with real hands on top that keep the time (the viewer's local time)
function WallClock() {
  const hour = useRef(null)
  const minute = useRef(null)
  const second = useRef(null)
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const s = now.getSeconds()
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60
      hour.current.style.transform = `rotate(${(h * 30).toFixed(2)}deg)`
      minute.current.style.transform = `rotate(${(m * 6).toFixed(2)}deg)`
      second.current.style.transform = `rotate(${s * 6}deg)`
    }
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="decor decor-clock">
      <img src="/desk_decor/wall-clock-face.svg" alt="" loading="lazy" />
      <svg viewBox="0 0 375 375">
        <g ref={hour} className="hand hour"><rect x="183.5" y="112" width="8" height="84" rx="4" /></g>
        <g ref={minute} className="hand minute"><rect x="184.5" y="78" width="6" height="118" rx="3" /></g>
        <g ref={second} className="hand second">
          <rect x="186.2" y="66" width="2.6" height="140" rx="1.3" />
          <circle cx="187.5" cy="187.5" r="6" />
        </g>
        <circle cx="187.5" cy="187.5" r="5" className="hub" />
      </svg>
    </span>
  )
}

function SkillsDesk() {
  const { t, content } = useLang()
  const projectTitle = (slug) => content.projects.find((p) => p.slug === slug).title
  const { pin, stage, desk, monitor } = useDeskZoom()
  const groups = Object.entries(skills)
  const [open, setOpen] = useState(0)
  const [active, setActive] = useState(null)
  const [group, items] = groups[open]
  const used = active && skillProjects[active]
  const phone = usePhone()
  // With a mouse or the keyboard, pointing at a skill shows where I used it; on a phone the first tap does
  const point = (s) => (phone ? {} : {
    onMouseEnter: () => setActive(s),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(s),
    onBlur: () => setActive(null),
  })
  const status = (
    <p className={`screen-status${used ? ' on' : ''}`} aria-live="polite">
      {used ? (
        <>
          <strong>{content.skillName(active)}</strong>{` ${t.skills.in} `}
          {used.length === content.projects.length ? t.skills.all : listOf(used.map(projectTitle), t.skills.and)}
          {phone && (
            <>
              <Link className="status-see" to={`/projects?skill=${encodeURIComponent(active)}`}>
                {t.skills.see} <NavArrow inline />
              </Link>
              <button type="button" className="status-close" aria-label={t.skills.close} onClick={() => setActive(null)}>×</button>
            </>
          )}
        </>
      ) : phone ? (
        t.skills.tap
      ) : (
        <>
          <span className="hover-only">{t.skills.hover}</span>
          <span className="touch-only">{t.skills.tap}</span>
        </>
      )}
    </p>
  )
  return (
    <div className="desk-pin" ref={pin}>
      <div className="desk-stage" ref={stage}>
        <div className="desk-title">
          <Title text={t.skills.title} />
        </div>
    <div className="desk" ref={desk} translate="no">
      <div className="desk-wall" aria-hidden="true">
        {[
          ['bottle', 'water'],
          ['coffee', 'coffee'],
          ['pens', 'penholder'],
          ['plant', 'plant'],
        ].map(([cls, file]) => (
          <img key={cls} className={`decor decor-${cls}`} src={`/desk_decor/${file}.svg`} alt="" loading="lazy" />
        ))}
        <WallClock />
        {/* the lamp: the switched-off drawing with the lit one on top, which flickers on and off */}
        <span className="decor decor-lamp">
          <img src="/desk_decor/lamp_off.svg" alt="" loading="lazy" />
          <img className="lamp-on" src="/desk_decor/lamp.svg" alt="" loading="lazy" />
        </span>
      </div>

      <div className="monitor" ref={monitor}>
        {/* On phones a hand holds the phone up from behind, its fingertips and thumb showing past the edges */}
        <img className="hold-hand" src="/holding_hand.webp" alt="" aria-hidden="true" loading="lazy" draggable="false" />
        <div className="monitor-bezel">
          <div className="screen" style={{ '--c': skillColors[open % skillColors.length][0], '--on': skillColors[open % skillColors.length][1] }}>
            {/* the phone's status bar, with its camera island (phones only) */}
            <div className="screen-phonebar" aria-hidden="true">
              <PhoneClock />
              <i />
              <span>5G ▮▮▮</span>
            </div>
            <div className="screen-window">
            <div className="screen-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="screen-path">anja / {t.skills.path} / {content.groupName(group).toLowerCase()}</span>
            </div>
            <div className="screen-body">
              <nav className="screen-side" aria-label={t.skills.groups}>
                {groups.map(([name], k) => (
                  <button
                    key={name}
                    type="button"
                    className={k === open ? 'on' : undefined}
                    style={{ '--c': skillColors[k % skillColors.length][0], '--on': skillColors[k % skillColors.length][1] }}
                    aria-pressed={k === open}
                    onClick={() => {
                      setOpen(k)
                      setActive(null)
                    }}
                  >
                    <span className="side-icon" aria-hidden="true">{skillIcons[k % skillIcons.length]}</span>
                    <span className="side-name">{content.groupName(name)}</span>
                    <span className="side-short">{t.skills.short[k]}</span>
                  </button>
                ))}
              </nav>
              <div className="screen-main" key={group}>
                <Backdrop kind={open % 5} />
                <h3>{content.groupName(group)}</h3>
                <ul>
                  {items.map((s, k) => (
                    <li
                      key={s}
                      className={[skillProjects[s] && 'linked', phone && active === s && 'picked'].filter(Boolean).join(' ') || undefined}
                      style={{ '--k': k }}
                    >
                      {skillProjects[s] ? (
                        <Link
                          to={`/projects?skill=${encodeURIComponent(s)}`}
                          {...point(s)}
                          onClick={(e) => {
                            if (phone && active !== s) {
                              e.preventDefault()
                              setActive(s)
                            }
                          }}
                        >
                          {content.skillName(s)}
                        </Link>
                      ) : (
                        content.skillName(s)
                      )}
                    </li>
                  ))}
                </ul>
                {phone && status}
              </div>
            </div>
            </div>
            {!phone && status}
          </div>
        </div>
        <div className="monitor-neck" aria-hidden="true" />
        <div className="monitor-foot" aria-hidden="true" />
      </div>

      <div className="desk-furniture" aria-hidden="true">
        <i className="desk-leg back left" />
        <i className="desk-leg back right" />
        <i className="desk-leg front left" />
        <i className="desk-leg front right" />
        <i className="desk-apron" />
        <i className="desk-slab" />
      </div>
    </div>
      </div>
    </div>
  )
}

// How far (px) you scroll before the badge rips off the navbar.
const RIP_AT = 60

// Keeps the badge hanging from the top of the browser: measures how long its strap must be to reach
// all the way up (behind the navbar), holds it in place as the page starts scrolling, and rips it
// (strap and all) off past RIP_AT.
// It hangs back up when you return to the top.
function useRipOffNavbar(badge) {
  const [state, setState] = useState('hanging') // 'hanging' | 'ripped' | 'rehung'

  useEffect(() => {
    const visual = badge.current.parentElement
    const nav = document.querySelector('.nav')
    if (!nav) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let ripped = false
    let frame = 0

    // Offsets ignore transforms, so this works while the hero is still popping in.
    const measure = () => {
      let top = badge.current.offsetTop
      for (let el = visual; el; el = el.offsetParent) top += el.offsetTop
      visual.style.setProperty('--reach', `${Math.max(0, top + 4)}px`)
    }

    const update = () => {
      frame = 0
      const y = window.scrollY
      if (!ripped && y >= RIP_AT && !still) {
        ripped = true
        visual.style.setProperty('--pull', `${RIP_AT}px`)
        visual.style.setProperty('--tension', 1)
        setState('ripped')
      } else if (ripped && y < 10) {
        ripped = false
        setState('rehung')
      }
      if (!ripped && !still) {
        visual.style.setProperty('--pull', `${y}px`)
        visual.style.setProperty('--tension', (y / RIP_AT) ** 2)
      }
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }

    // Re-measure whenever the hero's layout shifts (resizing, web fonts loading in).
    const hero = visual.parentElement
    const resized = new ResizeObserver(measure)
    for (const el of [hero, ...hero.children, nav]) resized.observe(el)
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [badge])

  return state === 'hanging' ? '' : ` ${state}`
}

// Makes the badge something you can play with: grab it and it follows your hand anywhere on the screen, on a strap
// that stays tied to the top of the browser. Let go and it swings and bounces back, carrying the speed of the throw.
// It also leans a little towards the mouse, and until someone first drags it, it gets a tug every few seconds to show
// that it moves. Flipped over it comes to rest and stays put, so the back can be read and used. The motion goes to
// CSS as --swing, --stretch, --hang, --twist, --pitch and --sheen. The card is a solid object: it turns and tips on its
// clip as it moves, wobbling back on a spring, and under the mouse it dips towards the cursor. Returns whether the last press was a drag, so that letting go
// doesn't also flip the card.
const TILT_LIMIT = 18 // degrees the card itself leans; further out the strap takes the angle and the card stays upright
const HOVER_TURN = 16 // degrees the card turns and tips with the mouse at its edge, or when it's held by its edge
const HOVER_TIP = 10
const SLACK_LIMIT = 140 // px the bounce can throw it up past where it hangs
const LEAN = 3 // degrees, with the mouse at the edge of the screen
const FIRST_TUG = 3400 // ms after loading, then every TUG_EVERY, at most TUGS times
const TUG_EVERY = 5000
const TUGS = 6
const softLimit = (value, limit) => limit * Math.tanh(value / limit)

function useBadgeSwing(badge, flipped, onFirstDrag) {
  const dragged = useRef(false)
  const applyFlipped = useRef(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = badge.current
    const hero = el.closest('.hero')
    let grab = null
    let angle = 0
    let spin = 0
    let stretch = 0
    let bounce = 0
    let lean = 0
    let frame = 0
    let last = 0
    let everDragged = false
    let tugs = 0
    let tugTimer = 0
    let resting = false
    let yaw = 0
    let yawSpeed = 0
    let pitch = 0
    let pitchSpeed = 0
    let aimYaw = 0
    let aimPitch = 0

    // The strap hangs from the top of the browser, straight above the middle of the badge
    const pivotX = () => {
      const r = el.parentElement.getBoundingClientRect()
      return r.left + r.width / 2
    }
    // Where the badge should be for a given spot on screen: the angle from the strap's top and how far it's stretched
    const hangLength = () => parseFloat(el.parentElement.style.getPropertyValue('--reach')) || 0
    const aim = (x, y) => {
      const across = x - pivotX()
      const down = Math.max(y, 30)
      return { angle: (-Math.atan2(across, down) * 180) / Math.PI, stretch: Math.hypot(across, down) - hangLength() }
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      if (el.classList.contains('ripped')) {
        angle = spin = stretch = bounce = yaw = yawSpeed = pitch = pitchSpeed = 0
      } else if (resting) {
        // Eases to a stop, hanging straight
        const ease = 1 - Math.exp(-dt * 9)
        angle -= angle * ease
        stretch -= stretch * ease
        yaw -= yaw * ease
        pitch -= pitch * ease
        spin = bounce = yawSpeed = pitchSpeed = 0
      } else if (grab?.target) {
        // Stays under the hand, remembering how fast it's moving for the throw when it's let go
        const follow = 1 - Math.exp(-dt * 60)
        const nextAngle = angle + (grab.target.angle - angle) * follow
        const nextStretch = stretch + (grab.target.stretch - stretch) * follow
        if (dt) {
          spin = spin * 0.7 + ((nextAngle - angle) / dt) * 0.3
          bounce = bounce * 0.7 + ((nextStretch - stretch) / dt) * 0.3
        }
        angle = nextAngle
        stretch = nextStretch
      } else {
        // A pendulum that takes its time to lose its swing, on a strap that keeps springing back
        spin += (-(angle - lean) * 34 - spin * 0.7) * dt
        angle += spin * dt
        bounce += (-stretch * 200 - bounce * 5) * dt
        stretch += bounce * dt
        if (stretch < -SLACK_LIMIT && bounce < 0) bounce *= -0.4
      }
      if (!resting) {
        // Swinging sideways turns the card and bouncing tips it, then it wobbles back like a real one on its clip
        yawSpeed += (-(yaw - aimYaw) * 70 - yawSpeed * 5 + spin * 3) * dt
        yaw += yawSpeed * dt
        pitchSpeed += (-(pitch - aimPitch) * 70 - pitchSpeed * 5 + bounce * 0.4) * dt
        pitch += pitchSpeed * dt
      }
      el.style.setProperty('--swing', `${angle.toFixed(3)}deg`)
      el.style.setProperty('--stretch', `${stretch.toFixed(2)}px`)
      el.style.setProperty('--twist', `${softLimit(yaw, 42).toFixed(2)}deg`)
      el.style.setProperty('--pitch', `${softLimit(pitch, 28).toFixed(2)}deg`)
      el.style.setProperty('--sheen', (yaw / 30 + pitch / 60).toFixed(3))
      el.style.setProperty('--hang', `${(softLimit(angle, TILT_LIMIT) - angle).toFixed(3)}deg`)
      const settled = !grab && Math.abs(angle - lean) < 0.01 && Math.abs(spin) < 0.01 && Math.abs(stretch) < 0.05 && Math.abs(bounce) < 0.05 &&
        Math.abs(yaw - aimYaw) < 0.02 && Math.abs(yawSpeed) < 0.02 && Math.abs(pitch - aimPitch) < 0.02 && Math.abs(pitchSpeed) < 0.02
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const tug = () => {
      if (everDragged || tugs >= TUGS) return
      tugTimer = setTimeout(tug, TUG_EVERY)
      if (grab || resting || window.scrollY > 0) return
      spin += tugs % 2 ? -60 : 60
      bounce += 170
      tugs += 1
      wake()
    }
    tugTimer = setTimeout(tug, FIRST_TUG)

    // The card turns towards where the mouse or hand is on it
    const aimAt = (e) => {
      const r = el.getBoundingClientRect()
      aimYaw = softLimit((e.clientX - (r.left + r.width / 2)) / (r.width / 2), 1) * HOVER_TURN
      aimPitch = softLimit((r.top + r.height / 2 - e.clientY) / (r.height / 2), 1) * HOVER_TIP
    }

    const onPress = (e) => {
      dragged.current = false
      // the links and the signature strip on the back have their own jobs
      if (resting || e.button !== 0 || e.target.closest('a, .badge-sign')) return
      // where on the badge it was picked up, so it doesn't jump to the hand
      const length = hangLength() + stretch
      const turned = (angle * Math.PI) / 180
      grab = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        offsetX: e.clientX - (pivotX() - length * Math.sin(turned)),
        offsetY: e.clientY - length * Math.cos(turned),
      }
      el.classList.add('held')
      aimAt(e)
      wake()
    }
    const onMove = (e) => {
      if (!grab) {
        if (!resting && e.pointerType === 'mouse' && !e.target.closest?.('.badge-sign')) {
          lean = Math.max(-1, Math.min(1, (e.clientX - pivotX()) / (innerWidth / 2))) * -LEAN
          if (e.target.closest?.('.badge') === el) aimAt(e)
          else aimYaw = aimPitch = 0
          wake()
        }
        return
      }
      if (grab.id !== e.pointerId) return
      if (!dragged.current && Math.hypot(e.clientX - grab.x, e.clientY - grab.y) < 3) return
      dragged.current = true
      if (!everDragged) {
        everDragged = true
        onFirstDrag()
      }
      grab.target = aim(e.clientX - grab.offsetX, e.clientY - grab.offsetY)
    }
    const onRelease = (e) => {
      if (grab?.id !== e.pointerId) return
      grab = null
      el.classList.remove('held')
      aimYaw = aimPitch = 0
      // a wild throw still comes back in one piece
      spin = Math.max(-420, Math.min(420, spin))
      bounce = Math.max(-2500, Math.min(2500, bounce))
      wake()
    }
    const onLeave = () => {
      lean = aimYaw = aimPitch = 0
      wake()
    }

    applyFlipped.current = (on) => {
      resting = on
      if (on) {
        grab = null
        lean = aimYaw = aimPitch = 0
        el.classList.remove('held')
        // CSS pauses the idle swing where it happens to be; this carries on from that tilt, from its upright point
        const swing = el.getAnimations().find((a) => a.animationName === 'swing')
        if (swing) {
          angle += parseFloat(getComputedStyle(el).rotate) || 0
          swing.currentTime = swing.effect.getComputedTiming().delay + 1250
        }
      }
      wake()
    }

    el.addEventListener('pointerdown', onPress)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onRelease)
    window.addEventListener('pointercancel', onRelease)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(tugTimer)
      el.removeEventListener('pointerdown', onPress)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onRelease)
      window.removeEventListener('pointercancel', onRelease)
      hero.removeEventListener('pointerleave', onLeave)
      el.style.removeProperty('--swing')
      el.style.removeProperty('--stretch')
      el.style.removeProperty('--twist')
      el.style.removeProperty('--hang')
      el.style.removeProperty('--pitch')
      el.style.removeProperty('--sheen')
    }
  }, [badge, onFirstDrag])

  useEffect(() => {
    applyFlipped.current?.(flipped)
  }, [flipped])

  return dragged
}

// The strip on the back of the badge, where visitors can sign with the pen they've been holding all along. The
// signature only lives on the page: nothing is saved or sent anywhere.
function BadgeSignature() {
  const { t } = useLang()
  const canvas = useRef(null)
  const stroke = useRef(null)
  const [signed, setSigned] = useState(false)

  // The drawing surface matches the strip's real size, sharp on high-resolution screens
  useEffect(() => {
    const el = canvas.current
    const fit = () => {
      const scale = window.devicePixelRatio || 1
      const width = Math.round(el.offsetWidth * scale)
      const height = Math.round(el.offsetHeight * scale)
      if (el.width === width && el.height === height) return
      el.width = width
      el.height = height
      const ctx = el.getContext('2d')
      ctx.scale(scale, scale)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 2.2
      ctx.strokeStyle = '#0e4798'
    }
    fit()
    const resized = new ResizeObserver(fit)
    resized.observe(el)
    return () => resized.disconnect()
  }, [])

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    stroke.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
  }
  const move = (e) => {
    if (!stroke.current) return
    const { x, y } = stroke.current
    const { offsetX, offsetY } = e.nativeEvent
    const ctx = canvas.current.getContext('2d')
    // curves through the middle of each step, so quick strokes stay smooth
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x, y, (x + offsetX) / 2, (y + offsetY) / 2)
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
    stroke.current = { x: offsetX, y: offsetY }
    setSigned(true)
  }
  const up = () => {
    stroke.current = null
  }
  const clear = () => {
    const el = canvas.current
    const ctx = el.getContext('2d')
    // in device pixels: the drawing scale can be under 1 (a zoomed-out browser), which would leave the far edges behind
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, el.width, el.height)
    ctx.restore()
    setSigned(false)
  }

  return (
    <div className="badge-sign">
      <canvas ref={canvas} aria-hidden="true" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      {!signed && <span className="badge-sign-hint pen" aria-hidden="true">✕ {t.badge.signHere}</span>}
      <span className="badge-sign-foot" aria-hidden={!signed}>
        <small>{signed ? t.badge.signed : t.badge.yourSignature}</small>
        {signed && <button type="button" onClick={clear}>{t.badge.clear}</button>}
      </span>
    </div>
  )
}

// Hanging ID badge with the profile photo. It flips over when you click or tap it, and can be dragged around the
// screen on its strap (see useBadgeSwing). Handwritten notes point out each of those until they've been tried.
function IdBadge() {
  const { t } = useLang()
  const [photoMissing, setPhotoMissing] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [flipHint, setFlipHint] = useState(true)
  const [dragHint, setDragHint] = useState(true)
  const hideDragHint = useCallback(() => setDragHint(false), [])
  const flip = () => {
    setFlipped((f) => !f)
    setFlipHint(false)
  }
  const badge = useRef(null)
  const rip = useRipOffNavbar(badge)
  const dragged = useBadgeSwing(badge, flipped, hideDragHint)

  return (
    <>
    {dragHint && !flipped && !rip && (
      <span className="badge-hint drag" aria-hidden="true">
        <span className="pen">{t.badge.dragMe}</span>
        <svg viewBox="0 0 60 20">
          <path d="M4 10H56M13 3L4 10L13 17M47 3L56 10L47 17" />
        </svg>
      </span>
    )}
    {flipHint && !rip && (
      <span className="badge-hint flip" aria-hidden="true">
        <span className="pen">{t.badge.flipMe}</span>
        <svg viewBox="0 0 60 40">
          <path d="M4 8C20 2 40 8 50 28" />
          <path d="M38 24L51 30L54 16" />
        </svg>
      </span>
    )}
    <div
      ref={badge}
      className={`badge${flipped ? ' flipped' : ''}${rip}`}
      onClick={(e) => {
        if (e.target.closest('a, .badge-sign')) return
        // e.detail is 0 for Enter or Space on the flip button, which is never the end of a drag
        if (!e.detail || !dragged.current) flip()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          flip()
        }
      }}
    >
      {/* for the keyboard and screen readers; the mouse and touch just use the card itself */}
      <button type="button" className="badge-flip" aria-pressed={flipped} aria-label={t.badge.label} />
      {/* the card hangs from its clip, so it can stay upright while the strap goes off at an angle */}
      <div className="badge-body">
        <span className="badge-shadow" aria-hidden="true" />
        {/* a solid card: it tilts as one piece, the clip in front, and its thickness is a stack of layers */}
        <div className="badge-tilt">
        <span className="badge-clip" aria-hidden="true" />
        <div className="badge-card">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <i className="badge-edge" style={{ '--i': i }} aria-hidden="true" key={i} />)}
          <div className="badge-face badge-front" aria-hidden={flipped}>
            <span className="badge-slot" aria-hidden="true" />
            <div className="badge-portrait">
              <div className="badge-photo">
                {photoMissing ? (
                  <span className="monogram">AvS</span>
                ) : (
                  <img src="/profile.webp" alt="Anja van Staden" draggable="false" onError={() => setPhotoMissing(true)} />
                )}
              </div>
              <span className="badge-sticker" aria-hidden="true"><img src="/favicon.svg" alt="" /></span>
            </div>
            <p className="badge-name">An<span className="char char-j">j</span>a<br />van Staden</p>
            <p className="badge-role">{t.badge.role}</p>
            <span className="badge-id" aria-hidden="true">
              <span className="badge-barcode" />
              <span>ID 2027-0001</span>
            </span>
          </div>
          <div className="badge-face badge-back" inert={!flipped}>
            <span className="badge-slot" aria-hidden="true" />
            {/* the back of a real access card: magnetic stripe, the details, ways to get in touch and a signature strip */}
            <span className="badge-stripe" aria-hidden="true" />
            <div className="badge-back-main">
              <span className="badge-seal"><img src="/favicon.svg" alt="" /></span>
              <ul className="badge-back-info">
                <li><small>{t.badge.basedIn}</small>{t.badge.basedInValue}</li>
                <li><small>{t.badge.movingTo}</small>{t.badge.movingToValue}</li>
                <li><small>{t.badge.validFrom}</small>2027</li>
              </ul>
            </div>
            <div className="badge-contact">
              <a href={`mailto:${contact.email}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7 12 13l8.5-6" /></svg>
                {t.badge.email}
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v6M8 7.5v.01M12 17v-6M12 14a2.5 2.5 0 0 1 5 0v3" /></svg>
                {t.badge.linkedin}
              </a>
              <a href={contact.cv} download>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10.5l5 5 5-5M4 20h16" /></svg>
                {t.badge.cv}
              </a>
            </div>
            <BadgeSignature />
            <p className="badge-small-print">{t.badge.smallPrint}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  )
}

// The letters of a hero button's label, which hop in a wave on hover
function HopLabel({ text }) {
  return (
    <span className="fun-label" aria-hidden="true">
      {[...text].map((ch, i) => (
        <i style={{ '--i': i }} key={i}>{ch}</i>
      ))}
    </span>
  )
}

// The hero's two buttons, tilted like stickers. A project folder with work sticking out of the top, which fans out
// on hover while a page rises inside the little icon...
function FolderButton({ copy, label, ...rest }) {
  const Tag = copy ? 'span' : Link
  return (
    <Tag className="fun-btn folder-btn" aria-label={label} {...(!copy && { to: '/projects' })} {...rest}>
      <span className="fun-peek" aria-hidden="true"><i /><i /><i /></span>
      <span className="fun-face">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect className="btn-page" x="7" y="8" width="10" height="9" rx="1" />
          <path className="btn-cover" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        <HopLabel text={label} />
      </span>
    </Tag>
  )
}

// ...and an envelope with a letter sticking out, which pops up on hover with a few hearts floating off it.
function EnvelopeButton({ copy, label }) {
  const Tag = copy ? 'span' : Link
  return (
    <Tag className="fun-btn mail-btn" aria-label={label} {...(!copy && { to: '/#contact' })}>
      <span className="fun-peek" aria-hidden="true">
        <i>♥</i>
        <b>♥</b>
        <b>♥</b>
        <b>♥</b>
      </span>
      <span className="fun-face">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect className="btn-cover" x="3" y="6" width="18" height="14" rx="2" />
          <path className="btn-flap" d="M3.5 6.5h17L12 13.5z" />
        </svg>
        <HopLabel text={label} />
      </span>
    </Tag>
  )
}

// The text side of the hero. It is drawn twice: once for real, and once as the blueprint under it (`copy`),
// where elements carry their name and the code behind them for the blueprint's labels (see Blueprint.jsx).
function HeroText({ copy = false }) {
  const { t } = useLang()
  const bp = (name, code) => (copy ? { 'data-bp': name, ...(code && { 'data-code': code }) } : {})
  const Name = copy ? 'div' : 'h1'
  return (
    <div className={`hero-text${copy ? ' bp-copy' : ''}`}>
      <Name className="hero-name" {...bp('h1.hero-name', '<h1 className="hero-name">Anja</h1>')}>
        <Split text="Anja" />
        <Split text="van Staden" className="accent-line" offset={4} />
      </Name>
      <p className="hero-role hero-fade" style={{ '--d': '700ms' }} {...bp('p.hero-role')}>
        {t.hero.role[0]} <span className="pen amp">&amp;</span> {t.hero.role[1]}
      </p>
      <p className="pen hero-note write" style={{ '--d': '1100ms' }} {...bp('p.hero-note')}>
        {t.hero.note}
        <Underline className="draw" />
      </p>
      <div className={`hero-actions${copy ? '' : ' hero-fade'}`} style={copy ? undefined : { '--d': '950ms' }}>
        <FolderButton copy={copy} label={t.hero.viewProjects} {...bp('Button/primary', '<FolderButton to="/projects" />')} />
        <EnvelopeButton copy={copy} label={t.hero.getInTouch} />
      </div>
      {copy && (
        <div className="bp-palette">
          {[['--ink', '#000A1A'], ['--blue', '#0E4798'], ['--pink', '#DFA4B8'], ['--butter', '#F7DE93'], ['--cream', '#FBF8F1']].map(([name, value]) => (
            <span key={name}>
              <i style={{ background: value }} />
              {name} <b>{value}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// The blueprint intro plays once per visit: not when arriving part-way down the page, or for reduced motion.
const INTRO_KEY = 'hero-intro-seen'
let introSeen = false

function shouldPlayIntro() {
  if (introSeen || window.location.hash || window.scrollY > 0) return false
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem(INTRO_KEY)
  } catch {
    return true // storage unavailable (private mode); introSeen still stops it replaying
  }
}

function Hero() {
  const [intro, setIntro] = useState(() => (shouldPlayIntro() ? 'playing' : undefined))
  const endIntro = useCallback(() => {
    introSeen = true
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // Storage unavailable; it just plays again on the next full page load.
    }
    setIntro('done')
  }, [])

  return (
    <section className="hero" data-intro={intro}>
      <HeroText />
      <Lanyard />

      <div className="hero-visual">
        <IdBadge />
      </div>

      {/* Under it all, its blueprint: the Inspect button lets you look through (see Blueprint.jsx) */}
      <Blueprint intro={intro} onIntroEnd={endIntro}>
        <HeroText copy />
      </Blueprint>
    </section>
  )
}

// Opens the contact envelope every time most of it scrolls into view: the flap folds open, the letter
// slides up, and the links pop out (all timed in CSS off the .open class). Once it has gone completely
// off screen it closes again, ready to open the next time you come back.
function useEnvelope(envelope) {
  useEffect(() => {
    const el = envelope.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          el.classList.add('open')
          el.classList.remove('shut')
        } else if (!entry.isIntersecting) el.classList.remove('open', 'shut')
      },
      { threshold: [0, 0.6] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [envelope])

  // Clicking the envelope (anywhere but the email link) closes the letter back up, or opens it again.
  // Closing it this way (.shut) shows a little "click me!" prompt until it's opened again.
  const toggle = (e) => {
    if (e.target.closest('a')) return
    if (e.type === 'keydown') {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
    }
    const open = envelope.current.classList.toggle('open')
    envelope.current.classList.toggle('shut', !open)
  }
  return toggle
}

// The About Me sentences, which have highlights and doodles in them.
function Statements() {
  const { lang } = useLang()
  const software = <span className="circled">Software<Circle className="draw" /></span>
  if (lang === 'de') {
    return (
      <div className="statements">
        <p className="statement reveal">
          Ich gestalte <mark className="hl">Oberflächen, die Freude machen</mark>, und entwickle die {software} dahinter.
        </p>
        <p className="statement reveal">
          Ich studiere im letzten Jahr <mark className="hl">Informatik &amp; Operations Research</mark> an der
          Universität Stellenbosch und habe ein Faible für UI/UX, Produktdesign und Frontend.
        </p>
        <p className="statement reveal">
          <span className="underlined">Stolze Südafrikanerin &amp; Niederländerin,<Underline className="draw" /></span>{' '}
          ich lerne Deutsch und suche ab 2027 eine Stelle, <mark className="hl">egal wo in Deutschland</mark>.
        </p>
      </div>
    )
  }
  return (
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
        <span className="underlined">Proudly South African &amp; Dutch,<Underline className="draw" /></span>{' '}
        learning German, and looking for roles <mark className="hl">anywhere in Germany</mark> from 2027.
      </p>
    </div>
  )
}

export default function Home() {
  const { t, content } = useLang()
  const projects = content.projects
  const featured = projects.filter((p) => p.featured)
  const envelope = useRef(null)
  const toggleEnvelope = useEnvelope(envelope)

  // The "all projects" sticker beside the title. On phones it's hidden, and the rest of the projects come after
  // the featured cards instead, as a deck of cards (once you've seen three and want the rest).
  const moreLink = (
    <Link to="/projects" className="more-link more-top reveal" aria-label={t.work.seeAll(projects.length)}>
      <span className="pen write" aria-hidden="true">{t.work.more}</span>
      {/* A round sticker: the text spins around the rim, the count and an arrow sit in the middle */}
      <span className="more-stamp" aria-hidden="true">
        <svg className="more-ring" viewBox="0 0 120 120">
          <path id="more-ring-path" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" fill="none" />
          <text>
            <textPath href="#more-ring-path" textLength="282" lengthAdjust="spacing">
              {t.work.ring}
            </textPath>
          </text>
        </svg>
        <span className="more-core">
          <strong>{projects.length}</strong>
          <small>{t.work.projects}</small>
          <NavArrow inline />
        </span>
      </span>
    </Link>
  )

  return (
    <main>
      <Hero />

      <section id="about" className="section slide-section from-left">
        <Notebook
          title={<Title text={t.about.title} />}
          page={<Statements />}
          note={
            <aside className="sticky-note">
              <p>{t.about.currently}</p>
              <ul>
                {t.about.now.map((line) => <li key={line}><NavArrow inline pen />{line}</li>)}
              </ul>
              <PointingHand className="note-hand" />
            </aside>
          }
        />
      </section>

      <FactsWallet />

      <Journey />

      <section id="work" className="section slide-section from-left">
        <div className="section-head">
          <Title text={t.work.title} />
          {moreLink}
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
                <h3>{p.title}</h3>
                <p className="card-desc">{p.description}</p>
                <span className="card-more">
                  <span className="card-more-text">
                    <span>{t.work.readMore}</span>
                    <span className="pen" aria-hidden="true">{t.work.readMorePen}</span>
                  </span>
                  <span className="card-more-arrow"><NavArrow inline /></span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* (phones only) a button with the rest of the projects as little cards peeking out of its top */}
        <Link to="/projects" className="more-deck reveal" aria-label={t.work.seeAll(projects.length)}>
          <span className="pen write" aria-hidden="true">{t.work.more}</span>
          <span className="deck" aria-hidden="true">
            <span className="deck-sheet" />
            <span className="deck-sheet" />
            <span className="deck-sheet" />
            <span className="deck-front">
              <b className="deck-count">+{projects.length - featured.length}</b>
              {t.work.deck}
              <span className="card-more-arrow"><NavArrow inline /></span>
            </span>
          </span>
        </Link>
      </section>

      <section id="skills" className="skills-section">
        <SkillsDesk />
      </section>

      <section id="contact" className="contact slide-section from-left">
        <h2 className="contact-big zoom reveal">
          <Split text={t.contact.title} className="wobble" />
        </h2>

        {/* An envelope that opens as it scrolls into view: the flap folds back, the letter with my email
            slides up out of it, and the links pop out and plop down below (see .envelope in App.css) */}
        <div className="envelope" ref={envelope}>
          <div
            className="env-body"
            role="button"
            tabIndex={0}
            aria-label={t.contact.envelope}
            onClick={toggleEnvelope}
            onKeyDown={toggleEnvelope}
          >
            <svg className="env-back" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="597" height="377" rx="14" />
            </svg>
            <div className="env-letter">
              <p className="pen env-hi">{t.contact.writeTo}</p>
              <a href={`mailto:${contact.email}`} className="pen env-email">{contact.email}</a>
              <p className="pen env-sign">{t.contact.signOff}</p>
            </div>
            <svg className="env-front" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
              <path className="env-side" d="M2 4 300 214 2 376Z" />
              <path className="env-side" d="M598 4 300 214 598 376Z" />
              <path className="env-bottom" d="M2 378 300 196 598 378Z" />
            </svg>
            <div className="env-flap" aria-hidden="true">
              <svg className="flap-out" viewBox="0 0 600 230" preserveAspectRatio="none">
                <path d="M2 2H598L312 222Q300 230 288 222Z" />
              </svg>
              <svg className="flap-in" viewBox="0 0 600 230" preserveAspectRatio="none">
                <path d="M2 2H598L312 222Q300 230 288 222Z" />
              </svg>
              <span className="env-seal"><img src="/favicon.svg" alt="" /></span>
            </div>
            <span className="pen env-hint" aria-hidden="true">{t.contact.clickMe}</span>
          </div>

          <div className="env-links">
            <span className="pop" style={{ '--d': '0ms', '--from': '70px' }}>
              <a href={contact.github} target="_blank" rel="noreferrer" className="social github">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
                </svg>
                GitHub <NavArrow inline out />
              </a>
            </span>
            <span className="pop" style={{ '--d': '220ms', '--from': '-70px' }}>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social linkedin">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
                </svg>
                LinkedIn <NavArrow inline out />
              </a>
            </span>
            <span className="pop" style={{ '--d': '440ms', '--from': '60px' }}>
              <a href={contact.cv} download className="social cv">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.contact.cv}
              </a>
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
