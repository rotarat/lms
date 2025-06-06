import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCreateExam } from '../../../features/exams/hooks/useCreateExam'
import { ExamFormUI } from '../../../features/exams/components/ExamFormUI'

export default function TeacherExamFormContainer() {
  const { courseId } = useParams()
  const { create, loading, error } = useCreateExam()
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (data) => {
    try {
      await create(data)
      setSuccessMessage(
        'Exam saved. Working on creating personalized exam. You can continue using the portal.'
      )
    } catch {
      setSuccessMessage('')
      // error is already set in hook
    }
  }

  return (
    <ExamFormUI
      courseId={courseId}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      successMessage={successMessage}
    />
  )
}
