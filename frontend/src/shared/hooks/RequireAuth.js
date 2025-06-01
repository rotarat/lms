import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { Spinner } from '../components/Spinner'
import AuthContexth from '../context/AuthProvider';

/**
 * Wrap any tree that requires a logged-in user.
 * - While auth state is loading: show spinner
 * - If not logged in: redirect to /login (preserving `from` in location.state)
 * - Otherwise: render children
 */
export function RequireAuth({ children }) {
  const { tokens, profile, loading } = useAuth(AuthContexth);
  const location = useLocation()

  if (loading) {
    // you can swap in any loading atom you like
    return <div className="d-flex justify-content-center py-5"><Spinner /></div>
  }

  if (!tokens || !profile) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    )
  }

  return children
}
