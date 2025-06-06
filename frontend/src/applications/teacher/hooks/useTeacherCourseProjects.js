import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { projectsApi } from '../../../shared/api/resourses'

/**
 * Fetch all Projects for a given courseId (teacher only).
 * Uses GET /api/projects/?course=<courseId>
 * with pagination via listAll().
 */
export function useTeacherCourseProjects() {
  const { courseId } = useParams()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    projectsApi
      .listAll({ params: { course: courseId } })
      .then(allProjects => setProjects(allProjects))
      .catch(err => {
        setError(err.response?.data || err.message);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  return { projects, loading, error }
}
