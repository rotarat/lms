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
  const [generatingId, setGeneratingId] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)

  // Whenever `courses` (from the hook) changes, overwrite localCourses
  useEffect(() => {
    setLocalCourses(courses)
  }, [courses])

  const handleView     = (id) => navigate(`/portal/teacher/courses/${id}`)
  const handleProjects = (id) => navigate(`/portal/teacher/courses/${id}/projects`)
  const handleExamsCreate    = (id) => navigate(`/portal/teacher/courses/${id}/exams/new`)
  const handleExamsVIew    = (id) => navigate(`/portal/teacher/courses/${id}/exams`)
  const handleDelete   = (id) => deleteCourse(id)
  const handleAddNew   = ()   => navigate('/portal/teacher/courses/create')
  const [localCourses, setLocalCourses] = useState([])


  /**
   * Option B: Merge the updatedCourse into localCourses
   * rather than reloading the entire page.
   */
  const handleGenerateAudio = (id) => {
    // kick off loading
    setGeneratingId(id)
    setAlertMessage(
      'Your request is received and we are now generating the audio summarize! You can safely continue using the site.'
    )
    generateAudio(id)
    .then((updatedCourse) => {
      // Replace only the one course in localCourses:
      setLocalCourses((prev) =>
        prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
      )
      // once done, clear loading
      setGeneratingId(null)
    })
    .catch((err) => {
      console.error('Audio generation failed:', err)
      window.alert(
          'Audio generation failed. Please check the server logs or try again.'
        )
    })
  }

  return (
    <>
      {alertMessage && (
        <div className="alert alert-success" role="alert">
          {alertMessage}
        </div>
      )}
      <UserCoursesUI
        courses={localCourses}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={(id) => navigate(`/portal/teacher/courses/${id}/edit`)}
        onDelete={handleDelete}
        onProjects={handleProjects}
        onCreateExam={handleExamsCreate}
        onExamVIew={handleExamsVIew}
        onGenerateAudio={handleGenerateAudio}
        generatingId={generatingId}
        onAddNew={handleAddNew}
      />
    </>
  )
}
