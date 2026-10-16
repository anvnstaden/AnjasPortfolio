import { useEffect, useRef } from 'react'

// "Designer at heart, software engineer by degree", as something you can play with: under the hero lies its
// blueprint (the same layout as a wireframe, with selection boxes, live specs, red spacing lines, colour
// codes and the JSX behind it). With a mouse, the cursor is an X-ray lens that shows the blueprint wherever
// it goes; on touch screens a line can be dragged across to wipe between the two.
// The blueprint copy of the hero text is passed in as children. Every element in it marked with `data-bp`
// (its name) gets a box and a spec label measured from the page, and `data-code` adds the code behind it.

const LENS = 130 // lens radius, px
const BLUE = '#4f6bff'
const RED = '#f2453d'

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

export default function Blueprint({ children }) {
  const layer = useRef(null)
  const copy = useRef(null)
  const marks = useRef(null)
  const ring = useRef(null)
  const handle = useRef(null)

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

    // The blueprint: a box and spec label round every marked element, red lines measuring the gaps between
    // them, the code behind them, and a wireframe of the badge and the blob behind it
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
        const real = source.querySelector(name.includes('.') ? `.${name.split('.')[1]}` : '.button.primary') ?? el
        const cs = getComputedStyle(real)
        const family = cs.fontFamily.split(',')[0].replace(/["']/g, '')
        const spec = `${name} · ${family} ${cs.fontWeight} · ${Math.round(parseFloat(cs.fontSize))}px · ${hex(cs.color)}`
        out += `<rect x="${r.x - 4}" y="${r.y - 4}" width="${r.w + 8}" height="${r.h + 8}" fill="none" stroke="${BLUE}" stroke-width="1.2"/>`
        out += [[-4, -4], [r.w + 4, -4], [-4, r.h + 4], [r.w + 4, r.h + 4]]
          .map(([dx, dy]) => `<rect x="${r.x + dx - 3}" y="${r.y + dy - 3}" width="6" height="6" fill="#fff" stroke="${BLUE}" stroke-width="1.2"/>`)
          .join('')
        // the name's label sits above it; the smaller lines are too close together, so theirs go beside them
        const big = r.h > 80
        out += big ? tag(r.x - 4, r.y - 24, spec, BLUE) : tag(r.x + r.w + 14, r.y + r.h / 2 - 8, spec, BLUE)
        if (el.dataset.code) {
          out += big ? tag(r.x + r.w + 16, r.y + r.h * 0.3, el.dataset.code, '#fff', '#c2416b') : tag(r.x, r.y + r.h + 10, el.dataset.code, '#fff', '#c2416b')
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
        out += `<path d="M${x} ${top}V${bottom}M${x - 5} ${top}H${x + 5}M${x - 5} ${bottom}H${x + 5}" stroke="${RED}" stroke-width="1.2"/>`
        out += tag(x + 8, (top + bottom) / 2 - 8, `${Math.round(next.y - r.y - r.h)}`, RED)
      })
      // the width of the name
      const name = boxes[1]
      if (name) {
        const y = name.y + name.h + 2
        out += `<path d="M${name.x} ${y}H${name.x + name.w}M${name.x} ${y - 5}V${y + 5}M${name.x + name.w} ${y - 5}V${y + 5}" stroke="${RED}" stroke-width="1.2" opacity="0.8"/>`
      }
      // the badge and the blob behind it, as wireframes
      const blob = hero.querySelector('.photo-blob')
      if (blob) {
        const r = rel(blob.getBoundingClientRect())
        out += `<ellipse cx="${r.x + r.w / 2}" cy="${r.y + r.h / 2}" rx="${r.w / 2}" ry="${r.h / 2}" fill="none" stroke="#8a93a5" stroke-width="1.4" stroke-dasharray="6 6"/>`
        out += tag(r.x + r.w * 0.62, r.y + r.h - 20, 'div.photo-blob · border-radius morph 9s', '#8a93a5')
      }
      const badge = hero.querySelector('.badge-card')
      if (badge) {
        const r = rel(badge.getBoundingClientRect())
        out += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="14" fill="#f7f9fd" stroke="${BLUE}" stroke-width="1.4"/>`
        out += `<path d="M${r.x} ${r.y}L${r.x + r.w} ${r.y + r.h}M${r.x + r.w} ${r.y}L${r.x} ${r.y + r.h}" stroke="#b9c1d0" stroke-width="1.2"/>`
        out += tag(r.x, r.y - 24, `IdBadge · ${Math.round(r.w)} × ${Math.round(r.h)} · flips on hover`, BLUE)
        out += tag(r.x + 12, r.y + r.h / 2 - 8, '<IdBadge photo="/profile.jpeg" />', '#fff', '#c2416b')
        out += tag(r.x + 12, r.y + r.h / 2 + 14, 'transform: rotateY(180deg)', '#fff', '#5b6b85')
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
      cancelAnimationFrame(demo)
      demo = 0
      const hr = hero.getBoundingClientRect()
      lensAt(e.clientX - hr.left, e.clientY - hr.top, LENS)
    }
    const onLeave = () => lensAt(-999, -999, 0)

    // On first load (with a mouse) the lens drifts over the name by itself for a few seconds, so people find it
    const wander = (start) => (now) => {
      const t = (now - start) / 1000
      const name = copyEl.querySelector('.hero-name')
      if (t > 5 || !name) return onLeave()
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
      if (!still) demo = requestAnimationFrame((now) => requestAnimationFrame(wander(now)))
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
        <div ref={copy} className="bp-copy-wrap">{children}</div>
        <svg ref={marks} className="bp-marks" />
      </div>
      <div ref={ring} className="bp-ring" aria-hidden="true">
        <span>inspect</span>
      </div>
      <button ref={handle} type="button" className="bp-handle" aria-label="Drag to see how this page is built">
        <span aria-hidden="true">⇆</span>
      </button>
    </>
  )
}
