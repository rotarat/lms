import classNames from 'classnames'

/**
 * A Bootstrap form-control textarea, with optional label.
 *
 * Props:
 * - label, id, name, placeholder, value, onChange
 * - rows: number of visible lines (default: 3)
 * - className, ...props
 */
export function TextArea({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  rows = 3,
  className,
  ...props
}) {
  return (
    <div className={label ? 'form-group' : undefined}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label}
        </label>
      )}
      <textarea
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={classNames('form-control', className)}
        {...props}
      />
    </div>
  )
}
