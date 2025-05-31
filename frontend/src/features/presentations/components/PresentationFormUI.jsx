import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'

export function PresentationFormUI({
  isEdit,
  form,
  courses,
  loading,
  saving,
  error,
  onChange,
  onFileChange,
  onSubmit
}) {
  return loading ? (
    <p>Loading…</p>
  ) : (
    <div className="container mt-4">
      <h3>{isEdit ? 'Edit Presentation' : 'Create Presentation'}</h3>
      {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}
      <form onSubmit={onSubmit} encType="multipart/form-data" noValidate>
        <div className="mb-3">
          <label htmlFor="courseSelect" className="form-label">Course</label>
          <select
            id="courseSelect"
            name="course"
            className="form-select"
            value={form.course}
            onChange={e => onChange('course', e.target.value)}
            required
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="titleInput" className="form-label">Title</label>
          <input
            id="titleInput"
            name="title"
            type="text"
            className="form-control"
            value={form.title}
            onChange={e => onChange('title', e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descriptionInput" className="form-label">Description</label>
          <textarea
            id="descriptionInput"
            name="description"
            className="form-control"
            rows={3}
            value={form.description}
            onChange={e => onChange('description', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fileInput" className="form-label">File</label>
          <input
            id="fileInput"
            name="file"
            type="file"
            className="form-control"
            onChange={e => onFileChange(e.target.files[0])}
          />
        </div>

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Presentation' : 'Create Presentation'}
        </Button>
      </form>
    </div>
  )
}

PresentationFormUI.propTypes = {
  isEdit:      PropTypes.bool.isRequired,
  form:        PropTypes.object.isRequired,
  courses:     PropTypes.array.isRequired,
  loading:     PropTypes.bool.isRequired,
  saving:      PropTypes.bool.isRequired,
  error:       PropTypes.any,
  onChange:    PropTypes.func.isRequired,
  onFileChange:PropTypes.func.isRequired,
  onSubmit:    PropTypes.func.isRequired,
}
