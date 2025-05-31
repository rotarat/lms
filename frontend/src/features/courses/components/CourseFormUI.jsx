import PropTypes from 'prop-types'

export function CourseFormUI({
  isEdit,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onFileChange,
  loading,
  error,
  onSubmit,
}) {
  return (
    <div className="container mt-4">
      <h3>{isEdit ? 'Edit Course' : 'Create New Course'}</h3>
      {error && (
        <div className="alert alert-danger">
          {JSON.stringify(error)}
        </div>
      )}

      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="courseTitle" className="form-label">Title</label>
          <input
            id="courseTitle"
            type="text"
            className="form-control"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="courseDescription" className="form-label">Description</label>
          <textarea
            id="courseDescription"
            className="form-control"
            rows={4}
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="featuredImage" className="form-label">Featured Image</label>
          <input
            id="featuredImage"
            type="file"
            className="form-control"
            onChange={e => onFileChange(e.target.files[0])}
            disabled={loading}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading
            ? (isEdit ? 'Updating…' : 'Creating…')
            : (isEdit ? 'Update Course' : 'Create Course')}
        </button>
      </form>
    </div>
  )
}

CourseFormUI.propTypes = {
  isEdit:          PropTypes.bool.isRequired,
  title:           PropTypes.string.isRequired,
  description:     PropTypes.string.isRequired,
  onTitleChange:   PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onFileChange:    PropTypes.func.isRequired,
  loading:         PropTypes.bool.isRequired,
  error:           PropTypes.any,
  onSubmit:        PropTypes.func.isRequired,
}
