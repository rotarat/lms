import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import { enroll } from '../../../shared/api/resourses'
import { useAllCourses } from '../hooks/useAllCourses'
import AllCoursesUI from '../components/AllCoursesUI'

export default function AllCoursesContainer() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  // 1) Fetch “not‐enrolled” courses
  const {
    courses: visibleCourses,
    page,
    totalPages,
    setPage,
    loading,
    error,
  } = useAllCourses()


  // 3) Handle “Enroll”
  const handleEnroll = (courseId) => {
    // Optimistic removal: remove from visibleCourses by refetching page=1 or keeping local state
    // Simpler: just re‐call the filter by setting page=1:
    enroll(courseId)
      .then(() => {
        // 3a) Refresh the student’s profile (so profile.enrolled_courses is up to date)
        if (refreshProfile) {
          refreshProfile()
        }
        // 3b) Re-fetch the “not enrolled” list by resetting page to 1
        setPage(1)
      })
      .catch((err) => {
        console.error('Enroll failed:', err)
        window.alert('Enrollment failed. Please try again.')
      })
  }

  const handleViewCourse = (courseId) => {
    navigate(`/portal/student/courses/${courseId}`)
  }

  return (
    <AllCoursesUI
      courses={visibleCourses}
      page={page}
      totalPages={totalPages}
      setPage={setPage}
      loading={loading}
      error={error}
      // If you want to show “Enrolled” on cards, pass down profile.enrolled_courses
      enrolledCourseIds={profile?.enrolled_courses || []}
      onEnroll={handleEnroll}
      onViewCourse={handleViewCourse}
    />
  )
}
