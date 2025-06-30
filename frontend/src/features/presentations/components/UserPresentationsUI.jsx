import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'

export function UserPresentationsUI({
  presentations,
  loading,
  error,
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onCreateVideo
}) {
  if (loading) return <p>Loading your presentations…</p>
  if (error)   return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">My Presentations</h4>
        <Button variant="primary" onClick={onAddNew}>Add New</Button>
      </div>

      {presentations.length === 0 ? (
        <p>You have no presentations yet.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th style={{ width: 240 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {presentations.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td className="text-nowrap">
                  <div className="d-flex flex-row flex-nowrap align-items-center gap-2">
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => onView(p.id)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => onCreateVideo(p.title, p.course)}
                    >
                      Create Video
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="me-2"
                      onClick={() => onEdit(p.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (window.confirm('Really delete this presentation?')) {
                          onDelete(p.id)
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

UserPresentationsUI.propTypes = {
  presentations: PropTypes.array.isRequired,
  loading:       PropTypes.bool.isRequired,
  error:         PropTypes.any,
  onAddNew:      PropTypes.func.isRequired,
  onView:        PropTypes.func.isRequired,
  onEdit:        PropTypes.func.isRequired,
  onDelete:      PropTypes.func.isRequired,
  onCreateVideo: PropTypes.func.isRequired,
}
