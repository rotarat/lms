// src/features/courses/hooks/useStudentExamDetail.js

import { useState, useEffect, useCallback } from 'react'
import { studentExamsApi } from '../../../shared/api/resourses'

/**
 * Hook to fetch & update a single StudentExam by ID.
 * Uses studentExamsApi.get(studentExamId) under the hood.
 */
export function useStudentExamDetail(studentExamId) {
  const [studentExam, setStudentExam] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [saving, setSaving]           = useState(false)

  const fetchDetail = useCallback(async () => {
    if (!studentExamId) return

    setLoading(true)
    setError(null)

    try {
      // ← use .get() here to hit GET /api/studentexams/{id}/
      const data = await studentExamsApi.get(studentExamId)
      setStudentExam(data)
    } catch (err) {
      setError(err.response?.data || err.message)
      setStudentExam(null)
    } finally {
      setLoading(false)
    }
  }, [studentExamId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const saveGrade = async ({ grade, personal_feedback }) => {
    setSaving(true)
    setError(null)

    try {
      // PATCH /api/studentexams/{id}/
      await studentExamsApi.patch(studentExamId, {
        grade,
        personal_feedback,
      })
      // re-fetch so UI updates
      await fetchDetail()
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return {
    studentExam,
    loading,
    error,
    saving,
    refetch: fetchDetail,
    saveGrade,
  }
}
