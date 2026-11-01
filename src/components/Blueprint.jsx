import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n.js'

// "Designer at heart, software engineer by degree", as something you can play with: under the hero lies its
// blueprint (the same layout as a wireframe, with selection boxes, live specs, red spacing lines, colour
// codes and the JSX behind it). It stays out of the way until someone presses the Inspect button in the hero's corner.
// Then, with a mouse, the cursor is an X-ray lens that shows the blueprint wherever it goes; on touch screens
// a line can be dragged across to wipe between the two.
// The blueprint copy of the hero text is passed in as children. Every element in it marked with `data-bp`
// (its name) gets a box and a spec label measured from the page, and `data-code` adds the code behind it.

const LENS = 130 // lens radius, px
// Drawn in chalk on blue paper: white boxes, butter measurements, pink code
const LINE = '#ffffff'
const PAPER = '#0e4798'
const MEASURE = '#f7de93'
const CODE = '#dfa4b8'
const INK = '#000a1a'
const FAINT = 'rgb(255 255 255 / 0.65)'

const hex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number)
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// A label: text in a filled pill, as in a design tool
function tag(x, y, text, fill, color = '#fff') {
  const w = text.length * 6.7 + 12
  return `<rect x="${x}" y="${y}" width="${w}" height="17" rx="3" fill="${fill}"/><text x="${x + 6}" y="${y + 12.5}" fill="${color}">${esc(text)}</text>`
}

