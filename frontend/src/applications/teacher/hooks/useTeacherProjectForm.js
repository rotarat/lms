import { useState, useEffect } from 'react'
import { projectsApi } from '../../../shared/api/resourses'

/**
 * Hook for teacher to add/edit grade + reason on a project.
 * - GET existing grade & reason (if any).
 * - PATCH { grade, reason } on submit.
 */
export function useTeacherProjectForm(projectId) {
  const [grade, setGrade] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!projectId) return

    setLoading(true)
    setError(null)

    projectsApi
      .get(projectId)
      .then((res) => {
        // If your API client returns { data: project }, use res.data; otherwise res is the project
        const proj = res.data ?? res
        setGrade(proj.grade ?? '')
        setReason(proj.reason ?? '')
      })
      .catch((err) => {
        setError(err.response?.data || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [projectId])

  /**
   * Returns a promise that resolves after the PATCH completes (success or failure).
   * On success, loading is turned off; on error, loading is turned off and error is set.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await projectsApi.patch(projectId, { grade, reason })
      setLoading(false)
      return Promise.resolve()
    } catch (err) {
      setError(err.response?.data || err.message)
      setLoading(false)
      return Promise.reject(err)
    }
  }

  return { grade, setGrade, reason, setReason, loading, error, handleSubmit }
}
