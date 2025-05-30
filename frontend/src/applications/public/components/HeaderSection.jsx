import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Button } from '../../../shared/components/Button'

/**
 * HeaderSection
 *
 * A generic section container that supports:
 * - background image (with dark overlay)
 * - title (h1 or h2)
 * - subtitle (p)
 * - buttons (array of { label, to?, onClick?, variant, outline, size })
 * - tags (array of { label, to?, onClick? } rendered as small badges)
 * - children: any extra JSX
 *
 * Props:
 * - id: string (for anchors)
 * - className: extra classes on outer <section>
 * - style: object (inline styles)
 * - backgroundUrl: string (if provided, used as CSS background-image)
 * - overlayDark: boolean (default true, applies a semi-transparent black overlay)
 * - overlayLabel: string
 * - title: string
 * - titleTag: 'h1'|'h2' etc. (default 'h1')
 * - subtitle: string
 * - buttons: Array<{
 *     label: string,
 *     to?: string,           // react-router Link
 *     onClick?: () => void,  // callback
 *     variant?: string,      // btn variant
 *     outline?: boolean,
 *     size?: 'sm'|'lg'
 *   }>
 * - tags: Array<{
 *     label: string,
 *     to?: string,
 *     onClick?: () => void
 *   }>
 * - children: ReactNode
 */
export function HeaderSection({
  id,
  className,
  style = {},
  backgroundUrl,
  overlayDark = true,
  title,
  titleTag: TitleTag = 'h1',
  subtitle,
  buttons = [],
  tags = [],
  children
}) {
  const hasBg = Boolean(backgroundUrl)
  
  return (
    <section
      id={id}
      className={classNames(
        hasBg ? 'position-relative text-center text-white' : 'py-5 text-dark',
        className
      )}
      style={{
        ...(hasBg && {
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }),
        ...style
      }}
    >
      {hasBg && overlayDark && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
      )}

      <div
        className={classNames(
          'position-relative container',
          hasBg ? 'd-flex flex-column justify-content-center align-items-center py-5' : ''
        )}
      >

        {title && (
          <TitleTag
            className={classNames(
              hasBg ? 'display-4 fw-bold mb-3' : 'fw-bold mb-3'
            )}
          >
            {title}
          </TitleTag>
        )}

        {subtitle && (
          <p className={classNames(hasBg ? 'lead mb-4 text-white-75' : 'text-muted mb-4')}>
            {subtitle}
          </p>
        )}

        {buttons.length > 0 && (
          <div className="d-flex gap-2 mb-4 flex-wrap justify-content-center">
            {buttons.map((btn, i) => {
              const classes = classNames(
                'btn',
                btn.outline
                  ? `btn-outline-${btn.variant || 'primary'}`
                  : `btn-${btn.variant || 'primary'}`,
                btn.size && `btn-${btn.size}`
              )
              if (btn.to) {
                return (
                  <Link key={i} to={btn.to} className={classes} onClick={btn.onClick}>
                    {btn.label}
                  </Link>
                )
              }
              return (
                <Button
                  key={i}
                  variant={btn.variant}
                  outline={btn.outline}
                  size={btn.size}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </Button>
              )
            })}
          </div>
        )}

        {tags.length > 0 && (
          <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
            {tags.map((tag, i) => {
              const badgeClass = classNames(
                'badge py-2 px-3',
                tag.to ? 'bg-light text-dark text-decoration-none' : 'bg-light text-dark'
              )
              if (tag.to) {
                return (
                  <Link key={i} to={tag.to} className={badgeClass} onClick={tag.onClick}>
                    {tag.label}
                  </Link>
                )
              }
              return (
                <button key={i} className={badgeClass} onClick={tag.onClick}>
                  {tag.label}
                </button>
              )
            })}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}