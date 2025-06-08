import { useState } from 'react'
import { useNavigate }            from 'react-router-dom'
import { useStudentExams }        from '../hooks/useStudentExams'
import { useStartExam }           from '../../../features/exams/hooks/useStartExam'
import { useExamDetail }          from '../../../features/exams/hooks/useExamDetail'
import {StudentExamsUI}             from '../components/StudentExamsUI'
import {ExamStartModal}             from '../../../features/exams/components/ExamStartModal'
import {ExamTakePopup}              from '../../../features/exams/components/ExamTakePopup'

export default function StudentExamsContainer() {
  const navigate = useNavigate()

  const { upcoming, finished, loading, error } = useStudentExams()
  const { start, loading: starting, error: startErr } = useStartExam()
  const { submit } = useExamDetail()

  const [showStartModal, setShowStartModal] = useState(false)
  const [currentAttempt, setCurrentAttempt] = useState(null)
  const [showTakePopup, setShowTakePopup]   = useState(false)

  // When the student clicks “Start” on an upcoming exam
  const handleStartClick = async (attempt) => {
    try {
      const fetched = await start(attempt.id)
      setCurrentAttempt(fetched)
      setShowStartModal(true)
    } catch {}
  }

  const confirmStart = () => {
    setShowStartModal(false)
    setShowTakePopup(true)
  }

  // When the student clicks any card
  const handleViewClick = async (attempt) => {
    if (attempt.submitted_at) {
      // Finished → go to detail page
      navigate(`/portal/student/exams/${attempt.id}`)
    } else {
      // Upcoming → run the start flow
      handleStartClick(attempt)
    }
  }

  const handleSubmitAnswers = (id, answers) =>
    submit(id, answers).then(() => setShowTakePopup(false))

  return (
    <>
      <StudentExamsUI
        upcoming={upcoming}
        finished={finished}
        loading={loading || starting}
        error={error || startErr}
        onStartClick={handleStartClick}
        onViewClick={handleViewClick}
      />

      <ExamStartModal
        show={showStartModal}
        onHide={() => setShowStartModal(false)}
        examAttempt={currentAttempt}
        onConfirm={confirmStart}
      />

      <ExamTakePopup
        show={showTakePopup}
        onClose={() => setShowTakePopup(false)}
        examAttempt={currentAttempt}
        onSubmitAnswers={handleSubmitAnswers}
      />
    </>
  )
}
