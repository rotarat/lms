import { useParams, useNavigate } from 'react-router-dom'
import { useCourseStudentExams } from '../../../features/exams/hooks/useCourseStudentExams'
import TeacherCourseExamsUI from '../components/TeacherCourseExamsUI'

export default function TeacherCourseExamsContainer() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const {
    studentExams,
    loading,
    error,
  } = useCourseStudentExams(courseId)

  const handleView = (examId, attemptId) => {
    navigate(
      `/portal/teacher/courses/${courseId}/exams/${attemptId}`
    )
  }

  return (
    <TeacherCourseExamsUI
      studentExams={studentExams}
      loading={loading}
      error={error}
      onView={handleView}
    />
  )
}
