import classNames from 'classnames'

/**
 * RadioGroup — renders a dynamic set of radio inputs using the shared Input atom.
 *
 * Props:
 * - name: string
 * - options: Array<{ label: string, value: any, id?: string }>
 * - selected: any
 * - onChange: (e) => void
 * - error: string|null
 * - inline: boolean (optional)
 * - className: string (optional) additional container classes
 */
export function RadioGroup({
  name,
  options,
  selected,
  onChange,
  error,
  inline = false,
  className = '',
}) {
  return (
    <div className={className}>
      {options.map(({ label, value, id }, idx) => {
        const inputId = id || `${name}-${value}`
        return (
          <div
            key={value}
            className={classNames(
              'form-check',
              inline && 'form-check-inline'
            )}
          >
            <input
              className={classNames(
                'form-check-input',
                error && idx === 0 && 'is-invalid'
              )}
              type="radio"
              name={name}
              id={inputId}
              value={value}
              checked={selected === value}
              onChange={onChange}
            />
            <label className="form-check-label" htmlFor={inputId}>
              {label}
            </label>
          </div>
        )
      })}
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  )
}