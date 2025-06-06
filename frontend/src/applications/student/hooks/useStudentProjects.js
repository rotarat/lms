import { useState, useEffect } from 'react'
import { useAuth } from '../../../shared/hooks/useAuth'
import { projectsApi } from '../../../shared/api/resourses'

/**
 * Fetch every project for the current student.
 * Uses GET /api/projects/?username=<studentUsername>,
 * then listAll(...) paginates through all pages.
 */
export function useStudentProjects() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!profile?.username) return

    setLoading(true)
    setError(null)

    projectsApi
      .listAll({ params: { username: profile.username } })
      .then((allProjects) => {
        setProjects(allProjects)
      })
      .catch((err) => {
        setError(err.response?.data || err.message)
        setProjects([]) // ensure it’s always an array
      })
      .finally(() => {
        setLoading(false)
      })
  }, [profile?.username])

  return { projects, loading, error }
}
