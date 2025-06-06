import { useState } from 'react'
import { examsApi } from '../../../shared/api/resourses'

/**
 * Hook to create a new Exam.
 * Usage:
 *   const { create, loading, error } = useCreateExam()
 *   create({ course, description, difficulty, key_concepts, num_questions, duration, due_date })
 */
export function useCreateExam() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const create = async (data) => {
    setLoading(true)
    setError(null)
    try {
      // coursesApi.create sends POST /api/exams/ with { ...data }
      await examsApi.create(data)
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}
