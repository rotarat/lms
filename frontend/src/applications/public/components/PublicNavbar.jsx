import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/Button'
import logo from '../../../assets/lms_logo.png'

export function PublicNavbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg bg-primary py-1" data-bs-theme="light">
      <div className="container-fluid">

        {/* Left nav */}
        <div className="d-flex align-items-center">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/courses" className="nav-link text-secondary">
                Courses Offered
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Center brand */}
        <div className="flex-grow-1 text-center">
          <Link to="/" className="navbar-brand mx-auto">
            <img src={logo} alt="Logo" height="50" />
          </Link>
        </div>

        {/* Right login button */}
        <div className="d-flex align-items-center">
          <Button
            outline={true}
            variant='light'
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}