// `intro` is 'playing' while the page opens on the blueprint (the sweep itself is timed in CSS, see .bp-sweep):
// it holds until the fonts are in, and any click, key or scroll skips the rest. `onIntroEnd` says it's over.
export default function Blueprint({ children, intro, onIntroEnd }) {
  const { lang, t } = useLang()
  const layer = useRef(null)
  const copy = useRef(null)
  const marks = useRef(null)
  const ring = useRef(null)
  const handle = useRef(null)
  const applyInspecting = useRef(null)
  const redraw = useRef(null)
  const [inspecting, setInspecting] = useState(false)

  const playing = intro === 'playing'
  useEffect(() => {
    if (!playing) return
    const hero = layer.current.parentElement
    const finish = (e) => {
      if (e.type !== 'animationend' || e.animationName.startsWith('bp-wipe')) onIntroEnd()
    }
    let failsafe = 0
    let cancelled = false
    const go = () => {
      if (cancelled) return
      hero.classList.add('bp-go')
      failsafe = setTimeout(onIntroEnd, 3000)
    }
    const fontWait = setTimeout(go, 800)
    document.fonts?.ready.then(() => {
      clearTimeout(fontWait)
      if (!hero.classList.contains('bp-go')) go()
    })
    const skips = ['pointerdown', 'wheel', 'touchmove', 'keydown']
    hero.addEventListener('animationend', finish)
    skips.forEach((type) => window.addEventListener(type, finish, { passive: true }))
    return () => {
      cancelled = true
      clearTimeout(fontWait)
      clearTimeout(failsafe)
      hero.classList.remove('bp-go')
      hero.removeEventListener('animationend', finish)
      skips.forEach((type) => window.removeEventListener(type, finish))
    }
  }, [playing, onIntroEnd])

  useEffect(() => {
    applyInspecting.current?.(inspecting)
  }, [inspecting])

  // New wording means new boxes to draw around it
  useEffect(() => {
    redraw.current?.()
  }, [lang])

  useEffect(() => {
    const blueprint = layer.current
    const hero = blueprint.parentElement
    const source = hero.querySelector('.hero-text:not(.bp-copy)')
    const copyEl = copy.current
    const svg = marks.current
    const lensRing = ring.current
    const touch = matchMedia('(hover: none)').matches
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    hero.classList.toggle('bp-touch', touch)
    let frame = 0
    let demo = 0
    let active = false

    // The blueprint: a box and spec label round every marked element, red lines measuring the gaps between
    // them, the code behind them, and a wireframe of the badge
    const draw = () => {
      frame = 0
      const hr = hero.getBoundingClientRect()
      const rel = (r) => ({ x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height })
      let out = ''
      const boxes = [...copyEl.querySelectorAll('[data-bp]')].map((el) => {
        // the box hugs the text itself, not the whole width of the block
        const range = document.createRange()
        range.selectNodeContents(el)
        const r = rel(range.getBoundingClientRect())
        // the specs come from the real element, not the grey wireframe copy (`p.hello` → `.hello`)
        const name = el.dataset.bp
        const real = source.querySelector(name.includes('.') ? `.${name.split('.')[1]}` : '.folder-btn') ?? el
        const cs = getComputedStyle(real)
        const family = cs.fontFamily.split(',')[0].replace(/["']/g, '')
        const size = `${Math.round(parseFloat(cs.fontSize))}px · ${hex(cs.color)}`
        const big = r.h > 80
        // the name has room for its whole spec; the lines beside the badge only get their size and colour
        const spec = big ? `${name} · ${family} ${cs.fontWeight} · ${size}` : `${name} · ${size}`
        out += `<rect x="${r.x - 4}" y="${r.y - 4}" width="${r.w + 8}" height="${r.h + 8}" fill="none" stroke="${LINE}" stroke-width="1.2"/>`
        out += [[-4, -4], [r.w + 4, -4], [-4, r.h + 4], [r.w + 4, r.h + 4]]
          .map(([dx, dy]) => `<rect x="${r.x + dx - 3}" y="${r.y + dy - 3}" width="6" height="6" fill="${PAPER}" stroke="${LINE}" stroke-width="1.2"/>`)
          .join('')
        // the name's labels sit above it; the smaller lines are too close together, so theirs go beside them
        out += big ? tag(r.x - 4, r.y - 24, spec, LINE, PAPER) : tag(r.x + r.w + 14, r.y + r.h / 2 - 8, spec, LINE, PAPER)
        if (el.dataset.code) {
          out += big ? tag(r.x + spec.length * 6.7 + 20, r.y - 24, el.dataset.code, CODE, INK) : tag(r.x, r.y + r.h + 10, el.dataset.code, CODE, INK)
        }
        return r
      })
      // spacing between one block and the next
      boxes.slice(0, -1).forEach((r, i) => {
        const next = boxes[i + 1]
        const top = r.y + r.h + 4
        const bottom = next.y - 4
        if (bottom - top < 6) return
        const x = Math.max(r.x, next.x) + Math.min(r.w, next.w) * 0.62
        out += `<path d="M${x} ${top}V${bottom}M${x - 5} ${top}H${x + 5}M${x - 5} ${bottom}H${x + 5}" stroke="${MEASURE}" stroke-width="1.2"/>`
        out += tag(x + 8, (top + bottom) / 2 - 8, `${Math.round(next.y - r.y - r.h)}`, MEASURE, INK)
      })
      // the width of the name
      const name = boxes[1]
      if (name) {
        const y = name.y + name.h + 2
        out += `<path d="M${name.x} ${y}H${name.x + name.w}M${name.x} ${y - 5}V${y + 5}M${name.x + name.w} ${y - 5}V${y + 5}" stroke="${MEASURE}" stroke-width="1.2" opacity="0.8"/>`
      }
      // the badge, as a wireframe
      const badge = hero.querySelector('.badge-card')
      if (badge) {
        const r = rel(badge.getBoundingClientRect())
        out += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="14" fill="${PAPER}" stroke="${LINE}" stroke-width="1.4"/>`
        out += `<path d="M${r.x} ${r.y}L${r.x + r.w} ${r.y + r.h}M${r.x + r.w} ${r.y}L${r.x} ${r.y + r.h}" stroke="${FAINT}" stroke-width="1"/>`
        out += tag(r.x + 12, r.y + 14, `IdBadge · ${Math.round(r.w)} × ${Math.round(r.h)}`, LINE, PAPER)
        out += tag(r.x + 12, r.y + r.h / 2 - 8, '<IdBadge />', CODE, INK)
        out += tag(r.x + 12, r.y + r.h / 2 + 14, 'rotateY(180deg) on click', LINE, PAPER)
      }
      svg.innerHTML = out
    }

    // Lay the copy exactly over the real hero text, then redraw the blueprint
    const place = () => {
      const hr = hero.getBoundingClientRect()
      const sr = source.getBoundingClientRect()
      copyEl.style.left = `${sr.left - hr.left}px`
      copyEl.style.top = `${sr.top - hr.top}px`
      copyEl.style.width = `${sr.width}px`
      draw()
    }

    // The lens: a circle of blueprint wherever the cursor is
    // (the radius is only set when it changes, so its grow and shrink transition can play out)
    let shown = -1
    const lensAt = (x, y, radius) => {
      blueprint.style.setProperty('--mx', `${x}px`)
      blueprint.style.setProperty('--my', `${y}px`)
      if (radius !== shown) blueprint.style.setProperty('--lens', `${radius}px`)
      shown = radius
      lensRing.style.translate = `${x - LENS}px ${y - LENS}px`
      lensRing.style.opacity = radius > 0 ? 1 : 0
      frame ||= requestAnimationFrame(draw)
    }
    const onMove = (e) => {
      if (!active) return
      // the cursor is still on the button just after pressing it, which shouldn't cut the demo short
      const onToggle = e.target.closest?.('.bp-toggle')
      if (demo && onToggle) return
      cancelAnimationFrame(demo)
      demo = 0
      // the lens gets out of the way of the buttons and the badge, so you can see them move
      if (onToggle || e.target.closest?.('.fun-btn, .badge')) return lensAt(-999, -999, 0)
      const hr = hero.getBoundingClientRect()
      lensAt(e.clientX - hr.left, e.clientY - hr.top, LENS)
    }
    const onLeave = () => lensAt(-999, -999, 0)

    // On pressing Inspect (with a mouse) the lens drifts over the name by itself for a moment, to show what it does
    const wander = (start) => (now) => {
      const t = (now - start) / 1000
      const name = copyEl.querySelector('.hero-name')
      if (t > 3 || !name) return onLeave()
      const r = name.getBoundingClientRect()
      const hr = hero.getBoundingClientRect()
      const x = r.left - hr.left + r.width * (0.3 + 0.3 * Math.sin(t * 1.1))
      const y = r.top - hr.top + r.height * (0.45 + 0.25 * Math.cos(t * 0.8))
      lensAt(x, y, LENS)
      demo = requestAnimationFrame(wander(start))
    }

    // On touch screens: drag the line across to wipe between the finished design and its blueprint
    const knob = handle.current
    const onDrag = (e) => {
      const hr = hero.getBoundingClientRect()
      const x = Math.min(hr.width - 8, Math.max(8, e.clientX - hr.left))
      blueprint.style.setProperty('--split', `${x}px`)
      knob.style.left = `${x}px`
    }
    const startDrag = (e) => {
      knob.setPointerCapture(e.pointerId)
      knob.addEventListener('pointermove', onDrag)
    }
    const endDrag = () => knob.removeEventListener('pointermove', onDrag)

    applyInspecting.current = (on) => {
      active = on
      hero.classList.toggle('bp-on', on)
      if (touch) return
      cancelAnimationFrame(demo)
      demo = 0
      if (!on) onLeave()
      else if (!still) demo = requestAnimationFrame((now) => requestAnimationFrame(wander(now)))
    }

    redraw.current = place
    const resized = new ResizeObserver(place)
    resized.observe(hero)
    place()
    document.fonts?.ready.then(place)
    if (touch) {
      const x = hero.clientWidth * 0.72
      blueprint.style.setProperty('--split', `${x}px`)
      knob.style.left = `${x}px`
      knob.addEventListener('pointerdown', startDrag)
      knob.addEventListener('pointerup', endDrag)
      knob.addEventListener('pointercancel', endDrag)
    } else {
      hero.addEventListener('pointermove', onMove)
      hero.addEventListener('pointerleave', onLeave)
    }
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(demo)
      resized.disconnect()
      hero.classList.remove('bp-touch')
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      knob.removeEventListener('pointerdown', startDrag)
      knob.removeEventListener('pointerup', endDrag)
      knob.removeEventListener('pointercancel', endDrag)
    }
  }, [])

  return (
    <>
      <div ref={layer} className="blueprint" aria-hidden="true">
        <div className="bp-paper" />
        <div className="bp-inner">
          <div ref={copy} className="bp-copy-wrap">{children}</div>
          <svg ref={marks} className="bp-marks" />
        </div>
      </div>
      <div ref={ring} className="bp-ring" aria-hidden="true">
        <span>{t.hero.inspect}</span>
      </div>
      <button
        type="button"
        className="bp-toggle"
        aria-pressed={inspecting}
        onClick={() => setInspecting((on) => !on)}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          {inspecting ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M12.5 12.5L17 17M14 8.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0z" />}
        </svg>
        {t.hero.inspect}
      </button>
      <button ref={handle} type="button" className="bp-handle" aria-label={t.hero.dragBlueprint}>
        <span aria-hidden="true">⇆</span>
      </button>
      <div className="bp-sweep" aria-hidden="true">
        <svg viewBox="0 0 34 34">
          <g stroke="#000a1a" strokeWidth="1.4" strokeLinejoin="round">
            <path d="M3 31l3-9 6 6z" fill="#000a1a" />
            <path d="M6 22L22 6l6 6-16 16z" fill="#dfa4b8" />
            <path d="M22 6l3-3a2 2 0 0 1 3 0l3 3a2 2 0 0 1 0 3l-3 3z" fill="#f7de93" />
          </g>
        </svg>
      </div>
    </>
  )
}
