import { useParams } from 'react-router-dom'
import { useStudentExamDetail } from '../../../features/exams/hooks/useStudentExamDetail'
import TeacherExamDetailUI from '../components/TeacherExamDetailUI'

export default function StudentExamDetailContainer() {
  const { studentExamId } = useParams()
  const { studentExam, loading, error, saveGrade, saving } =
    useStudentExamDetail(studentExamId)

  return (
    <TeacherExamDetailUI
      studentExam={studentExam}
      loading={loading}
      error={error}
      saveGrade={saveGrade}
      saving={saving}
    />
  )
}
