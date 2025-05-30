import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { Spinner } from '../components/Spinner'

/**
 * Wrap any tree that requires a specific role (e.g. ['student'], ['teacher']).
 * - While auth state is loading: show spinner
 * - If not logged in: redirect to /login
 * - If logged in but `profile.role` ∉ allowedRoles: redirect to home
 * - Otherwise: render children
 */
export function RequireRole({ allowedRoles = [], children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="d-flex justify-content-center py-5"><Spinner /></div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
