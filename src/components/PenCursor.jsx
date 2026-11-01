import { useEffect } from 'react'

const enabled = () => matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches

// The pen itself is a CSS cursor (see index.css). The only thing it adds is a tiny flick of ink where you
// click, so nothing moves while you're just reading or moving the mouse around.
export default function PenCursor() {
  useEffect(() => {
    if (!enabled()) return
    const onDown = (e) => {
      if (e.pointerType !== 'mouse') return
      const dab = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      dab.setAttribute('class', 'pen-dab')
      dab.setAttribute('viewBox', '0 0 24 24')
      dab.setAttribute('aria-hidden', 'true')
      dab.innerHTML = '<path pathLength="1" d="M12 6V2M17 8l3-3M7 8L4 5" />'
      dab.style.left = `${e.clientX}px`
      dab.style.top = `${e.clientY}px`
      dab.addEventListener('animationend', () => dab.remove())
      document.body.append(dab)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  return null
}
