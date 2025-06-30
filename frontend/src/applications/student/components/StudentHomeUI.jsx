import PropTypes from 'prop-types'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Image
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function StudentHomeUI({ user, courses, loading, error }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  if (error) {
    return <Alert variant="danger">Failed to load dashboard.</Alert>
  }

  return (
    <Container className="my-4">
      {/* Welcome Header */}
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <Image
            src={user?.profile_pic}
            roundedCircle
            width={80}
            height={80}
            alt="Your avatar"
          />
        </Col>
        <Col>
          <h2 className="mb-0">Welcome, {user?.first_name || user?.username}!</h2>
          <small className="text-muted">Role: {user?.role}</small>
        </Col>
      </Row>

      {/* Enrolled Courses */}
      <h4>Your Courses</h4>
      {courses.length === 0 ? (
        <p className="text-muted">You're not enrolled in any courses yet.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {courses.map(course => (
            <Col key={course.id}>
              <Card className="h-100 shadow-sm">
                {course.featured_image_url && (
                  <Card.Img
                    variant="top"
                    src={course.featured_image_url}
                    style={{ objectFit: 'cover', height: '150px' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{course.title}</Card.Title>
                  <Link to={`/portal/student/courses/${course.id}`}>
                    <Button variant="primary" size="sm" className="mt-2">
                      Go to course
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

StudentHomeUI.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    username: PropTypes.string.isRequired,
    profile_pic: PropTypes.string,
    role: PropTypes.string
  }),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      featured_image_url: PropTypes.string
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any
}