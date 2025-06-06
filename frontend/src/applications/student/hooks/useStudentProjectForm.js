import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { coursesApi, projectsApi } from '../../../shared/api/resourses'
import { useAuth } from '../../../shared/hooks/useAuth'

/**
 * Hook for student to create/upload a new project:
 * - Fetch courses they are enrolled in (so they can pick one).
 * - Manage state: selectedCourse, title, description, and file.
 * - On submit, POST multipart to /api/projects/.
 */
export function useStudentProjectForm() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  const [loadingCourses, setLoadingCourses] = useState(true)
  const [errorCourses, setErrorCourses] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // 1) Fetch the list of courses for this student
  useEffect(() => {
    if (!profile?.username) return

    setLoadingCourses(true)
    setErrorCourses(null)

    // Assuming backend supports GET /api/courses/?username=<studentUsername>
    coursesApi
      .listAll({ params: { username: profile.username } })
      .then((allCourses) => {
        setCourses(allCourses)
        if (allCourses.length > 0) {
          setSelectedCourse(allCourses[0].id)
        }
      })
      .catch((err) => {
        setErrorCourses(err.response?.data || err.message)
        setCourses([])
      })
      .finally(() => {
        setLoadingCourses(false)
      })
  }, [profile.username])

  // 2) Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    if (!selectedCourse || !file) {
      setSubmitError('Please select a course and choose a file.')
      setSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('course', selectedCourse)
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)

      await projectsApi.create(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // On success, redirect back to /portal/student/projects
      navigate('/portal/student/projects', { replace: true })
    } catch (err) {
      setSubmitError(err.response?.data || err.message)
      setSubmitting(false)
    }
  }

  return {
    courses,
    selectedCourse,
    setSelectedCourse,
    title,
    setTitle,
    description,
    setDescription,
    file,
    setFile,
    loadingCourses,
    errorCourses,
    submitting,
    submitError,
    handleSubmit,
  }
}
