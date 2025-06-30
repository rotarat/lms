import { useState, useEffect } from 'react'
import { useAuth } from '../../../shared/hooks/useAuth'
import { coursesApi, examsApi } from '../../../shared/api/resourses'

/**
 * Dashboard data for teacher:
 *  - courses always shown
 *  - exams shown only if loaded successfully
 */
export function useTeacherHome() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState([])
  const [exams,   setExams]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    Promise.allSettled([
      coursesApi.listWithMeta({ owner: profile.username }),
      examsApi.listWithMeta({   owner: profile.username }),
    ]).then(([cResult, eResult]) => {
      // courses: always set (empty array on error)
      if (cResult.status === 'fulfilled') {
        setCourses(Array.isArray(cResult.value.items) ? cResult.value.items : [])
      } else {
        console.error('Courses load error', cResult.reason)
        setCourses([])
      }

      // exams: swallow errors and hide the panel
      if (eResult.status === 'fulfilled') {
        setExams(Array.isArray(eResult.value.items) ? eResult.value.items : [])
      } else {
        console.warn('Exams load error, exams will be hidden', eResult.reason)
        setExams([])
      }
    }).catch((err) => {
      // safety net (shouldn't happen with allSettled)
      console.error('Dashboard load unexpected error', err)
      setCourses([])
      setExams([])
      setError('Nothing to show.')
    }).finally(() => {
      setLoading(false)
    })
  }, [profile])

  return {
    courses,
    exams,
    loading,
    error,
  }
}
