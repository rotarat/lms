import { Link } from 'react-router-dom'
import logo from '../../assets/lms_logo.png'

export function Footer() {
  return (
    <footer className="border-top py-1">
      <div className="container text-center">
        <Link to="/" className="d-block mt-1">
          <img src={logo} alt="Logo" height="50"/>
        </Link>
        <nav className="nav justify-content-center mb-3">
          <Link className="nav-link" to="/courses">Course Catalog</Link>
          <Link className="nav-link" to="/student">Student Portal</Link>
          <Link className="nav-link" to="/teacher">Teacher Resources</Link>
          <Link className="nav-link" to="/faq">FAQ</Link>
        </nav>
        <small className="text-muted">© 2025 Learning Management System</small>
      </div>
    </footer>
  )
}
