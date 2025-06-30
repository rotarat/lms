import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../../shared/hooks/useAuth'
import { coursesApi } from '../../../shared/api/resourses'

export default function useStudentHome() {
  const { profile: userProfile } = useAuth()
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // load every course once
  useEffect(() => {
    setLoading(true)
    coursesApi
      .listAll()
      .then(cs => setAllCourses(cs))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  // pick only those IDs the user is enrolled in
  const myCourses = useMemo(() => {
    if (!userProfile?.enrolled_courses || allCourses.length === 0) return []
    return allCourses.filter(c =>
      userProfile.enrolled_courses.includes(c.id)
    )
  }, [userProfile, allCourses])

  return {
    userProfile,
    courses: myCourses,
    loading,
    error
  }
}
