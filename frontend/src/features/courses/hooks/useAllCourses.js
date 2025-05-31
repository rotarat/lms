import { useState, useEffect } from 'react'
import { coursesApi }           from '../../../shared/api/resourses'

/**
 * Paginated listing of all courses.
 * Uses coursesApi.listWithMeta() to get items + count/next/previous.
 */
export function useAllCourses(pageSize = 12) {
  const [courses, setCourses]     = useState([])
  const [page, setPage]           = useState(1)
  const [count, setCount]         = useState(0)
  const [next, setNext]           = useState(null)
  const [previous, setPrevious]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    setLoading(true)
    coursesApi
      .listWithMeta({ page, page_size: pageSize })
      .then(({ items, count, next, previous }) => {
        setCourses(items)
        setCount(count)
        setNext(next)
        setPrevious(previous)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [page, pageSize])

  const totalPages = Math.ceil(count / pageSize)
  return {
    courses,
    page,
    setPage,
    count,
    next,
    previous,
    totalPages,
    loading,
    error,
  }
}
