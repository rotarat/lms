import { useState, useEffect } from 'react'
import { useParams }           from 'react-router-dom'
import { coursesApi, videosApi, presentationsApi }           from '../../../shared/api/resourses'

/**
 * Fetches a single course, plus all its videos & presentations.
 * Uses:
 *   GET    /courses/{id}/            → coursesApi.get(id)
 *   GET    /videos/?course={id}      → videosApi.list({ course: id })
 *   GET    /presentations/?course={id} → presentationsApi.list({ course: id })
 */
export function useCourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse]             = useState(null)
  const [videos, setVideos]             = useState([])
  const [presentations, setPresentations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      coursesApi.get(courseId),
      videosApi.list({ course: courseId }),
      presentationsApi.list({ course: courseId }),
    ])
      .then(([c, vs, ps]) => {
        setCourse(c)
        setVideos(vs)
        setPresentations(ps)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [courseId])

  return { course, videos, presentations, loading, error }
}
