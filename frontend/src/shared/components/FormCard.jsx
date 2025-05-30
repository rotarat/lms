import classNames from 'classnames'
import { Alert } from './Alert'
import { Link } from 'react-router-dom'

/**
 * FormCard
 *
 * A Bootstrap card wrapper for any form-like content.
 * 
 * Props:
 * - title:        string                 // the heading text
 * - error:        string | null          // form‐submission error
 * - children:     ReactNode              // main body (inputs, labels, etc.)
 * - footer:       ReactNode              // action row (buttons, links)
 * - className:    string                 // extra classes on outer container
 * - cardClassName:string                 // extra classes on the .card itself
 */
export function FormCard({
  title,
  error,
  children,
  className,
  footer,
  footerText,
  footerLinkText,
  to
}) {
  return (
    <div className={classNames('card w-100', className)}>
      <div className="card-body">
        <h4 className="card-title mt-1">{title}</h4>
        {error && <Alert>{error}</Alert>}
        {children}
        {footer && (
          <div className="row mt-3 text-center">
            <p className="card-text">{footerText} <Link to={to}>{footerLinkText}</Link></p>
          </div>
        )}
      </div>
    </div>
  )
}
