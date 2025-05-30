import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext }       from '../context/AuthContext'

export default function Navbar() {
  const { profile, logout } = useContext(AuthContext)
  const navigate            = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Study portal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/courses" className="nav-link">Courses</Link>
            </li>
            <li className="nav-item">
              <Link to="/videos" className="nav-link">Videos</Link>
            </li>
            <li className="nav-item">
              <Link to="/presentations" className="nav-link">Presentations</Link>
            </li>
            <li className="nav-item">
              <Link to="/chat" className="nav-link">AI Tutor</Link>
            </li>
            <li className="nav-item">
              <Link to="/quiz" className="nav-link">Quiz</Link>
            </li>
          </ul>

          {profile ? (
            <>
              <form className="d-flex mx-lg-3" action="/search" method="get" role="search">
                <input
                  className="form-control me-2"
                  name="q"
                  type="search"
                  placeholder="Search…"
                  aria-label="Search"
                />
                <button className="btn btn-secondary" type="submit">Search</button>
              </form>

              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  type="button"
                  id="userMenuBtn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {profile.first_name
                    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
                    : profile.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuBtn">
                  <li>
                    <Link className="dropdown-item" to={`/user/profile/${profile.username}`}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/user/profile-settings">
                      Profile Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="d-flex ms-auto">
              <Link to="/login" className="btn btn-outline-light">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
