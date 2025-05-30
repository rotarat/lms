import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Button } from '../../../shared/components/Button'
import logo from '../../../assets/lms_logo.png'

export function PublicNavbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle text-secondary"
                id="resourcesDropdown"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
              >
                Resources
              </button>
              <ul
                className={classNames('dropdown-menu', { show: open })}
                aria-labelledby="resourcesDropdown"
              >
                <li><Link className="dropdown-item" to="/resources/articles">Articles</Link></li>
                <li><Link className="dropdown-item" to="/resources/videos">Videos</Link></li>
              </ul>
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
