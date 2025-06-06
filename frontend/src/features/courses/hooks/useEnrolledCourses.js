import { useState, useEffect } from 'react'
import { coursesApi } from '../../../shared/api/resourses'
import { useAuth }    from '../../../shared/hooks/useAuth'

/**
 * Paginated listing of **not‐yet‐enrolled** courses for the current student.
 * Always passes ?not_enrolled=true to the backend.
 */
export function useEnrolledCourses(pageSize = 12) {
  const { profile } = useAuth()
  const [courses, setCourses]    = useState([])
  const [page, setPage]          = useState(1)
  const [count, setCount]        = useState(0)
  const [totalPages, setTotal]   = useState(0)
  const [loading, setLoading]    = useState(true)
  const [error, setError]        = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    coursesApi
      .listWithMeta({ enrolled: profile.username })
      .then(({ items, count: c, next, previous }) => {
        setCourses(items)
        setCount(c)
        setTotal(Math.ceil(c / pageSize))
      })
      .catch((err) => {
        setError(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, profile.username])

  return {
    courses,
    page,
    setPage,
    totalPages,
    loading,
    error,
  }
}
