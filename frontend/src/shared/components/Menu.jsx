import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import icons from '../../assets/icons'
import { routesConfig } from '../../routes'

export default function Menu({ className = '' }) {
  const { profile } = useAuth()
  const role = profile?.role   // "student" or "teacher"
  const roleRoutes = routesConfig[role] || []
  const sharedRoutes = routesConfig.shared || []

  // Combine role-specific routes with shared routes
  const allRoutes = [...roleRoutes, ...sharedRoutes]

  // Group routes by their section header
  const sections = Array.from(new Set(allRoutes.map(r => r.section)))

  return (
    <nav className={`mt-4 nav flex-column small ${className}`}>
      {sections.map(section => (
        <div key={section} className="mb-2 ps-0">
          <div className="d-none d-lg-block text-uppercase text-body-secondary fw-light ps-0 mb-2">
            {section}
          </div>

          {allRoutes
            .filter(r => r.section === section && !r.hideInMenu)
            .map(r => (
              <Link
                key={r.path}
                to={`/portal/${role}/${r.path}`}
                className="nav-link d-flex align-items-center ps-0 py-2 text-secondary"
              >
                <img
                  src={icons[r.icon]}
                  alt=""
                  width={20}
                  height={20}
                  className="me-2 flex-shrink-0"
                />
                <span className="d-none d-md-inline">{r.label}</span>
              </Link>
            ))
          }
        </div>
      ))}
    </nav>
  )
}