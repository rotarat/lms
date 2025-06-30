import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import { enroll } from '../../../shared/api/resourses'
import { useAllCourses } from '../hooks/useAllCourses'
import AllCoursesUI from '../components/AllCoursesUI'

export default function AllCoursesContainer() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  // Fetch “not‑enrolled” courses
  const {
    courses: visibleCourses,
    page,
    totalPages,
    setPage,
    loading,
    error,
  } = useAllCourses()

  // Handle “Enroll” → navigate to detail page
  const handleEnroll = (courseId) => {
    enroll(courseId)
      .then(() => {
        if (refreshProfile) {
          refreshProfile()
        }
        navigate(`/portal/student/courses/${courseId}`)
      })
      .catch((err) => {
        console.error('Enroll failed:', err)
        window.alert('Enrollment failed. Please try again.')
      })
  }

  return (
    <AllCoursesUI
      courses={visibleCourses}
      page={page}
      totalPages={totalPages}
      setPage={setPage}
      loading={loading}
      error={error}
      enrolledCourseIds={profile?.enrolled_courses || []}
      onEnroll={handleEnroll}
    />
  )
}