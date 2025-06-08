import { useState } from 'react'
import { studentExamsApi } from '../../../shared/api/resourses'

/**
 * Given a studentExamId, fetch that one attempt.
 */
export function useStartExam() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const start = async (studentExamId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await studentExamsApi.get(studentExamId)
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
