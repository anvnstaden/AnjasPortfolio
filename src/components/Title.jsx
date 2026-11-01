import Split from './Split.jsx'

// A section title.
export default function Title({ text, as: Tag = 'h2', className = '' }) {
  return (
    <Tag className={`title reveal ${className}`}>
      <Split text={text} className="title-en" />
    </Tag>
  )
}
