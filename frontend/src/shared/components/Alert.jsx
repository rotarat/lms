/**
 * Bootstrap alert wrapper.
 *
 * Props:
 * - type: 'primary' | 'secondary' | 'success' | 'danger' | etc.
 * - children: node
 */
export function Alert({ type = 'danger', children }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {children}
    </div>
  )
}
