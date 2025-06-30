import { TeacherHomeUI } from '../components/TeacherHomeUI'
import { useTeacherHome } from '../hooks/useTeacherHome'

export function TeacherHomeContainer() {
  const { courses, exams, loading, error } = useTeacherHome()

  return (
    <TeacherHomeUI
      courses={courses}
      exams={exams}
      loading={loading}
      error={error}
    />
  )
}
