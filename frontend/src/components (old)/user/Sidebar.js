import { useContext } from 'react'
import { Link }              from 'react-router-dom'
import { AuthContext }       from '../../context/AuthContext'

export default function Sidebar() {
  const { profile } = useContext(AuthContext)

  return (
    <ul className="list-group">
      <li className="list-group-item active">Dashboard</li>

      {profile?.role === 'teacher' && (
        <>
          <li className="list-group-item">
            <Link to="/user/courses">My Courses</Link>
          </li>
          <li className="list-group-item">
            <Link to="/user/videos">My Videos</Link>
          </li>
        </>
      )}
      <li className="list-group-item">
        <Link to="/user/presentations">My Presentations</Link>
      </li>
      <li className="list-group-item">
        <Link to="/user/change-password">Change Password</Link>
      </li>
      <li className="list-group-item">
        <Link to="/logout" className="text-danger">Logout</Link>
      </li>
    </ul>
  )
}
