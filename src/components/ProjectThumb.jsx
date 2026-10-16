import Media from './Media.jsx'

const colors = ['pink', 'blue', 'butter', 'plum']

// Shows the project's first still screenshot (recordings only play on the projects page, to keep the home
// page light), or a coloured placeholder until one is added.
export default function ProjectThumb({ project, index }) {
  const image = project.images?.find((img) => !/\.(webm|mp4)$/i.test(img.src))
  if (image) {
    return (
      <div className="thumb">
        <Media skeleton src={image.src} alt={image.caption || project.title} loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`thumb thumb-empty ${colors[index % colors.length]}`} aria-hidden="true">
      <span>{String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}
