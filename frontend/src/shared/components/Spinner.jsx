import classNames from 'classnames'

/**
 * A simple Bootstrap spinner.
 *
 * Props:
 * - size: 'sm' (small) or undefined
 * - role: aria role (default 'status')
 * - className: extra classes
 */
export function Spinner({ size, role = 'status', className }) {
  return (
    <div
      className={classNames(
        'spinner-border',
        size === 'sm' && 'spinner-border-sm',
        className
      )}
      role={role}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}
