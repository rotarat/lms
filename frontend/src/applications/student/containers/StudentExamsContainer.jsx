import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudentExams } from '../hooks/useStudentExams'
import { useStartExam } from '../../../features/exams/hooks/useStartExam'
import { StudentExamsUI } from '../components/StudentExamsUI'
import { ExamStartModal } from '../../../features/exams/components/ExamStartModal'
import ExamTakePopupContainer from '../../../features/exams/containers/ExamTakePopupContainer'

export default function StudentExamsContainer() {
  const navigate = useNavigate()
  const { upcoming, finished, loading, error, refresh } = useStudentExams()
  const { start, loading: starting, error: startErr } = useStartExam()

  const [showStartModal, setShowStartModal] = useState(false)
  const [currentAttempt, setCurrentAttempt] = useState(null)
  const [showTakePopup, setShowTakePopup] = useState(false)

  // Kick off or resume an exam
  const handleStartClick = async (attempt) => {
    try {
      const se = await start(attempt.id)
      setCurrentAttempt(se)
      setShowStartModal(true)
      // after marking started, re-fetch both lists
      refresh()
    } catch {
      /* swallow */
    }
  }

  const confirmStart = () => {
    setShowStartModal(false)
    setShowTakePopup(true)
  }

  // Clicking a finished exam → go to detail
  const handleViewClick = (attempt) => {
    navigate(`/portal/student/exams/${attempt.id}`)
  }

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

      <ExamTakePopupContainer
        show={showTakePopup}
        examAttempt={currentAttempt}
        onClose={() => setShowTakePopup(false)}
      />
    </>
  )
}