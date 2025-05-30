import { Card, Button } from 'react-bootstrap'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

export function ExamCard({ exam, onStart }) {
  const days = dayjs(exam.due_date).diff(dayjs(), 'day')
  const danger = days <= 3

  return (
    <Card bg={danger ? 'danger' : 'light'} text={danger ? 'white' : 'dark'} className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{exam.course.title}</Card.Title>
        <Card.Text>
          Due in {days} day{days !== 1 ? 's' : ''} • {exam.duration} min
        </Card.Text>
        <Button
          variant={danger ? 'light' : 'primary'}
          className="mt-auto"
          onClick={() => onStart(exam.id)}
        >
          Start
        </Button>
      </Card.Body>
    </Card>
  )
}

ExamCard.propTypes = {
  exam: PropTypes.shape({
    id:        PropTypes.number.isRequired,
    due_date:  PropTypes.string.isRequired,
    duration:  PropTypes.number.isRequired,
    course:    PropTypes.shape({ title: PropTypes.string }).isRequired
  }).isRequired,
  onStart: PropTypes.func.isRequired
}
