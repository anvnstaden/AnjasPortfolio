// Splits text into word and character spans; each character gets --i for a staggered CSS animation.
// A hyphenated word may wrap after its hyphen, which long German compounds need to fit on a line.
export default function Split({ text, className, offset = 0 }) {
  let i = offset
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').flatMap((word) => word.split(/(?<=-)/)).map((part, w) => (
        <span className={part.endsWith('-') ? 'word joined' : 'word'} aria-hidden="true" key={w}>
          {[...part].map((ch, c) => (
            <span className={ch === 'j' ? 'char char-j' : 'char'} style={{ '--i': i++ }} key={c}>{ch}</span>
          ))}
        </span>
      ))}
    </span>
  )
}
