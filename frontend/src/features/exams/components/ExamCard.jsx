import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

/**
 * examAttempt: the full StudentExam object
 * isFinished: boolean
 * onClick: () => void
 */
export function ExamCard({ examAttempt, isFinished, onClick }) {
  const { exam, submitted_at, grade } = examAttempt

  return (
    <Card onClick={onClick} className="mb-3 clickable-card">
      <Card.Body>
        <Card.Title>{exam.course_title}</Card.Title>

        {isFinished ? (
          <>
            <div>
              <strong>Submitted:</strong>{' '}
              {new Date(submitted_at).toLocaleString()}
            </div>
            <div>
              <strong>Grade:</strong>{' '}
              {grade != null ? grade.toFixed(2) : 'Waiting for review'}
            </div>
          </>
        ) : (
          <>
            <div>
              <strong>Questions:</strong> {exam.num_questions}
            </div>
            <div>
              <strong>Duration:</strong> {exam.duration} min
            </div>
            <div>
              <strong>Due:</strong>{' '}
              {new Date(exam.due_date).toLocaleDateString()}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  )
}

ExamCard.propTypes = {
  examAttempt: PropTypes.shape({
    id: PropTypes.string.isRequired,
    exam: PropTypes.shape({
      course_title: PropTypes.string.isRequired,
      description: PropTypes.string,
      num_questions: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      due_date: PropTypes.string.isRequired,
    }).isRequired,
    submitted_at: PropTypes.string,
    grade: PropTypes.number,
  }).isRequired,
  isFinished: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}
