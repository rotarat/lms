import { useState, useEffect } from 'react'
import { useAuth }              from '../../../shared/hooks/useAuth'
import { studentExamsApi }      from '../../../shared/api/resourses'

export function useStudentExams() {
  const { profile }   = useAuth()
  const [allExams, setAllExams]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!profile?.username) return

    setLoading(true)
    setError(null)

    studentExamsApi
      .listAll({
        params: {
          student__user__username: profile.username,
        }
      })
      .then((list) => setAllExams(list))
      .catch((err) => setError(err.response?.data || err.message))
      .finally(() => setLoading(false))
  }, [profile.username])

  const upcoming = allExams.filter((e) => e.submitted_at === null)
  const finished = allExams.filter((e) => e.submitted_at || e.started_at !== null)

  return { upcoming, finished, loading, error }
}
