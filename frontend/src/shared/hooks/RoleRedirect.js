import { Navigate } from 'react-router-dom'
import { useAuth }  from './useAuth'

export default function RoleRedirect() {
  const { profile, loading } = useAuth()

  // wait until we know who you are
  if (loading) return null

  // not logged in? bounce you to login
  if (!profile) return <Navigate to="/login" replace/>

  // push you to the proper child
  return profile.role === 'student'
    ? <Navigate to="student" replace/>
    : <Navigate to="teacher" replace/>
}
