import Split from './Split.jsx'
import { Underline } from './Doodles.jsx'

// Section title in English, with the German "handwritten" next to it.
export default function Title({ en, de, as: Tag = 'h2', className = '' }) {
  return (
    <Tag className={`title reveal ${className}`}>
      <Split text={en} className="title-en" />
      <span className="title-de pen write" lang="de">
        {de}
        <Underline className="draw" />
      </span>
    </Tag>
  )
}
