import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useAuth } from '../../../shared/hooks/useAuth'
import { examsApi, studentExamsApi } from '../../../shared/api/resourses'

export function useEnrolledExamsData() {
  const { profile } = useAuth()
  const [exams, setExams]         = useState([])
  const [attempts, setAttempts]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    Promise.all([
      examsApi.list({ enrolled: profile.username, page_size: 100 }),
      studentExamsApi.list({ page_size: 100 })
    ])
    .then(([e, a]) => {
      setExams(e.results ?? e)
      setAttempts(a.results ?? a)
    })
    .finally(() => setLoading(false))
  }, [profile])

  const now = dayjs()
  // Upcoming: due in future & not yet submitted
  const upcoming = exams.filter(exam =>
    dayjs(exam.due_date).isAfter(now) &&
    !attempts.some(at => at.exam === exam.id && at.submitted_at)
  )
  // Finished: those with a non-null grade
  const finished = attempts.filter(at => at.grade != null)

  return { upcoming, finished, loading }
}
