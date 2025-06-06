import PropTypes from 'prop-types'
import { Button, Spinner } from 'react-bootstrap'

export default function ProjectDetailUI({ project, onClose }) {
  // If `project` is not yet available, render a spinner
  if (!project) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    )
  }
  return (
    <div className="container position-relative" style={{ padding: '10px' }}>
      {/* Top‐right “×” close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          lineHeight: 1,
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        &times;
      </button>

      <h4 className="mt-2">{project.title || 'Untitled Project'}</h4>
      {project.description && <p>{project.description}</p>}

      <p>
        <strong>Student:</strong> {project.student_username}
      </p>
      <p>
        <strong>Course:</strong> {project.course_title}
      </p>
      <p>
        <strong>Uploaded At:</strong>{' '}
        {new Date(project.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Grade:</strong>{' '}
        {project.grade != null ? project.grade : 'Not graded yet'}
      </p>
      {project.reason && (
        <p>
          <strong>Teacher's Reason:</strong> {project.reason}
        </p>
      )}

      {/* Download button */}
      <a
        href={project.file}
        className="btn btn-success mt-3"
        download
      >
        Download File
      </a>

      {/* Bottom “Close” */}
      <div className="d-flex justify-content-center mt-4 mb-3">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

ProjectDetailUI.propTypes = {
  project: PropTypes.shape({
    id:                PropTypes.string.isRequired,
    title:             PropTypes.string,
    description:       PropTypes.string,
    student_username:  PropTypes.string.isRequired,
    course_title:      PropTypes.string.isRequired,
    created_at:        PropTypes.string.isRequired,
    file:              PropTypes.string.isRequired,
    grade:             PropTypes.number,
    reason:            PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
