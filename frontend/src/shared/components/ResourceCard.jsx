import { Link } from 'react-router-dom'
import classNames from 'classnames'

/**
 * Generic Card component
 * 
 * Props:
 * - to: string           // link for both image and title
 * - imageSrc: string     // optional image URL
 * - imageAlt: string     // defaults to title
 * - title: string
 * - description: string  // optional
 * - className: string    // extra classes on <div.card>
 */
export function ResourceCard({
  to,
  imageSrc,
  imageAlt,
  title,
  description,
  className,
  ...props
}) {
  return (
    <div className={classNames('card border-secondary mb-3', className)} {...props}>
      {imageSrc && (
        <Link to={to}>
          <img
            src={imageSrc}
            className="card-img-top"
            alt={imageAlt || title}
          />
        </Link>
      )}
      <div className="card-body">
        <h4 className="card-title">
          <Link
            to={to}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {title}
          </Link>
        </h4>
        {description && (
          <p className="card-text">{description}</p>
        )}
      </div>
    </div>
  )
}
