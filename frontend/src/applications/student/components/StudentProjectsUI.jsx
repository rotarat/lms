import PropTypes from 'prop-types'
import { Spinner, Card, Alert } from 'react-bootstrap'
import { CardList } from '../../../shared/components/CardList'

export default function StudentProjectsUI({
  groupedByCourse,
  loading,
  error,
  onAddNew,
  onView,       // ← new prop
}) {
  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <strong>Error loading your projects:</strong> {JSON.stringify(error)}
      </Alert>
    )
  }

  const courseTitles = Object.keys(groupedByCourse)

  // If no projects, show “Add New” button + message
  if (courseTitles.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>My Projects</h3>
          <button className="btn btn-primary" onClick={onAddNew}>
            Add New
          </button>
        </div>
        <p className="text-center">You have not submitted any projects yet.</p>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Projects</h3>
        <button className="btn btn-primary" onClick={onAddNew}>
          Add New
        </button>
      </div>

      {courseTitles.map((course) => (
        <section key={course} className="mb-5">
          <h3>{course}</h3>
          <CardList
            items={groupedByCourse[course]}
            cols={3}
            renderItem={(proj) => (
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  {/* Title as clickable button */}
                  <button
                    className="btn btn-link text-start p-0 mb-2"
                    style={{ textDecoration: 'none' }}
                    onClick={() => onView(proj.id)}
                  >
                    <Card.Title className="text-truncate">
                      {proj.title || 'Untitled'}
                    </Card.Title>
                  </button>
                  <div className="mt-auto">
                    <p className="mb-2">
                      <strong>
                        Grade:{' '}
                        {proj.grade != null ? proj.grade : 'In review'}
                      </strong>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            )}
          />
        </section>
      ))}
    </div>
  )
}

StudentProjectsUI.propTypes = {
  groupedByCourse: PropTypes.objectOf(PropTypes.array).isRequired,
  loading:         PropTypes.bool.isRequired,
  error:           PropTypes.any,
  onAddNew:        PropTypes.func.isRequired,
  onView:          PropTypes.func.isRequired,
}
