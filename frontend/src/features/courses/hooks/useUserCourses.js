import { useState, useEffect } from 'react'
import { useAuth }             from '../../../shared/hooks/useAuth'
import { coursesApi }           from '../../../shared/api/resourses'

export function useUserCourses() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    coursesApi
      .list({ owner: profile.username })
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

  const deleteCourse = async id => {
    await coursesApi.delete(id)
    setCourses(cs => cs.filter(c => c.id !== id))
  }

  return { courses, loading, error, deleteCourse }
}
