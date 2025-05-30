import logo from '../../assets/lms_logo.png'
import { Link } from 'react-router-dom'

/**
 * Simple Logo component
 *
 * Props:
 * - loading: boolean
 * - loadingLabel: string
 * - children: ReactNode (button text when not loading)
 * - ...props: passed to Button
 */
export function Logo({
  children,
	to,
}) {
  return (
    <Link
        to={to}
        className="flex items-center justify-center lg:justify-start gap-2"
        style={{ textDecoration: 'none' }}
    >
        <img src={logo} alt="logo" width={50} height={50} />
        <span className="font-bold"><strong>{children}</strong></span>
    </Link>
  )
}