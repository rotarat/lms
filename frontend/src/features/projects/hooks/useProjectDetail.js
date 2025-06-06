import { useState, useEffect } from 'react'
import { projectsApi } from '../../../shared/api/resourses'

/**
 * Fetch one Project by projectId.
 * In many resource‐factory setups, `projectsApi.get(id)` returns the JSON
 * object directly (not { data: … }). Adjust accordingly.
 */
export function useProjectDetail(projectId) {
  const [project, setProject] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!projectId) return

    setLoading(true)
    setError(null)

    projectsApi
      .get(projectId)
      .then((res) => {
        // If your API client returns the project directly:
        setProject(res)
        // If instead your API client returns { data: project }, use:
        // setProject(res.data)
      })
      .catch((err) => {
        setError(err.response?.data || err.message)
        setProject(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [projectId])

  return { project, loading, error }
}
