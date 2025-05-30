import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useStartExam }  from '../hooks/useStartExam'
import { useSubmitExam } from '../hooks/useSubmitExam'
import { ExamTakeUI }    from '../components/ExamTakeUI'

export function ExamTakeContainer({ show, examId, onClose }) {
  const { session, start, loading: starting, error: startError } = useStartExam()
  const { grade, submit, loading: submitting, error: submitError } = useSubmitExam()

  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)

  // kick off when modal opens
  useEffect(() => {
    if (show && examId) start(examId)
  }, [show, examId, start])

  // timer
  useEffect(() => {
    if (!session) return
    setTimeLeft(session.duration * 60)
    const tid = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(tid)
  }, [session])

  const handleAnswer = (idx, val) => {
    if (timeLeft > 0) {
      setAnswers(a => ({ ...a, [idx]: val }))
    }
  }

  const handleSubmit = async () => {
    await submit({ attemptId: session.attemptId, answers })
    onClose(grade)   // pass grade back if you want
  }

  return (
    <ExamTakeUI
      show={show}
      session={session}
      starting={starting}
      startError={startError}
      grade={grade}
      submitting={submitting}
      submitError={submitError}
      timeLeft={timeLeft}
      answers={answers}
      onAnswer={handleAnswer}
      onSubmit={handleSubmit}
      onClose={() => onClose(grade)}
    />
  )
}

ExamTakeContainer.propTypes = {
  show:   PropTypes.bool.isRequired,
  examId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
}
