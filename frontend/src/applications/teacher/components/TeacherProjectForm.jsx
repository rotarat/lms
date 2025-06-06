// src/features/projects/components/ProjectForm.jsx
import PropTypes from 'prop-types'
import { Form, Button, Spinner, Alert } from 'react-bootstrap'

export default function TeacherProjectForm({
  grade,
  onGradeChange,
  reason,
  onReasonChange,
  loading,
  error,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="container mt-4">
      <h4>Assign Grade & Reason</h4>

      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="gradeInput">
          <Form.Label>Grade</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={grade}
            onChange={(e) => onGradeChange(e.target.value)}
            placeholder="e.g. 95.50"
            disabled={loading}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reasonInput">
          <Form.Label>Reason (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Short feedback…"
            disabled={loading}
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Saving…
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

TeacherProjectForm.propTypes = {
  grade:           PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onGradeChange:   PropTypes.func.isRequired,
  reason:          PropTypes.string,
  onReasonChange:  PropTypes.func.isRequired,
  loading:         PropTypes.bool.isRequired,
  error:           PropTypes.any,
  onSubmit:        PropTypes.func.isRequired,
  onCancel:        PropTypes.func.isRequired,
}
