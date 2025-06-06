import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { UserCoursesUI } from '../components/UserCoursesUI'
import { useUserCourses } from '../hooks/useUserCourses'
import { generateAudio } from '../../../shared/api/resourses'

export function UserCoursesContainer() {
  const navigate = useNavigate()

  // 1) Pull the “raw” array, loading & error from the hook
  const { courses, loading, error, deleteCourse } = useUserCourses()

  // 2) Copy them into local state so we can update a single item in-place
  const [localCourses, setLocalCourses] = useState([])

  // Whenever `courses` (from the hook) changes, overwrite localCourses
  useEffect(() => {
    setLocalCourses(courses)
  }, [courses])

  const handleView     = (id) => navigate(`/portal/teacher/courses/${id}`)
  const handleProjects = (id) => navigate(`/portal/teacher/courses/${id}/projects`)
  const handleDelete   = (id) => deleteCourse(id)
  const handleAddNew   = ()   => navigate('/portal/teacher/courses/create')

  /**
   * Option B: Merge the updatedCourse into localCourses
   * rather than reloading the entire page.
   */
  const handleGenerateAudio = (id) => {
    generateAudio(id)
    .then((updatedCourse) => {
      // Replace only the one course in localCourses:
      setLocalCourses((prev) =>
        prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
      )
      window.alert('Audio lecture has been generated and saved.')
    })
    .catch((err) => {
      console.error('Audio generation failed:', err)
      window.alert(
          'Audio generation failed. Please check the server logs or try again.'
        )
    })
  }

  return (
    <UserCoursesUI
      courses={localCourses}
      loading={loading}
      error={error}
      onView={handleView}
      onEdit={(id) => navigate(`/portal/teacher/courses/${id}/edit`)}
      onDelete={handleDelete}
      onProjects={handleProjects}
      onGenerateAudio={handleGenerateAudio}
      onAddNew={handleAddNew}
    />
  )
}
