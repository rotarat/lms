import PropTypes from 'prop-types'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import { Spinner, Alert, Card, ListGroup, Button } from 'react-bootstrap'

/**
 * show: whether to display
 * loading / error
 * examAttempt: {
 *   exam: { course_title },
 *   submitted_at, grade, personal_feedback,
 *   questions: [ { question, choices:Array, correct_index:Number } ],
 *   answers: { [questionIndex]: choiceString }
 * }
 */
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
      <div style={{ position: 'relative' }}>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClose}
          style={{ position: 'absolute', top: 8, right: 8 }}
        >
          ×
        </Button>
      </div>

      {loading && <div className="text-center my-4"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}

      {!loading && !error && examAttempt && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{examAttempt.exam.course_title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Submitted:{' '}
                {new Date(examAttempt.submitted_at).toLocaleString()}
              </Card.Subtitle>
              <div>
                <strong>Grade:</strong>{' '}
                {examAttempt.grade != null
                  ? examAttempt.grade.toFixed(2)
                  : 'Waiting for review'}
              </div>
              {examAttempt.personal_feedback && (
                <div className="mt-2">
                  <strong>Feedback:</strong> {examAttempt.personal_feedback}
                </div>
              )}
            </Card.Body>
          </Card>

          {examAttempt.questions.map((q, i) => {
            const studentAns = examAttempt.answers?.[i]
            const correctIdx = q.correct_index
            return (
              <Card key={i} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Q{i + 1}. {q.question}
                  </Card.Title>
                  <ListGroup variant="flush">
                    {q.choices.map((choice, idx) => {
                      const isCorrect = idx === correctIdx
                      const isStudent = choice === studentAns
                      let classes = 'px-2 py-1 '

                      if (isCorrect) classes += 'text-success'
                      else if (isStudent) classes += 'text-danger'
                      else classes += 'text-secondary'

                      return (
                        <ListGroup.Item
                          key={idx}
                          className={classes + ' bg-transparent border-0'}
                        >
                          {String.fromCharCode(65 + idx)}. {choice}
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            )
          })}
        </>
      )}
    </PopupWindow>
  )
}

StudentExamDetailUI.propTypes = {
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  examAttempt: PropTypes.shape({
    submitted_at: PropTypes.string.isRequired,
    grade: PropTypes.number,
    personal_feedback: PropTypes.string,
    exam: PropTypes.shape({
      course_title: PropTypes.string.isRequired,
    }).isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        choices: PropTypes.array.isRequired,
        correct_index: PropTypes.number.isRequired,
      })
    ).isRequired,
    answers: PropTypes.object,
  }),
  onClose: PropTypes.func.isRequired,
}
