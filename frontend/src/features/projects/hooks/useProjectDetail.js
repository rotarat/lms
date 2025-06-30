import { useState, useEffect } from 'react'
import { projectsApi } from '../../../shared/api/resourses'

export function useProjectDetail(projectId) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    setError(null)

    projectsApi
      .get(projectId)
      .then(res => setProject(res))
      .catch(err => {
        setError(err.response?.data || err.message)
        setProject(null)
      })
      .finally(() => setLoading(false))
  }, [projectId])

  return { project, loading, error }
}