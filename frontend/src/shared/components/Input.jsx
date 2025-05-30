import classNames from 'classnames'

/**
 * A Bootstrap-styled input with label and validation feedback.
 *
 * Props:
 * - label: string               // text for the <label>
 * - id: string                  // overrides the generated id (defaults to name)
 * - name: string                // input name
 * - type: string                // input type (text, password, email, etc.)
 * - placeholder: string
 * - value: any
 * - onChange: func
 * - error: string|null          // if set, shows invalid-feedback and adds .is-invalid
 * - containerClassName: string  // extra classes on the outer <div>
 * - labelClassName: string      // extra classes on the <label>
 * - inputClassName: string      // extra classes on the <input>
 * - ...props                    // any other <input> props: autoComplete, disabled, required, etc.
 */
export function Input({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  containerClassName,
  labelClassName,
  inputClassName,
  ...props
}) {
  const inputId = id || name

  return (
    <div className={classNames('mb-1', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={classNames('form-label mt-3', labelClassName)}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        className={classNames(`form-control ${error ? 'is-invalid' : ''}`)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}
