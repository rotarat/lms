import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'

export function UserVideosUI({
  videos,
  loading,
  error,
  onAddNew,
  onDelete,
  onView,
  canAdd
}) {
  if (loading) return <p>Loading your videos…</p>
  if (error)   return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">My Videos</h4>
        {canAdd && (
          <Button variant="primary" onClick={onAddNew}>
            Add New
          </Button>
        )}
      </div>

      {videos.length === 0 ? (
        <p>You have no videos yet.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th style={{ width: 150 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.id}>
                <td>{v.title}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => onView(v.id)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (window.confirm('Really delete this video?')) {
                        onDelete(v.id)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

UserVideosUI.propTypes = {
  videos:   PropTypes.array.isRequired,
  loading:  PropTypes.bool.isRequired,
  error:    PropTypes.any,
  onAddNew: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView:  PropTypes.func.isRequired,
  canAdd:   PropTypes.bool.isRequired,
}
