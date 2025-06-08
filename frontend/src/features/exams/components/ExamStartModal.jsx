import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

/**
 * examAttempt.exam is the nested exam object
 */
export function ExamStartModal({ show, onHide, examAttempt, onConfirm }) {
  if (!examAttempt) return null
  const { course_title, description, num_questions, duration } = examAttempt.exam

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Start Exam: {course_title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Questions:</strong> {num_questions}</p>
        <p><strong>Duration:</strong> {duration} min</p>
        <p>Are you sure you want to start the exam?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm}>Start</Button>
      </Modal.Footer>
    </Modal>
  )
}

ExamStartModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  examAttempt: PropTypes.object, // StudentExam
  onConfirm: PropTypes.func.isRequired,
}
