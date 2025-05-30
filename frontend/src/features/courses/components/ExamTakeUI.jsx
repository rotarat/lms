import PropTypes from 'prop-types'
import { Form, Button, Spinner } from 'react-bootstrap'
import { PopupWindow } from '../../../shared/components/PopupWindow'

export function ExamTakeUI({
  show,
  session,
  starting,
  startError,
  grade,
  submitting,
  submitError,
  timeLeft,
  answers,
  onAnswer,
  onSubmit,
  onClose
}) {
  if (!show) return null

  // If still starting, show spinner
  if (starting) {
    return (
      <PopupWindow show>
        <div className="d-flex justify-content-center align-items-center p-5">
          <Spinner animation="border" />
        </div>
      </PopupWindow>
    )
  }

  if (startError) {
    return (
      <PopupWindow show>
        <div className="p-3 text-danger">Error: {String(startError)}</div>
      </PopupWindow>
    )
  }

  const { test } = session
  const minutes = Math.floor(timeLeft/60)
  const seconds = String(timeLeft%60).padStart(2,'0')
  const disabled = timeLeft === 0 || submitting || Boolean(grade)

  return (
    <PopupWindow show>
      <PopupWindow.Header closeButton={false}>
        <h5>
          Time Left: {minutes}:{seconds}
        </h5>
      </PopupWindow.Header>

      <PopupWindow.Body className="p-3 overflow-auto" style={{ maxHeight: '60vh' }}>
        <Form>
          {test.questions.map((q, i) => (
            <fieldset key={i} disabled={disabled} className="mb-4">
              <h3 className="h6">{q.question}</h3>
              {q.incorrect_answers.concat(q.correct_answer)
                .sort()
                .map(opt => (
                  <Form.Check
                    key={opt}
                    type="radio"
                    name={`q${i}`}
                    id={`q${i}-${opt}`}
                    label={opt}
                    checked={answers[i] === opt}
                    onChange={() => onAnswer(i, opt)}
                    className="mb-2"
                  />
                ))}
            </fieldset>
          ))}
        </Form>
        {submitError && <div className="text-danger">Error: {String(submitError)}</div>}
        {grade != null && (
          <div className="text-center my-3">
            <h4>Your grade: {grade.toFixed(1)}%</h4>
            <Button variant="primary" onClick={onClose}>Close</Button>
          </div>
        )}
      </PopupWindow.Body>

      <PopupWindow.Footer>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={
            submitting ||
            // either time is up or they haven't answered all questions
            (timeLeft > 0
              ? Object.keys(answers).length !== test.questions.length
              : true
            )
          }
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </PopupWindow.Footer>
    </PopupWindow>
  )
}

ExamTakeUI.propTypes = {
  show:         PropTypes.bool.isRequired,
  session:      PropTypes.object,
  starting:     PropTypes.bool,
  startError:   PropTypes.any,
  grade:        PropTypes.number,
  submitting:   PropTypes.bool,
  submitError:  PropTypes.any,
  timeLeft:     PropTypes.number.isRequired,
  answers:      PropTypes.object.isRequired,
  onAnswer:     PropTypes.func.isRequired,
  onSubmit:     PropTypes.func.isRequired,
  onClose:      PropTypes.func.isRequired,
}
