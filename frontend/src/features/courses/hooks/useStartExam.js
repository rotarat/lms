import { useState } from 'react'
import { examsApi } from '../../../shared/api/resourses'

/**
 * Call /api/exams/{id}/start/ and stash the returned test, duration, attempt_id.
 */
export function useStartExam() {
  const [session, setSession] = useState(null)
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const start = async examId => {
    setLoading(true)
    try {
      const data = await examsApi.start(examId)   // custom action
      setSession({
        test:       data.test,
        duration:   data.duration,
        attemptId:  data.attempt_id
      })
      setError(null)
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return { session, start, loading, error }
}
