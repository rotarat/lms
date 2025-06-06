import { useState, useEffect } from 'react'
import { coursesApi } from '../../../shared/api/resourses'

/**
 * Paginated listing of **not‐yet‐enrolled** courses for the current student.
 * Always passes ?not_enrolled=true to the backend.
 */
export function useAllCourses(pageSize = 12) {
  const [courses, setCourses]    = useState([])
  const [page, setPage]          = useState(1)
  const [count, setCount]        = useState(0)
  const [totalPages, setTotal]   = useState(0)
  const [loading, setLoading]    = useState(true)
  const [error, setError]        = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // We assume coursesApi.listWithMeta can accept any params object
    coursesApi
      .listWithMeta({ not_enrolled: true, page, page_size: pageSize })
      .then(({ items, count: c, next, previous }) => {
        setCourses(items)
        setCount(c)
        setTotal(Math.ceil(c / pageSize))
      })
      .catch((err) => {
        setError(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [page, pageSize])

  return {
    courses,
    page,
    setPage,
    totalPages,
    loading,
    error,
  }
}
