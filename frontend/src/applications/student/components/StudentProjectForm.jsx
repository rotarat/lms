import PropTypes from 'prop-types'
import { Form, Button, Spinner, Alert } from 'react-bootstrap'

export default function StudentProjectForm({
  courses,
  selectedCourse,
  onCourseChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  file,
  onFileChange,
  loadingCourses,
  errorCourses,
  submitting,
  submitError,
  onSubmit,
}) {
  return (
    <div className="container mt-4">
      <h3>Submit a New Project</h3>

      {errorCourses && (
        <Alert variant="danger">
          Error loading courses: {JSON.stringify(errorCourses)}
        </Alert>
      )}

      <Form onSubmit={onSubmit}>
        {/* Course dropdown */}
        <Form.Group className="mb-3" controlId="courseSelect">
          <Form.Label>Select Course</Form.Label>
          {loadingCourses ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading courses…</span>
              </Spinner>
            </div>
          ) : (
            <Form.Select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Select a course --
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {/* Optional title */}
        <Form.Group className="mb-3" controlId="titleInput">
          <Form.Label>Project Title (optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={submitting}
          />
        </Form.Group>

        {/* Optional description */}
        <Form.Group className="mb-3" controlId="descriptionInput">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Brief description…"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={submitting}
          />
        </Form.Group>

        {/* File upload */}
        <Form.Group className="mb-3" controlId="fileInput">
          <Form.Label>Project File (PDF, ZIP, etc.)</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.zip,.doc,.docx"
            onChange={(e) => onFileChange(e.target.files[0])}
            disabled={submitting}
            required
          />
        </Form.Group>

        {submitError && <Alert variant="danger">{JSON.stringify(submitError)}</Alert>}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" href="/portal/student/projects">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Uploading…
              </>
            ) : (
              'Submit Project'
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

StudentProjectForm.propTypes = {
  courses:             PropTypes.array.isRequired,
  selectedCourse:      PropTypes.string.isRequired,
  onCourseChange:      PropTypes.func.isRequired,
  title:               PropTypes.string.isRequired,
  onTitleChange:       PropTypes.func.isRequired,
  description:         PropTypes.string.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  file:                PropTypes.any,
  onFileChange:        PropTypes.func.isRequired,
  loadingCourses:      PropTypes.bool.isRequired,
  errorCourses:        PropTypes.any,
  submitting:          PropTypes.bool.isRequired,
  submitError:         PropTypes.any,
  onSubmit:            PropTypes.func.isRequired,
}
