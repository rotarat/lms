import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'

export function PasswordFormUI({
  form,
  errors,
  submitError,
  loading,
  success,
  onChange,
  onSubmit
}) {
  return (
    <div className="card">
      <div className="card-header">Change Password</div>
      <div className="card-body">
        {success && <div className="alert alert-success">Password updated!</div>}
        {submitError && <div className="alert alert-danger">{submitError}</div>}

        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="old_password" className="form-label">Old Password</label>
            <input
              id="old_password"
              name="old_password"
              type="password"
              className={`form-control ${errors.old_password ? 'is-invalid' : ''}`}
              value={form.old_password}
              onChange={e => onChange('old_password', e.target.value)}
              autoComplete="current-password"
            />
            {errors.old_password && (
              <div className="invalid-feedback">{errors.old_password}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="new_password1" className="form-label">New Password</label>
            <input
              id="new_password1"
              name="new_password1"
              type="password"
              className={`form-control ${errors.new_password1 ? 'is-invalid' : ''}`}
              value={form.new_password1}
              onChange={e => onChange('new_password1', e.target.value)}
              autoComplete="new-password"
            />
            {errors.new_password1 && (
              <div className="invalid-feedback">{errors.new_password1}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="new_password2" className="form-label">Confirm New Password</label>
            <input
              id="new_password2"
              name="new_password2"
              type="password"
              className={`form-control ${errors.new_password2 ? 'is-invalid' : ''}`}
              value={form.new_password2}
              onChange={e => onChange('new_password2', e.target.value)}
              autoComplete="new-password"
            />
            {errors.new_password2 && (
              <div className="invalid-feedback">{errors.new_password2}</div>
            )}
          </div>

          <div className="text-center">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Updating…' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

PasswordFormUI.propTypes = {
  form:        PropTypes.object.isRequired,
  errors:      PropTypes.object.isRequired,
  submitError: PropTypes.string,
  loading:     PropTypes.bool.isRequired,
  success:     PropTypes.bool.isRequired,
  onChange:    PropTypes.func.isRequired,
  onSubmit:    PropTypes.func.isRequired
}
