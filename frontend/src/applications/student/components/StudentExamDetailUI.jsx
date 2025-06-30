import PropTypes from 'prop-types'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import { Spinner, Alert, Card, Button } from 'react-bootstrap'

export default function StudentExamDetailUI({
  show,
  loading,
  error,
  examAttempt,
  onClose,
}) {
  if (!show) return null

  return (
    <PopupWindow show={show} onClose={onClose}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          {examAttempt?.exam?.course_title || 'Exam Detail'}
        </h5>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}
      {error && (
        <Alert variant="danger" className="my-3">
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      {/* Main content */}
      {!loading && !error && examAttempt && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <div className="mb-2">
                <strong>Grade:</strong>{' '}
                {examAttempt.grade != null
                  ? examAttempt.grade.toFixed(2)
                  : 'Waiting for review'}
              </div>

              {examAttempt.personal_feedback && (
                <div>
                  <strong>Feedback:</strong> {examAttempt.personal_feedback}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Questions & Answers */}
          {examAttempt.questions.map((q, idx) => {
            const studentAns = examAttempt.answers?.[idx]
            const correctIdx = q.correct_index
            return (
              <Card className="mb-4" key={idx}>
                <Card.Body>
                  <Card.Title>
                    Q{idx + 1}. {q.question}
                  </Card.Title>
                  <ul className="list-unstyled ps-3 mb-0">
                    {q.choices.map((choiceText, cIdx) => {
                      const isCorrect = cIdx === correctIdx
                      const isStudent = String(cIdx) === String(studentAns)
                      let liClass = ''
                      if (isCorrect) liClass = 'fw-bold text-success'
                      else if (isStudent) liClass = 'text-danger'

                      return (
                        <li key={cIdx} className={liClass}>
                          {String.fromCharCode(65 + cIdx)}. {choiceText}
                        </li>
                      )
                    })}
                  </ul>
                </Card.Body>
              </Card>
            )
          })}

          {/* Close button */}
          <div className="text-center mb-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </PopupWindow>
  )
}

StudentExamDetailUI.propTypes = {
  show:        PropTypes.bool.isRequired,
  loading:     PropTypes.bool.isRequired,
  error:       PropTypes.any,
  examAttempt: PropTypes.shape({
    exam: PropTypes.shape({
      course_title: PropTypes.string,
    }),
    started_at:       PropTypes.string,
    grade:            PropTypes.number,
    personal_feedback:PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question:      PropTypes.string.isRequired,
        choices:       PropTypes.arrayOf(PropTypes.string).isRequired,
        correct_index: PropTypes.number.isRequired,
      })
    ).isRequired,
    answers: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  }),
  onClose:     PropTypes.func.isRequired,
}
