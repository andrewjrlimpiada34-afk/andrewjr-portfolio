function TechBadge({ item, compact = false }) {
  return (
    <article className={`capability-card${compact ? ' compact' : ''}`}>
      <div className="capability-media">
        {item.image
          ? <img src={item.image} alt="" loading="lazy" />
          : <span aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</span>}
      </div>
      <p>{item.name}</p>
    </article>
  )
}

export default TechBadge
