import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'
import { LoadingButton } from '../../../shared/components/LoadingButton'

export function UserCoursesUI({
  courses,
  loading,
  error,
  onView,
  onProjects,
  onCreateExam,
  onExamVIew,
  onEdit,
  onDelete,
  onGenerateAudio,
  generatingId,
  onAddNew,
}) {
  if (loading) return <p>Loading your courses…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">My Courses</h4>
        <Button variant="primary" onClick={onAddNew}>Add New</Button>
      </div>

      {courses.length === 0 ? (
        <p>You have no courses yet.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 300 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td className="text-nowrap">
                  <div className="d-flex flex-row flex-nowrap align-items-center gap-2">
                    <Button
                    size="sm"
                    variant="info"
                    className="me-2"
                    onClick={() => onView(c.id)}
                    >
                      View
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="me-2"
                      onClick={() => onProjects(c.id)}
                    >
                      Projects
                    </Button>

                    <Button
                      size="sm"
                      variant="btn btn-sm btn-primary"
                      className="me-2"
                      onClick={() => onCreateExam(c.id)}
                    >
                      Create Exam
                    </Button>

                    <Button
                      size="sm"
                      variant="btn btn-sm btn-primary"
                      className="me-2"
                      onClick={() => onExamVIew(c.id)}
                    >
                      View Exam
                    </Button>

                    <LoadingButton
                      size="sm"
                      variant="warning"
                      loading={generatingId === c.id}
                      loadingLabel="Loading…"
                      onClick={() => onGenerateAudio(c.id)}
                    >
                      Create audio lecture
                    </LoadingButton>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="me-2"
                      onClick={() => onEdit(c.id)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (window.confirm('Really delete this course?')) {
                          onDelete(c.id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

UserCoursesUI.propTypes = {
  courses:        PropTypes.array.isRequired,
  loading:        PropTypes.bool.isRequired,
  error:          PropTypes.any,
  onView:         PropTypes.func.isRequired,
  onProjects:     PropTypes.func.isRequired,
  onCreateExam:   PropTypes.func.isRequired,
  onExamVIew:     PropTypes.func.isRequired,
  onEdit:         PropTypes.func.isRequired,
  onDelete:       PropTypes.func.isRequired,
  onGenerateAudio: PropTypes.func.isRequired,
  generatingId:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAddNew:       PropTypes.func.isRequired,
}
