import PropTypes from 'prop-types'
import { Card, Button, Spinner, Alert } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'

export default function TeacherCourseExamsUI({
  studentExams,
  loading,
  error,
  onView,
}) {
  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading student exams…</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {typeof error === 'string' ? error : JSON.stringify(error)}
      </Alert>
    )
  }

  if (!Array.isArray(studentExams) || studentExams.length === 0) {
    return (
      <p className="text-center mt-4">
        No exam attempts found for this course.
      </p>
    )
  }

  return (
    <div className="container mt-4">
      <h3>Student Exams</h3>
      <Row xs={1} md={2} lg={3} className="g-4 mt-2">
        {studentExams.map((attempt) => {
          const studentName = `${attempt.student_user_first_name || ''
            } ${attempt.student_user_last_name || ''}`.trim()
          const courseTitle = attempt.course_title

          const submitted = !!attempt.submitted_at
          const gradeText =
            attempt.grade != null ? `Grade: ${attempt.grade.toFixed(2)}` : ''

          return (
            <Col key={attempt.id}>
              <Card>
                <Card.Body>
                  <Card.Subtitle className="mb-1 text-muted">
                    Course: {courseTitle}
                  </Card.Subtitle>
                  <Card.Subtitle className="text-muted mb-2">
                    {studentName}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Status:</strong>{' '}
                    {submitted ? (
                      <span className="text-success">Submitted</span>
                    ) : (
                      <span className="text-warning">Not yet submitted</span>
                    )}
                    <br />
                    {gradeText && (
                      <>
                        <strong>{gradeText}</strong>
                        <br />
                      </>
                    )}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => onView(attempt._examId, attempt.id)}
                  >
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

TeacherCourseExamsUI.propTypes = {
  studentExams: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  onView: PropTypes.func.isRequired, // (examId, attemptId) => void
}
