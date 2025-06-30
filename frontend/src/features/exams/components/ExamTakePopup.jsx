import PropTypes from 'prop-types'
import { Modal, ProgressBar, Row, Col, Button } from 'react-bootstrap'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ExamTakePopup({
  show,
  selected,
  timeRem,
  pct,
  disabled,
  timedOut,
  examAttempt,
  onClose,
  handleChoice,
  handleManualSubmit,
}) {
  if (!show || !examAttempt || !examAttempt.id) return null

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      fullscreen
      className="exam-modal m-0 p-0"
      dialogClassName="m-0"
      contentClassName="p-0"
    >
      <Modal.Body className="p-0 m-0">
        <div className="h-100 d-flex flex-column" style={{ backgroundColor: '#1e1e2f' }}>
          {/* Sticky Header */}
          <div className="sticky-top bg-dark p-2">
            <Row className="text-danger mb-1">
              <Col>
                <strong>Time:</strong>{' '}
                {timeRem != null ? formatTime(timeRem) : '–'}
              </Col>
              <Col className="text-end">
                <strong>Course:</strong> {examAttempt.exam.course_title}
              </Col>
            </Row>
            <ProgressBar now={pct} variant="danger" className="mb-1" />
          </div>

          {/* Questions */}
          <div className="flex-grow-1 overflow-auto py-2">
            {examAttempt.questions.map((q, idx) => (
              <div key={idx} className="mb-4 text-center px-3">
                <h5 className="text-danger mb-2">
                  Q{idx + 1}. {q.question}
                </h5>
                {q.choices.map((choice, j) => {
                  const isSelected = selected[idx] === j
                  return (
                    <button
                      key={j}
                      onClick={() => handleChoice(idx, j)}
                      disabled={disabled}
                      className={
                        isSelected
                          ? 'btn btn-danger mb-2'
                          : 'btn btn-outline-danger mb-2'
                      }
                      style={{ width: '75%' }}
                    >
                      {choice}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center p-2">
            {timedOut || disabled ? (
              <>
                <p className="text-danger mb-2">
                  Your time is over! The answers were saved and the exam will be reviewed soon.
                </p>
                <Button variant="secondary" onClick={onClose} style={{ width: '50%' }}>
                  Close
                </Button>
              </>
            ) : (
              <Button
                variant="danger"
                onClick={handleManualSubmit}
                style={{ width: '50%' }}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

ExamTakePopup.propTypes = {
  show:               PropTypes.bool.isRequired,
  selected:           PropTypes.object.isRequired,
  timeRem:            PropTypes.number,
  pct:                PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  disabled:           PropTypes.bool.isRequired,
  timedOut:           PropTypes.bool.isRequired,
  examAttempt:        PropTypes.object.isRequired,
  onClose:            PropTypes.func.isRequired,
  handleChoice:       PropTypes.func.isRequired,
  handleManualSubmit: PropTypes.func.isRequired,
}
