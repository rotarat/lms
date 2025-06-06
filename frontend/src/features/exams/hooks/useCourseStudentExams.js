import { useState, useEffect, useCallback } from 'react'
import { studentExamsApi } from '../../../shared/api/resourses'

/**
 * Fetch all StudentExam attempts for the given courseId:
 *   GET /api/studentexams/?exam__course=<courseId>
 * Returns { studentExams, loading, error, refetch }.
 */
export function useCourseStudentExams(courseId) {
  const [studentExams, setStudentExams] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetchAttempts = useCallback(() => {
    if (!courseId) return

    setLoading(true)
    setError(null)

    studentExamsApi
      .listAll({ params: { 'exam__course': courseId } })
      .then((allData) => {
        // allData will be an array of StudentExam objects
        setStudentExams(allData)
      })
      .catch((err) => {
        setError(err.response?.data || err.message)
        setStudentExams([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [courseId])

  useEffect(() => {
    fetchAttempts()
  }, [fetchAttempts])

  return { studentExams, loading, error, refetch: fetchAttempts }
}
