import { useState } from 'react'
import { apiClient } from '../../../shared/api/apiClient'

/**
 * Hook to kick off a new StudentExam.
 * Calls POST /api/student/exams/start/ with { exam_id }.
 */
export function useStartExam() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const start = async (examId) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.post('/student/exams/start/', {
        exam_id: examId
      })
      return data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { start, loading, error }
}
