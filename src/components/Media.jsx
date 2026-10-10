// A screenshot or a screen recording: recordings (.webm/.mp4) play silently on a loop by themselves, so
// moving effects show without anyone having to press play.
const isVideo = (src) => /\.(webm|mp4)$/i.test(src)

export default function Media({ src, alt = '', ...props }) {
  if (isVideo(src)) {
    return <video src={src} aria-label={alt || undefined} autoPlay muted loop playsInline {...props} />
  }
  return <img src={src} alt={alt} {...props} />
}
