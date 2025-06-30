import PropTypes from 'prop-types'
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function TeacherHomeUI({ courses, exams, loading, error }) {
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />{' '}
        <span>Loading…</span>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Welcome back!</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card bg="light">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Courses</Card.Title>
                <Card.Text>{courses.length} active</Card.Text>
              </div>
              <Button as={Link} to="/portal/teacher/courses/create" variant="primary">
                New course
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {exams.length > 0 && (
          <Col md={6}>
            <Card bg="light">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>Exams</Card.Title>
                  <Card.Text>{exams.length} planned</Card.Text>
                </div>
                <Button as={Link} to="/portal/teacher/exams/create" variant="primary">
                  New exam
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <h4>Last courses</h4>
          {courses.slice(0, 3).map((c) => (
            <Card className="mb-3" key={c.id}>
              <Card.Body>
                <Card.Title>{c.title}</Card.Title>
                <Button
                  as={Link}
                  to={`/portal/teacher/courses/${c.id}`}
                  variant="primary"
                  size="sm"
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {exams.length > 0 && (
          <Col md={6}>
            <h4>Last exams</h4>
            {exams.slice(0, 3).map((e) => (
              <Card className="mb-3" key={e.id}>
                <Card.Body>
                  <Card.Title>{e.title}</Card.Title>
                  <Card.Text>
                    Date: {new Date(e.due_date).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/portal/teacher/exams/${e.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Grade
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        )}
      </Row>
    </Container>
  )
}

TeacherHomeUI.propTypes = {
  courses: PropTypes.array.isRequired,
  exams:   PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error:   PropTypes.string,
}
