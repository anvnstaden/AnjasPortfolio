import { useState } from 'react'

// A screenshot or a screen recording: recordings (.webm/.mp4) play silently on a loop by themselves, so
// moving effects show without anyone having to press play.
const isVideo = (src) => /\.(webm|mp4)$/i.test(src)

// With `skeleton`, a shimmering placeholder with my logo covers the image until it has loaded. The parent
// needs `position: relative` so the placeholder can fill it.
export default function Media({ src, alt = '', skeleton = false, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const done = () => setLoaded(true)
  const video = isVideo(src)
  return (
    <>
      {video ? (
        <video
          src={src}
          aria-label={alt || undefined}
          autoPlay muted loop playsInline
          onLoadedData={done}
          onError={done}
          {...props}
        />
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
