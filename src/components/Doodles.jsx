// Hand-drawn strokes. With the "draw" class they draw themselves in when scrolled into view.
export function Underline({ className = '' }) {
  return (
    <svg className={`doodle-underline ${className}`} viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M3 13C40 6 80 17 120 10s62-4 76 3" />
    </svg>
  )
}

export function Circle({ className = '' }) {
  return (
    <svg className={`doodle-circle ${className}`} viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M150 9C92-1 10 9 8 41c-2 30 112 37 172 21 25-10 20-44-40-52" />
    </svg>
  )
}

export function Arrow({ className = '' }) {
  return (
    <svg className={`doodle-arrow ${className}`} viewBox="0 0 120 80" aria-hidden="true">
      <path pathLength="1" d="M8 12c32-8 82 6 98 52" />
      <path pathLength="1" d="M90 56l16 10 6-19" />
    </svg>
  )
}

// Chunky, slightly wobbly block arrow used for every arrow on the site. Points right; `left` flips it and
// `out` tilts it up-right for external links. `inline` sizes it to sit in a line of text, and `pen`
// draws it as a quick handwritten stroke instead, to match the pen font.
export function NavArrow({ left = false, out = false, inline = false, pen = false }) {
  const cls = ['nav-arrow', left && 'left', out && 'out', inline && 'inline', pen && 'pen-arrow'].filter(Boolean).join(' ')
  return (
    <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={pen
          ? 'M2.5 13c4.5-.9 10.5-.6 17.5-1.3M14.6 6.8c2 1.9 3.9 3.4 5.6 4.9-1.9 1.6-3.6 3.4-5.2 5.4'
          : 'M3 9.2C6.5 9.8 9 9.1 12 9.6V4.4L21.2 12 12 19.6v-5.2c-3 .5-5.5-.3-9 .4Z'}
      />
    </svg>
  )
}

export function Sparkle({ className = '' }) {
  return (
    <svg className={`sparkle ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2c2 10 8 16 18 18-10 2-16 8-18 18-2-10-8-16-18-18C12 18 18 12 20 2Z" />
    </svg>
  )
}

// A pointing hand (public/hand.svg; it points up and to the left, CSS rotates it). It taps the
// "Get in touch" button and presses the sticky note on.
export function PointingHand({ className }) {
  return <img className={className} src="/hand.svg" alt="" aria-hidden="true" />
}
