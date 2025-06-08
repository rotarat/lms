import { useState } from 'react'
import { studentExamsApi } from '../../../shared/api/resourses'

/**
 * Submit answers for a given studentExamId.
 */
export function useExamDetail() {
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const submit = async (studentExamId, answers) => {
    setSaving(true)
    setError(null)
    try {
      await studentExamsApi.submit(studentExamId, { answers })
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return { submit, saving, error }
}
