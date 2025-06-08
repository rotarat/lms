import { useParams, useNavigate } from 'react-router-dom'
import { useStudentExamDetail }   from '../hooks/useStudentExamDetail'
import StudentExamDetailUI        from '../components/StudentExamDetailUI'

export default function StudentExamDetailContainer() {
  const { studentExamId } = useParams()
  const navigate          = useNavigate()
  const { examAttempt, loading, error } = useStudentExamDetail(studentExamId)

  const handleClose = () => {
    navigate(-1)  // back to exams list
  }

  return (
    <StudentExamDetailUI
      show={true}
      loading={loading}
      error={error}
      examAttempt={examAttempt}
      onClose={handleClose}
    />
  )
}
