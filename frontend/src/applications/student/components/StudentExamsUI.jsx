import PropTypes from 'prop-types'
import { Spinner, Alert } from 'react-bootstrap'
import { ExamCard } from '../../../features/exams/components/ExamCard'

export function StudentExamsUI({
  upcoming,
  finished,
  loading,
  error,
  onStartClick,
  onViewClick,
}) {
  if (loading) {
    return <div className="text-center my-4"><Spinner animation="border" /></div>
  }
  if (error) {
    return <Alert variant="danger" className="mt-4">{JSON.stringify(error)}</Alert>
  }

  return (
    <div className="container mt-4">
      <h4>Upcoming Exams</h4>
      {upcoming.length === 0 ? (
        <p>No upcoming exams.</p>
      ) : (
        upcoming.map((attempt) => (
          <ExamCard
            key={attempt.id}
            examAttempt={attempt}
            isFinished={false}
            onClick={() => onStartClick(attempt)}
          />
        ))
      )}

      <h4 className="mt-5">Finished Exams</h4>
      {finished.length === 0 ? (
        <p>No finished exams yet.</p>
      ) : (
        finished.map((attempt) => (
          <ExamCard
            key={attempt.id}
            examAttempt={attempt}
            isFinished={true}
            onClick={() => onViewClick(attempt)}
          />
        ))
      )}
    </div>
  )
}

StudentExamsUI.propTypes = {
  upcoming:  PropTypes.array.isRequired,
  finished:  PropTypes.array.isRequired,
  loading:   PropTypes.bool.isRequired,
  error:     PropTypes.any,
  onStartClick: PropTypes.func.isRequired,
  onViewClick:  PropTypes.func.isRequired,
}
