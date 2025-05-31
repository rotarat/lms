import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'

export function VideoFormUI({
  courses,
  form,
  loading,
  saving,
  error,
  onChange,
  onSubmit
}) {
  if (loading) return <p>Loading…</p>

  const currentCourse = courses.find(c => c.id.toString() === form.course)

  return (
    <div className="container mt-4">
      <h3>Create Video</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="course" className="form-label">Course</label>
          <input
            id="course"
            type="text"
            className="form-control"
            value={currentCourse?.title || ''}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Video Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            value={form.title}
            onChange={e => onChange('title', e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={3}
            value={form.description}
            onChange={e => onChange('description', e.target.value)}
          />
        </div>

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Creating…' : 'Create Video'}
        </Button>
      </form>
    </div>
  )
}

VideoFormUI.propTypes = {
  courses: PropTypes.array.isRequired,
  form:    PropTypes.shape({
    course:      PropTypes.string.isRequired,
    title:       PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  loading:  PropTypes.bool.isRequired,
  saving:   PropTypes.bool.isRequired,
  error:    PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}
