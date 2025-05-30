import { useState } from 'react'
import { studentExamsApi } from '../../../shared/api/resourses'

/**
 * POST answers to /api/student-exams/submit/ and capture the returned grade.
 */
export function useSubmitExam() {
  const [grade, setGrade]   = useState(null)
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async ({ attemptId, answers }) => {
    setLoading(true)
    try {
      const data = await studentExamsApi.submit(null, {
        attempt_id: attemptId,
        answers
      })
      setGrade(data.grade)
      setError(null)
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return { grade, submit, loading, error }
}
