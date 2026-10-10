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
