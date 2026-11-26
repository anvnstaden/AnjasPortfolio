import { useEffect, useRef } from 'react'

// The badge's strap, as an actual strip of fabric: a chain of points with weight, tied to the top of the browser and
// to the badge's clip. Swing the badge and the strap ripples after it; push the badge back up and the spare length
// bends, scrunches and folds over. It's drawn on a canvas behind the badge, and its bottom end simply follows the clip
// wherever the badge goes (see useBadgeSwing in Home.jsx). Pulled further than its own length it stretches, so the
// badge can still reach anywhere on screen.
const SEGMENTS = 26
const SMOOTHING = 3 // drawn points per chain link
const EASE_LINKS = 5 // how many links above the clip are still guided by it
const GRAVITY = 1600 // px/s²
const DRAG = 0.97 // how much of its speed each point keeps per step: fabric slows down quickly in the air
const STEP = 1 / 60
const RIP_FADE = 1100 // ms a ripped strap keeps falling before it's gone
const INK = '#000a1a'
// The two stripes on the printed side, and on the reverse, which shows where the fabric has folded over
const FRONT = [[247, 222, 147], [251, 234, 187]]
const BACK = [[226, 190, 100], [236, 205, 130]]

export default function Lanyard() {
  const canvas = useRef(null)

  useEffect(() => {
    const el = canvas.current
    const ctx = el.getContext('2d')
    const hero = el.closest('.hero')
    const visual = hero.querySelector('.hero-visual')
    const badge = visual.querySelector('.badge')
    const clip = badge.querySelector('.badge-clip')
    const card = badge.querySelector('.badge-card')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let points = []
    let frame = 0
    let last = 0
    let spare = 0
    let rippedAt = 0
    let time = 0

    // The navbar's tabs and buttons hang from the top of the browser too, with gaps far narrower than the strap. Where
    // the strap would come up under the edge of one or squeeze between two, it's tied a little further in behind the
    // nearest one, just clear of its edge, so it looks like it hangs from behind it rather than catching on a corner.
    // It moves no further than that, so it still hangs almost straight down past the name.
    const hangers = [...document.querySelectorAll('.nav #site-menu > *, .nav .nav-charm, .nav .menu-toggle')]
    const top = () => {
      const r = visual.getBoundingClientRect()
      const x = r.left + r.width / 2
      const reach = (badge.offsetWidth * 0.11) / 2 + 16
      let tie = x
      let shift = Infinity
      for (const hanger of hangers) {
        const h = hanger.getBoundingClientRect()
        if (!h.width || h.bottom > 100 || h.right < x - reach || h.left > x + reach) continue
        const inside = h.width < reach * 2 ? h.left + h.width / 2 : Math.min(Math.max(x, h.left + reach), h.right - reach)
        if (Math.abs(inside - x) < shift) {
          shift = Math.abs(inside - x)
          tie = inside
        }
      }
      return { x: tie, y: -6 }
    }
    const bottom = () => {
      const r = clip.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    // The strap's own length: from the top of the browser to where the clip hangs when nothing is pulling on it
    const naturalLength = () => {
      const reach = parseFloat(visual.style.getPropertyValue('--reach')) || 0
      return reach - 4 + clip.offsetTop + clip.offsetHeight / 2 + 6
    }

    const straighten = (a, b) => {
      points = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
        const x = a.x + ((b.x - a.x) * i) / SEGMENTS
        const y = a.y + ((b.y - a.y) * i) / SEGMENTS
        return { x, y, px: x, py: y, twist: 0 }
      })
    }

    // Sized to the canvas as it's shown, which leaves out the scrollbar: sized to the whole window instead, the drawing
    // gets squeezed into the narrower space and the strap ends up beside the clip rather than in the middle of it
    const fit = () => {
      const scale = window.devicePixelRatio || 1
      el.width = Math.round(el.clientWidth * scale)
      el.height = Math.round(el.clientHeight * scale)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
    }

    const simulate = (a, b, tied) => {
      const n = points.length - 1
      // (a little under the real distance, so it hangs taut through small bounces and only gives when it's pushed up)
      const length = naturalLength() * 0.95
      const reach = Math.hypot(b.x - a.x, b.y - a.y)
      const link = Math.max(length, reach) / SEGMENTS
      // Squeezed from both ends it concertinas rather than just dropping out of sight behind the badge, and a perfectly
      // straight strap needs a nudge to make it give way sideways
      const squeeze = Math.max(0, 1 - reach / length)
      // Pulled taut, gravity has nothing to act on: left on, it would pile the points up against the clip until they buckled
      const slack = tied ? Math.min(1, squeeze * 25) : 1
      const pull = GRAVITY * STEP * STEP * slack * Math.max(0, 1 - squeeze * 2.5)
      time += STEP
      for (let i = 1; i < (tied ? n : n + 1); i++) {
        const p = points[i]
        const vx = (p.x - p.px) * DRAG
        const vy = (p.y - p.py) * DRAG
        p.px = p.x
        p.py = p.y
        p.x += vx + Math.sin(i * 1.7 + time * 0.8) * squeeze
        p.y += vy + pull
      }
      if (!tied) {
        const p = points[0]
        const vx = (p.x - p.px) * DRAG
        const vy = (p.y - p.py) * DRAG
        p.px = p.x
        p.py = p.y
        p.x += vx
        p.y += vy + pull
      }
      // Held by the clip, the strap comes out of it in line with the badge, then eases off into its own free curve. Only
      // the part hidden by the clip is fixed, so there's no stiff stretch or corner where it comes out
      const c = card.getBoundingClientRect()
      const outX = b.x - (c.left + c.width / 2)
      const outY = b.y - (c.top + c.height / 2)
      const out = Math.hypot(outX, outY) || 1
      const held = Math.floor((clip.offsetHeight * 0.5) / link)
      const pinEnd = () => {
        for (let k = 0; k <= n && k <= held + EASE_LINKS; k++) {
          const ease = k <= held ? 1 : 0.07 * (1 - (k - held) / (EASE_LINKS + 1)) ** 2
          const p = points[n - k]
          p.x += (b.x + (outX / out) * link * k - p.x) * ease
          p.y += (b.y + (outY / out) * link * k - p.y) * ease
        }
      }
      for (let round = 0; round < 16; round++) {
        if (tied) points[0].x = a.x, points[0].y = a.y
        pinEnd()
        for (let i = 0; i < n; i++) {
          const p = points[i]
          const q = points[i + 1]
          const dx = q.x - p.x
          const dy = q.y - p.y
          const d = Math.hypot(dx, dy) || 0.001
          const push = ((d - link) / d) * 0.5
          p.x += dx * push
          p.y += dy * push
          q.x -= dx * push
          q.y -= dy * push
        }
        // Fabric has some body: it folds in curves, rather than collapsing into a point
        for (let i = 0; i < n - 1; i++) {
          const p = points[i]
          const q = points[i + 2]
          const dx = q.x - p.x
          const dy = q.y - p.y
          const d = Math.hypot(dx, dy) || 0.001
          const least = link * 1.8
          if (d >= least) continue
          const push = ((d - least) / d) * 0.5
          p.x += dx * push
          p.y += dy * push
          q.x -= dx * push
          q.y -= dy * push
        }
      }
      if (tied) points[0].x = a.x, points[0].y = a.y
      pinEnd()
    }

    // Each bend turns the strip a little on its way along, so tight curves show its edge and then its reverse
    const twistPoints = () => {
      const n = points.length - 1
      let turned = 0
      const targets = [0]
      for (let i = 1; i < n; i++) {
        const a = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x)
        const b = Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x)
        const bend = Math.atan2(Math.sin(b - a), Math.cos(b - a))
        points[i].bend = bend
        turned += bend * 0.24
        targets.push(turned)
      }
      targets.push(turned)
      points.forEach((p, i) => {
        // ...and it's flat again where it's tied on at each end
        const target = targets[i] - (turned * i) / n
        p.twist += (target - p.twist) * 0.25
      })
    }

    // Smooth curve through the chain
    const samples = () => {
      const out = []
      const n = points.length - 1
      for (let i = 0; i < n; i++) {
        const p0 = points[Math.max(i - 1, 0)]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[Math.min(i + 2, n)]
        for (let s = 0; s < SMOOTHING; s++) {
          const t = s / SMOOTHING
          const blend = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t)
          out.push({
            x: blend(p0.x, p1.x, p2.x, p3.x),
            y: blend(p0.y, p1.y, p2.y, p3.y),
            twist: p1.twist + (p2.twist - p1.twist) * t,
            bend: Math.abs(p1.bend ?? 0),
          })
        }
      }
      const end = points[n]
      out.push({ x: end.x, y: end.y, twist: end.twist, bend: 0 })
      return out
    }

    // A little more strap past the clip, out of sight behind the card, so its stripes run right up to the clip
    const tuckedIn = (line, count, step) => {
      const end = line[line.length - 1]
      const r = card.getBoundingClientRect()
      const dx = r.left + r.width / 2 - end.x
      const dy = r.top + r.height / 2 - end.y
      const d = Math.hypot(dx, dy) || 1
      for (let i = 1; i <= count; i++) {
        line.push({ x: end.x + (dx / d) * step * i, y: end.y + (dy / d) * step * i, twist: end.twist, bend: 0 })
      }
      return line
    }

    const draw = () => {
      ctx.clearRect(0, 0, el.clientWidth, el.clientHeight)
      const tension = parseFloat(visual.style.getPropertyValue('--tension')) || 0
      const half = (badge.offsetWidth * 0.11 * (1 - tension * 0.3)) / 2
      const step = naturalLength() / SEGMENTS / SMOOTHING
      const slant = Math.max(1, Math.round((half * 2) / step))
      const line = tuckedIn(samples(), slant + 1, step)
      let along = 0
      line.forEach((s, i) => {
        const next = line[Math.min(i + 1, line.length - 1)]
        // its direction over a short stretch, so the edges stay smooth through tight bends
        const ahead = line[Math.min(i + SMOOTHING, line.length - 1)]
        const before = line[Math.max(i - SMOOTHING, 0)]
        const dx = ahead.x - before.x
        const dy = ahead.y - before.y
        const d = Math.hypot(dx, dy) || 1
        // cos(twist) is how much of its width faces us, and which way round
        const facing = Math.cos(s.twist)
        const width = half * (Math.abs(facing) < 0.1 ? 0.1 * (Math.sign(facing) || 1) : facing)
        s.lx = s.x - (dy / d) * width
        s.ly = s.y + (dx / d) * width
        s.rx = s.x + (dy / d) * width
        s.ry = s.y - (dx / d) * width
        s.facing = facing
        s.along = along
        along += Math.hypot(next.x - s.x, next.y - s.y)
      })

      const band = half * 0.9
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < line.length - 1; i++) {
        const a = line[i]
        const b = line[i + 1]
        const ra = line[Math.min(i + slant, line.length - 1)]
        const rb = line[Math.min(i + slant + 1, line.length - 1)]
        const colors = a.facing < 0 ? BACK : FRONT
        const [r, g, bl] = colors[Math.floor(a.along / band) % 2]
        const shade = 1 - 0.2 * (1 - Math.abs(a.facing)) - 0.12 * Math.min(1, a.bend * 1.4)
        ctx.fillStyle = `rgb(${r * shade} ${g * shade} ${bl * shade})`
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.moveTo(a.lx, a.ly)
        ctx.lineTo(b.lx, b.ly)
        ctx.lineTo(rb.rx, rb.ry)
        ctx.lineTo(ra.rx, ra.ry)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = INK
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(a.lx, a.ly)
        ctx.lineTo(b.lx, b.ly)
        ctx.moveTo(a.rx, a.ry)
        ctx.lineTo(b.rx, b.ry)
        ctx.stroke()
      }

      // Woven, like the real thing: its thickness shades it a little towards the edges, it has a soft satin sheen down
      // the middle and fine threads run along it. Each is a band from one fraction of the way across to another, so it
      // narrows and turns with the strap.
      const at = (s, t) => [s.lx + (s.rx - s.lx) * t, s.ly + (s.ry - s.ly) * t]
      const weave = (from, to, color) => {
        ctx.fillStyle = color
        ctx.beginPath()
        line.forEach((s) => ctx.lineTo(...at(s, from)))
        for (let i = line.length - 1; i >= 0; i--) ctx.lineTo(...at(line[i], to))
        ctx.fill()
      }
      for (const [from, to] of [[0, 0.22], [0.78, 1]]) weave(from, to, 'rgb(110 70 0 / 0.07)')
      for (const [from, to] of [[0, 0.1], [0.9, 1]]) weave(from, to, 'rgb(110 70 0 / 0.08)')
      weave(0.3, 0.54, 'rgb(255 255 255 / 0.16)')
      weave(0.36, 0.46, 'rgb(255 255 255 / 0.14)')
      ctx.strokeStyle = 'rgb(90 60 0 / 0.08)'
      ctx.lineWidth = 0.6
      for (let t = 0.14; t < 0.9; t += 0.12) {
        ctx.beginPath()
        line.forEach((s) => ctx.lineTo(...at(s, t)))
        ctx.stroke()
      }
    }

    const tick = (now) => {
      const ripped = badge.classList.contains('ripped')
      if (ripped && !rippedAt) rippedAt = now
      if (ripped && now - rippedAt > RIP_FADE) {
        ctx.clearRect(0, 0, el.clientWidth, el.clientHeight)
        frame = 0
        return
      }
      const a = top()
      const b = bottom()
      const length = naturalLength()
      // On its way in from above the browser, there's nothing to see of it yet
      const arriving = b.y < a.y + length * 0.6 && badge.getAnimations().some((x) => ['badge-drop', 'badge-rehang'].includes(x.animationName))
      if (arriving) {
        straighten(a, b)
        spare = 0
      } else {
        spare = Math.min(spare + Math.min((now - last) / 1000, 1 / 20), STEP * 3)
        while (spare >= STEP) {
          simulate(a, b, !ripped)
          spare -= STEP
        }
      }
      last = now
      twistPoints()
      draw()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    // With reduced motion it's simply a straight strap
    const drawStill = () => {
      straighten(top(), bottom())
      twistPoints()
      draw()
    }

    const onResize = () => {
      fit()
      if (still) drawStill()
    }

    const classes = new MutationObserver(() => {
      if (badge.classList.contains('ripped') || still) return
      rippedAt = 0
      straighten(top(), bottom())
      start()
    })

    // (watched on the canvas itself, so the scrollbar coming or going counts as well as the window resizing)
    const resized = new ResizeObserver(onResize)
    fit()
    resized.observe(el)
    straighten(top(), bottom())
    if (still) {
      drawStill()
      window.addEventListener('scroll', drawStill, { passive: true })
    } else {
      classes.observe(badge, { attributes: true, attributeFilter: ['class'] })
      if (!badge.classList.contains('ripped')) start()
    }
    return () => {
      cancelAnimationFrame(frame)
      classes.disconnect()
      resized.disconnect()
      window.removeEventListener('scroll', drawStill)
    }
  }, [])

  return <canvas ref={canvas} className="lanyard" aria-hidden="true" />
}

