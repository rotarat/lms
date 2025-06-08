import { useState, useEffect, useCallback } from 'react'
import { studentExamsApi } from '../../../shared/api/resourses'

/**
 * Fetch one StudentExam attempt (read-only).
 * @param {string} studentExamId
 */
export function useStudentExamDetail(studentExamId) {
  const [examAttempt, setExamAttempt] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const fetchDetail = useCallback(async () => {
    if (!studentExamId) return
    setLoading(true)
    setError(null)
    try {
      const data = await studentExamsApi.get(studentExamId)
      setExamAttempt(data)
    } catch (err) {
      setError(err.response?.data || err.message)
      setExamAttempt(null)
    } finally {
      setLoading(false)
    }
  }, [studentExamId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { examAttempt, loading, error, refetch: fetchDetail }
}
