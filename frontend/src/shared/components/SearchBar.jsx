import classNames from 'classnames'
import { Input } from './Input'
import { Button } from './Button'

/**
 * A search field + button.
 * 
 * value        — controlled input value
 * onChange     — input change handler
 * onSearch     — invoked on button click or Enter key
 * placeholder  — input placeholder
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search…',
  className,
  style = {},
  rightImageSrc,
}) {
  return (
    <div className={classNames('input-group align-items-center', className)} style={style}>
      <Input
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={e => {
          if (e.key === 'Enter') onSearch()
        }}
      />
      <Button variant="outline-secondary" onClick={onSearch}>
        Search
      </Button>
    </div>
  )
}
