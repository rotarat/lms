import classNames from 'classnames'

/**
 * Generic Bootstrap-styled button supporting one or multiple onClick handlers.
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
 * - size: 'sm' | 'lg'
 * - outline: boolean
 * - block: boolean
 * - onClick: function or array of functions
 * - disabled: boolean
 * - className: string
 * - children: ReactNode
 * - ...props: other button props (type, id, etc.)
 */
export function Button({
  variant = 'primary',
  size,
  outline = false,
  block = false,
  onClick,
  disabled = false,
  className,
  children,
  ...props
}) {
  const baseClass = outline ? `btn-outline-${variant}` : `btn-${variant}`
  const classes = classNames(
    'btn',
    baseClass,
    size && `btn-${size}`,
    block && 'btn-block',
    disabled && 'disabled',
    className
  )

  const handleClick = event => {
    if (disabled) return
    if (Array.isArray(onClick)) {
      onClick.forEach(fn => {
        if (typeof fn === 'function') fn(event)
      })
    } else if (typeof onClick === 'function') {
      onClick(event)
    }
  }

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
