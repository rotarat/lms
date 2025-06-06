// src/features/projects/components/ProjectCard.jsx
import PropTypes from 'prop-types'
import { Card, Button } from 'react-bootstrap'

export default function ProjectCard({ project, onView, onAddGrade }) {
  // project.student_username (e.g. "alex123") is provided by serializer
  // serializer also needs to provide `student_first_name` & `student_last_name`
  // but we’ll assume `student_username` is good; you can adapt to "first+last"
  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate">
          {project.title || 'Untitled Project'}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Student: {project.student_username}
        </Card.Subtitle>

        <div className="mt-auto">
          <Button
            variant="info"
            size="sm"
            className="me-2"
            onClick={onView}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onAddGrade}
          >
            Add Grade
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

ProjectCard.propTypes = {
  project:    PropTypes.shape({
    id:                PropTypes.string.isRequired,
    title:             PropTypes.string,
    student_username:  PropTypes.string.isRequired,
  }).isRequired,
  onView:     PropTypes.func.isRequired,
  onAddGrade: PropTypes.func.isRequired,
}
