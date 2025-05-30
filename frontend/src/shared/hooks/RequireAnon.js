import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { Spinner } from '../components/Spinner'

/**
 * Only render children when there is NO logged-in user.
 * - If auth is still loading: show a spinner
 * - If user is logged in: redirect to their portal home
 * - Otherwise: render children
 */
export function RequireAnon({ children }) {
  const { profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="d-flex justify-content-center py-5"><Spinner/></div>
  }

  if (profile) {
    // send them to /portal/student or /portal/teacher
    return (
      <Navigate
        to={`/portal/${profile.role}`}
        state={{ from: location }}
        replace
      />
    )
  }

  
  return children
}
