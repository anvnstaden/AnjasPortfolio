const colors = ['pink', 'blue', 'butter', 'plum']

// Shows the project's first screenshot, or a coloured placeholder until one is added.
export default function ProjectThumb({ project, index }) {
  const image = project.images?.[0]
  if (image) {
    return (
      <div className="thumb">
        <img src={image.src} alt={image.caption || project.title} loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`thumb thumb-empty ${colors[index % colors.length]}`} aria-hidden="true">
      <span>{String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}
