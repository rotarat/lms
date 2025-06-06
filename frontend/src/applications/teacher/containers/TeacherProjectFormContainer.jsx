import TeacherProjectForm from '../components/TeacherProjectForm'
import { useTeacherProjectForm } from '../hooks/useTeacherProjectForm'

export default function TeacherProjectFormContainer({ projectId, onClose }) {
  const { grade, setGrade, reason, setReason, loading, error, handleSubmit } =
    useTeacherProjectForm(projectId)

  // When the form is submitted, wait for handleSubmit() to finish before closing
  const onSubmit = async (e) => {
    try {
      await handleSubmit(e)
      onClose()
    } catch {
      // If there was an error, do not close the popup; `error` is already set
    }
  }

  return (
    <TeacherProjectForm
      grade={grade}
      onGradeChange={setGrade}
      reason={reason}
      onReasonChange={setReason}
      loading={loading}
      error={error}
      onSubmit={onSubmit}
      onCancel={onClose}
    />
  )
}
