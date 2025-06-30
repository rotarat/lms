import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Spinner,
  Alert,
  Card,
  Button,
  Form,
} from 'react-bootstrap'

export default function TeacherExamDetailUI({
  studentExam,
  loading,
  error,
  saveGrade,
  saving,
}) {
  const [gradeInput, setGradeInput] = useState('')
  const [feedbackInput, setFeedbackInput] = useState('')
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [localError, setLocalError] = useState(null)

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
        <span className="ms-2">Loading exam…</span>
      </Container>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {typeof error === 'string' ? error : JSON.stringify(error)}
      </Alert>
    )
  }

  if (!studentExam) {
    return <p className="text-center mt-4">Exam not found.</p>
  }

  const {
    questions = [],
    answers = {},
    grade,
    personal_feedback,
    exam: { description: examDesc } = {},
    student: { user: { first_name, last_name } = {} } = {},
  } = studentExam
  const studentName = `${first_name || ''} ${last_name || ''}`.trim()

  const handleGradeSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    const parsed = parseFloat(gradeInput)
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      setLocalError('Please enter a valid numeric grade between 0 and 100.')
      return
    }
    try {
      await saveGrade({ grade: parsed, personal_feedback: feedbackInput })
      setShowGradeForm(false)
      setLocalError(null)
    } catch (err) {
      setLocalError(
        'Failed to save grade. ' +
          (typeof err === 'string' ? err : JSON.stringify(err))
      )
    }
  }

  return (
    <Container className="mt-4">
      {/* Injected CSS to override Quartz theme */}
      <style>{`
        /* remove white background & border from ListGroup.Items */
        .override-answers .list-group-item {
          background-color: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* Header + description */}
      <h3>Student Exam: {studentName}</h3>
      <p className="text-muted mb-4">{examDesc}</p>

      {grade != null && (
        <Alert variant="success">
          <strong>Grade: {grade.toFixed(2)}</strong>
        </Alert>
      )}
      {grade == null && (
        <Alert variant="warning">Student has not yet been graded.</Alert>
      )}
      {localError && <Alert variant="danger">{localError}</Alert>}

      {/* Grade form */}
      {grade == null && !showGradeForm && (
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowGradeForm(true)}
        >
          Grade
        </Button>
      )}
      {grade == null && showGradeForm && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleGradeSubmit}>
              <Form.Group className="mb-3" controlId="gradeInput">
                <Form.Label>Enter Grade (0-100)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="feedbackInput">
                <Form.Label>Feedback (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter comments..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Grade'}
              </Button>{' '}
              <Button
                variant="secondary"
                onClick={() => {
                  setShowGradeForm(false)
                  setLocalError(null)
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Questions & Answers */}
      <div className="override-answers">
        {questions.map((q, idx) => {
          const correctIdx = q.correct_index
          const studentAnsIdx = answers.hasOwnProperty(idx.toString())
            ? Number(answers[idx.toString()])
            : null

          return (
            <Card key={idx} className="mb-4">
              <Card.Body>
                <Card.Title>
                  Q{idx + 1}. {q.question}
                </Card.Title>
                <ul className="list-unstyled mb-0">
                  {q.choices.map((choiceText, cIdx) => {
                    const isCorrect = cIdx === correctIdx
                    const isStudentChoice = cIdx === studentAnsIdx
                    let liClass = ''
                    if (isCorrect) liClass = 'fw-bold text-success'
                    else if (isStudentChoice && !isCorrect)
                      liClass = 'text-danger'

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
      </div>

      {/* Teacher feedback */}
      {grade != null && personal_feedback && (
        <Card className="mt-4">
          <Card.Body>
            <h5>Teacher's Feedback:</h5>
            <p>{personal_feedback}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

TeacherExamDetailUI.propTypes = {
  studentExam: PropTypes.shape({
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        choices: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct_index: PropTypes.number.isRequired,
      })
    ),
    answers: PropTypes.object,
    grade: PropTypes.number,
    personal_feedback: PropTypes.string,
    exam: PropTypes.shape({
      description: PropTypes.string.isRequired,
    }),
    student: PropTypes.shape({
      user: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
      }),
    }),
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  saveGrade: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
}
