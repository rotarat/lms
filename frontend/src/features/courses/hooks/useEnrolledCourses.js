import { useState, useEffect } from 'react'
import { useAuth }           from '../../../shared/hooks/useAuth'
import { coursesApi }         from '../../../shared/api/resourses'

export function useEnrolledCourses() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!profile) return
    setLoading(true)

    coursesApi
      .list({ enrolled: profile.id, page_size: 100 })
      .then(items => {
        setCourses(items)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [profile])

  return { courses, loading, error }
}
