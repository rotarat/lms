import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import { ProgressBar, Row, Col } from 'react-bootstrap'

/**
 * Full-screen exam UI:
 * - Header (timer + course) is sticky
 * - Answer buttons reflect current choice (solid red) but remain clickable
 * - Submit button is solid red
 */
export function ExamTakePopup({
  show,
  onClose,
  examAttempt,
  onSubmitAnswers,
}) {
  // Hook declarations (always top‐level)
  const [selected, setSelected] = useState({})
  const [timeRem, setTimeRem]   = useState(0)
  const timer = useRef(null)

  // Initialize state when popup opens
  useEffect(() => {
    if (!show || !examAttempt) return

    setSelected(examAttempt.answers || {});
    setTimeRem(examAttempt.exam.duration * 60)

    timer.current = setInterval(() => {
      setTimeRem((t) => (t > 0 ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(timer.current)
  }, [show, examAttempt])

  // Don’t render until ready
  if (!show || !examAttempt) return null

  const { exam, questions } = examAttempt
  const disabled = timeRem === 0

  const handleChoice = (idx, choice) => {
    if (disabled) return
    setSelected((s) => ({ ...s, [idx]: choice }))
  }

  const handleSubmit = () => {
    clearInterval(timer.current)
    onSubmitAnswers(examAttempt.id, selected)
  }

  const pct = ((timeRem / (exam.duration * 60)) * 100).toFixed(2)

  return (
    <PopupWindow
      show={show}
      onClose={() => {
        clearInterval(timer.current)
        onClose()
      }}
      fullScreen
      style={{ backgroundColor: '#1e1e2f' }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#1e1e2f',
          zIndex: 1000,
          paddingBottom: '0.5rem 1rem',
        }}
      >
        <Row className="mb-2 text-danger">
          <Col>
            <strong>Time:</strong>{' '}
            {Math.floor(timeRem / 60)}:
            {String(timeRem % 60).padStart(2, '0')}
          </Col>
          <Col className="text-end">
            <strong>Course:</strong> {exam.course_title}
          </Col>
        </Row>
        <ProgressBar now={pct} variant="danger" className="mb-3" />
      </div>

      {/* Questions */}
      {questions.map((q, i) => {
        const current = selected[i]
        return (
          <div key={i} className="mb-5 text-center px-3">
            <h5 className="text-danger mb-3">
              Q{i + 1}. {q.question}
            </h5>
            {q.choices.map((c, j) => (
              <button
                key={j}
                className={
                  current === c
                    ? 'btn btn-danger mb-3'
                    : 'btn btn-outline-danger mb-3'
                }
                style={{ width: '70%' }}
                disabled={disabled}
                onClick={() => handleChoice(i, c)}
              >
                {c}
              </button>
            ))}
          </div>
        )
      })}

      {/* Submit */}
      <div className="text-center mb-4">
        <button
          className="btn btn-danger"
          style={{ width: '40%' }}
          onClick={handleSubmit}
          disabled={disabled}
        >
          Submit
        </button>
      </div>
    </PopupWindow>
  )
}

ExamTakePopup.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  examAttempt: PropTypes.shape({
    id: PropTypes.string.isRequired,
    exam: PropTypes.shape({
      course_title: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    }).isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        choices: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    answers: PropTypes.object,
  }).isRequired,
  onSubmitAnswers: PropTypes.func.isRequired,
}
