import React, { useState, useContext } from 'react'
import { useNavigate }                 from 'react-router-dom'
import Sidebar                         from './Sidebar'
import { AuthContext }                 from '../../context/AuthContext'
import { changePassword }              from '../../api/profile'

export default function ChangePassword() {
  const { profile, logout } = useContext(AuthContext)
  const navigate            = useNavigate()

  const [form, setForm] = useState({
    old_password:    '',
    new_password1:   '',
    new_password2:   ''
  })
  const [errors, setErrors]       = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  // redirect if not logged in
  if (!profile) {
    navigate('/login', { replace: true })
    return null
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(errs => ({ ...errs, [name]: null }))
    setSubmitError(null)
    setSuccess(false)
  }

  function validate() {
    const errs = {}
    if (!form.old_password) errs.old_password = 'Old password is required'
    if (form.new_password1.length < 8)
      errs.new_password1 = 'New password must be at least 8 characters'
    if (form.new_password1 !== form.new_password2)
      errs.new_password2 = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await changePassword(form)
      setSuccess(true)
      // optionally log out on password change:
      // logout()
      // navigate('/login', { replace: true })
    } catch (err) {
      setSubmitError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Change password failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mt-4'>
      <div className='row'>
        <aside className='col-md-3'>
          <Sidebar/>
        </aside>
        <section className='col-md-9'>
          <div className="card">
            <form
              className="mx-lg-2"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="card-header">Change password</div>

              {success && (
                <div className="alert alert-success m-3">
                  Password updated successfully.
                </div>
              )}
              {submitError && (
                <div className="alert alert-danger m-3">
                  {submitError}
                </div>
              )}

              {/* Old Password */}
              <div className="mb-3">
                <label htmlFor="old_password" className="form-label mt-4">
                  Old password
                </label>
                <input
                  name="old_password"
                  id="old_password"
                  type="password"
                  className={`form-control ${
                    errors.old_password ? 'is-invalid' : ''
                  }`}
                  value={form.old_password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                {errors.old_password && (
                  <div className="invalid-feedback">
                    {errors.old_password}
                  </div>
                )}
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label htmlFor="new_password1" className="form-label mt-4">
                  New password
                </label>
                <input
                  name="new_password1"
                  id="new_password1"
                  type="password"
                  className={`form-control ${
                    errors.new_password1 ? 'is-invalid' : ''
                  }`}
                  value={form.new_password1}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.new_password1 && (
                  <div className="invalid-feedback">
                    {errors.new_password1}
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="mb-3">
                <label htmlFor="new_password2" className="form-label mt-4">
                  Confirm new password
                </label>
                <input
                  name="new_password2"
                  id="new_password2"
                  type="password"
                  className={`form-control ${
                    errors.new_password2 ? 'is-invalid' : ''
                  }`}
                  value={form.new_password2}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.new_password2 && (
                  <div className="invalid-feedback">
                    {errors.new_password2}
                  </div>
                )}
              </div>

              {/* Submit button centered */}
              <div className="text-center mb-3">
                <button
                  type="submit"
                  className={loading ? 'btn btn-primary disabled' : 'btn btn-primary'}
                  disabled={loading}
                >
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