// The metal end of the strap, which the strap's canvas lines up with (Lanyard measures .badge-clip). The strap goes
// into a chrome crimp, pressed shut in two ridges, and riveted to it is a metal tongue that runs down over the card
// and bends back through the slot, so the card really hangs off it. The box is the crimp; the tongue hangs out below.
const GROOVES = [12.5, 18.5]

export function LanyardClip() {
  const edge = { stroke: '#232a36', strokeWidth: 1.8, strokeLinejoin: 'round' }
  const tongue = 'M21 22H39V59.5Q39 63.5 35 63.5H25Q21 63.5 21 59.5Z'
  const crimp = 'M3.5 1H56.5Q59.5 1 59.4 4L58.5 23Q58 30.5 50.5 31H9.5Q2 30.5 1.5 23L.6 4Q.5 1 3.5 1Z'
  return (
    <svg viewBox="0 0 60 32" aria-hidden="true">
      <defs>
        {/* polished metal: bright and dark bands of reflection across its curve, lit from above */}
        <linearGradient id="clip-chrome">
          <stop offset="0" stopColor="#5d636d" />
          <stop offset=".1" stopColor="#a9afb8" />
          <stop offset=".26" stopColor="#f7f9fc" />
          <stop offset=".4" stopColor="#c4c9d1" />
          <stop offset=".56" stopColor="#7a808a" />
          <stop offset=".74" stopColor="#dadee4" />
          <stop offset=".9" stopColor="#a1a7b0" />
          <stop offset="1" stopColor="#575d67" />
        </linearGradient>
        <linearGradient id="clip-light" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
          <stop offset=".7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="clip-lip" x2="0" y2="1">
          <stop offset="0" stopColor="#868c96" />
          <stop offset=".4" stopColor="#fff" />
          <stop offset="1" stopColor="#7d838d" />
        </linearGradient>
        {/* a flat strip of steel: one even sheen, with its pressed edges catching the light on one side */}
        <linearGradient id="clip-tongue">
          <stop offset="0" stopColor="#80868f" />
          <stop offset=".1" stopColor="#e4e7eb" />
          <stop offset=".22" stopColor="#c6cbd2" />
          <stop offset=".55" stopColor="#d4d8de" />
          <stop offset=".82" stopColor="#aab0b8" />
          <stop offset=".92" stopColor="#868c95" />
          <stop offset="1" stopColor="#5f656e" />
        </linearGradient>
        {/* where it bends back through the slot, it turns away from the light */}
        <linearGradient id="clip-dip" x2="0" y2="1">
          <stop offset=".7" stopColor="#0a0f18" stopOpacity="0" />
          <stop offset="1" stopColor="#0a0f18" stopOpacity=".85" />
        </linearGradient>
        <radialGradient id="clip-rivet" cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".45" stopColor="#b7bdc6" />
          <stop offset="1" stopColor="#4d535d" />
        </radialGradient>
      </defs>
      <path d={tongue} fill="url(#clip-tongue)" {...edge} />
      <path d={tongue} fill="url(#clip-dip)" />
      <path d="M28 33V50" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".3" />
      <path d="M22.5 54H37.5" stroke="#fff" strokeWidth=".9" strokeLinecap="round" opacity=".45" />

      <path d={crimp} fill="url(#clip-chrome)" {...edge} />
      <path d={crimp} fill="url(#clip-light)" />
      {GROOVES.map((y) => (
        <g key={y} strokeLinecap="round">
          <path d={`M4 ${y}H56`} stroke="#3b414b" strokeWidth="1.6" opacity=".55" />
          <path d={`M4 ${y + 1.5}H56`} stroke="#fff" strokeWidth="1" opacity=".7" />
        </g>
      ))}
      <rect x=".5" y=".5" width="59" height="6" rx="2.5" fill="url(#clip-lip)" {...edge} />
      <circle cx="30" cy="26.5" r="3.2" fill="url(#clip-rivet)" stroke="#2b313b" strokeWidth=".8" />
    </svg>
  )
}
