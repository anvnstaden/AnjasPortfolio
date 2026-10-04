// Splits text into word and character spans; each character gets --i for a staggered CSS animation.
export default function Split({ text, className, offset = 0 }) {
  let i = offset
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span className="word" aria-hidden="true" key={w}>
          {[...word].map((ch, c) => (
            <span className="char" style={{ '--i': i++ }} key={c}>{ch}</span>
          ))}
        </span>
      ))}
    </span>
  )
}
