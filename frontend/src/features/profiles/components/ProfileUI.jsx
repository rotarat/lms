import PropTypes from 'prop-types'
import { Spinner, Alert, Card, Image, Row, Col, Badge} from 'react-bootstrap'

export default function ProfileUI({ profile, loading, error }) {
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  )
  if (error) return <Alert variant="danger">Error loading profile.</Alert>
  if (!profile) return <Alert variant="warning">Profile not found.</Alert>

  const { username, first_name, last_name, bio, profile_pic, role} = profile

  return (
    <Card className="my-4 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <Row className="align-items-center">
          <Col xs="auto">
            <Image src={profile_pic} roundedCircle width={80} height={80} />
          </Col>
          <Col>
            <h4 className="mb-0">{first_name} {last_name}</h4>
            <small>@{username} <Badge bg="light" text="dark">{role}</Badge></small>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Text>{bio || <em>No bio provided.</em>}</Card.Text>   
      </Card.Body>
    </Card>
  )
}

ProfileUI.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    bio: PropTypes.string,
    profile_pic: PropTypes.string,
    role: PropTypes.string,
    enrolled_courses: PropTypes.arrayOf(PropTypes.string),
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
}