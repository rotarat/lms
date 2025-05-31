// src/features/profile/components/ProfileFormUI.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../../shared/components/Button'

export function ProfileFormUI({
  form,
  errors,
  submitError,
  loading,
  success,
  onChange,
  onFileChange,
  onSubmit
}) {
  return (
    <div className="card mb-4">
      <div className="card-header">Profile Settings</div>
      <div className="card-body">
        {success && <div className="alert alert-success">Profile updated!</div>}
        {submitError && <div className="alert alert-danger">{submitError}</div>}

        <form onSubmit={onSubmit} encType="multipart/form-data" noValidate>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
              value={form.first_name}
              onChange={e => onChange('first_name', e.target.value)}
            />
            {errors.first_name && (
              <div className="invalid-feedback">{errors.first_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
              value={form.last_name}
              onChange={e => onChange('last_name', e.target.value)}
            />
            {errors.last_name && (
              <div className="invalid-feedback">{errors.last_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="profile_pic" className="form-label">Profile Picture</label>
            <input
              id="profile_pic"
              name="profile_pic"
              type="file"
              className={`form-control ${errors.profile_pic ? 'is-invalid' : ''}`}
              onChange={e => onFileChange(e.target.files[0])}
            />
            {errors.profile_pic && (
              <div className="invalid-feedback">{errors.profile_pic}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
              rows={3}
              value={form.bio}
              onChange={e => onChange('bio', e.target.value)}
            />
            {errors.bio && (
              <div className="invalid-feedback">{errors.bio}</div>
            )}
          </div>

          <div className="text-end">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Updating…' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

ProfileFormUI.propTypes = {
  form:        PropTypes.object.isRequired,
  errors:      PropTypes.object.isRequired,
  submitError: PropTypes.string,
  loading:     PropTypes.bool.isRequired,
  success:     PropTypes.bool.isRequired,
  onChange:    PropTypes.func.isRequired,
  onFileChange:PropTypes.func.isRequired,
  onSubmit:    PropTypes.func.isRequired
}
