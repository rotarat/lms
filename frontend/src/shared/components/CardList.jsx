import classNames from 'classnames'

/**
 * Renders a responsive grid of cards/items.
 * 
 * items       — array of data items
 * renderItem  — function that returns a <Card> (or any JSX) for each item
 * cols        — how many columns per row (1–12); default 3 => col-md-4
 * className   — extra classes on the .row
 */
export function CardList({
  items,
  renderItem,
  cols = 3,
  className
}) {
  // bootstrap: 12 / cols => column width
  const colClass = `col-md-${Math.floor(12 / cols)}`

  if (!items || items.length === 0) {
    return <p className="text-center">No items to display.</p>
  }

  return (
    <div className={classNames('row g-3', className)}>
      {items.map(item => (
        <div key={item.id || item.key} className={colClass}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
