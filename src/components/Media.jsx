import { useCallback, useEffect, useRef, useState } from 'react'

// A screenshot or a screen recording: recordings (.webm/.mp4) play silently on a loop by themselves, so
// moving effects show without anyone having to press play.
const isVideo = (src) => /\.(webm|mp4)$/i.test(src)

// Each recording has a still of its first frame next to it (walkthrough.mp4 → walkthrough-poster.webp).
const posterOf = (src) => src.replace(/\.\w+$/, '-poster.webp')

// A recording downloads nothing until it's on screen, and pauses again once it's scrolled away (or its
// carousel slide is moved out of view), so a phone only loads the videos someone actually looks at.
function Video({ src, alt, onReady, ...props }) {
  const video = useRef(null)
  useEffect(() => {
    const el = video.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(onReady) // autoplay can be blocked (e.g. iOS Low Power Mode): the poster stays
      else el.pause()
    }, { threshold: 0.25 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [src, onReady])

  return (
    <video
      ref={video}
      src={src}
      poster={posterOf(src)}
      aria-label={alt || undefined}
      preload="none"
      muted loop playsInline
      onLoadedData={onReady}
      onError={onReady}
      {...props}
    />
  )
}

// With `skeleton`, a shimmering placeholder with my logo covers the image until it has loaded. The parent
// needs `position: relative` so the placeholder can fill it.
export default function Media({ src, alt = '', skeleton = false, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const done = useCallback(() => setLoaded(true), [])
  return (
    <>
      {isVideo(src) ? (
        <Video src={src} alt={alt} onReady={done} {...props} />
      ) : (
        <img src={src} alt={alt} ref={(el) => el?.complete && done()} onLoad={done} onError={done} {...props} />
      )}
      {skeleton && (
        <span className={`media-skeleton${loaded ? ' done' : ''}`} aria-hidden="true">
          <img src="/favicon.svg" alt="" />
        </span>
      )}
    </>
  )
}
