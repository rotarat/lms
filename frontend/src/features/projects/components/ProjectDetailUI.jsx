import PropTypes from 'prop-types'
import { Button, Spinner } from 'react-bootstrap'

export default function ProjectDetailUI({ project, onClose }) {
  if (!project) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '50vh' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    )
  }

  const handleDownload = async () => {
    if (!project.file) {
      return window.alert('File not available for download.')
    }

    try {
      const response = await fetch(project.file)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const ext = project.file.split('.').pop()
      const filename = project.title ? `${project.title}.${ext}` : 'download'
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      window.alert('Unable to download file.')
    }
  }

  return (
    <div className="container p-4 position-relative">
      {/* Top Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="position-absolute"
        style={{
          top: '1rem',
          right: '1rem',
          border: 'none',
          background: 'transparent',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>

      {/* Title and Description */}
      <h3 className="text-center mt-3">
        {project.title || 'Untitled Project'}
      </h3>
      {project.description && (
        <p className="text-center">{project.description}</p>
      )}

      {/* Details */}
      <div className="my-5">
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
          {project.grade ?? 'Not graded yet'}
        </p>
        {project.reason && (
          <p>
            <strong>Teacher's Reason:</strong> {project.reason}
          </p>
        )}
      </div>

      {/* Download and Close Buttons */}
      <div className="d-flex justify-content-center">
        <Button variant="success" onClick={handleDownload}>
          Download File
        </Button>
      </div>
    </div>
  )
}

ProjectDetailUI.propTypes = {
  project: PropTypes.shape({
    id:               PropTypes.string.isRequired,
    title:            PropTypes.string,
    description:      PropTypes.string,
    student_username: PropTypes.string.isRequired,
    course_title:     PropTypes.string.isRequired,
    created_at:       PropTypes.string.isRequired,
    file:             PropTypes.string.isRequired,
    grade:            PropTypes.number,
    reason:           PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
