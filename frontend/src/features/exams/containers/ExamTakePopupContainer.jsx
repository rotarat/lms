import { useState, useEffect } from 'react'
import { ExamTakePopup } from '../components/ExamTakePopup'
import { useExamTake } from '../hooks/useTakeExam'
import { submitExam } from '../../../shared/api/resourses'

export default function ExamTakePopupContainer({ show, examAttempt, onClose }) {
  const {
    selected,
    timeRem,
    pct,
    disabled,
    handleChoice,
    clearTimer
  } = useExamTake(show, examAttempt)

  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (show && disabled && !timedOut && examAttempt?.id) {
      clearTimer()
      const submittedAt = new Date().toISOString()
      submitExam(examAttempt.id, { answers: selected, submittedAt })
      setTimedOut(true)
    }
  }, [show, disabled, timedOut, examAttempt, selected, clearTimer])

  const handleManualSubmit = async () => {
    clearTimer()
    if (!examAttempt?.id) return
    const submittedAt = new Date().toISOString()
    await submitExam(examAttempt.id, { answers: selected, submittedAt })
    window.location.reload()
    onClose()
  }

  const handleClose = () => {
    clearTimer()
    setTimedOut(false)
    window.location.reload()
    onClose()
  }

  return (
    <ExamTakePopup
      show={show}
      selected={selected}
      timeRem={timeRem}
      pct={pct}
      disabled={disabled}
      timedOut={timedOut}
      examAttempt={examAttempt}
      onClose={handleClose}
      handleChoice={handleChoice}
      handleManualSubmit={handleManualSubmit}
    />
  )
}
