import { useNavigate } from 'react-router-dom'
import EnrolledCoursesUI from '../components/EnrolledCoursesUI'
import { useEnrolledCourses } from '../hooks/useEnrolledCourses'

export default function EnrolledCoursesContainer() {
  const navigate = useNavigate()
  const { courses, loading, error } = useEnrolledCourses()

  // Navigate to course detail when a card is clicked
  const handleView = (id) => {
    navigate(`/portal/student/courses/${id}`)
  }

  return (
    <EnrolledCoursesUI
      courses={courses}
      loading={loading}
      error={error}
      onView={handleView}
    />
  )
}
