import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { register } = useContext(AuthContext)
  const [userCreationForm, setUserCreationForm] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    role: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = event => {
    event.preventDefault()
    const { name, value } = event.target
    setUserCreationForm(form => ({ ...form, [name]: value }))
    setErrors(errors => ({ ...errors, [name]: null }))
    setSubmitError(null)
  }

  const validate = () => {
    const errors = {}
    if (!userCreationForm.username.trim()) errors.username = 'Please provide username'
    if (!userCreationForm.email.trim()) errors.email = 'Please provide email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userCreationForm.email))
      errors.email = 'The given email address is invalid'
    if (!userCreationForm.password1) errors.password1 = 'Please provide password'
    else if (userCreationForm.password1.length < 8)
      errors.password1 = 'Password must be at least 8 characters'
    if (userCreationForm.password2 !== userCreationForm.password1)
      errors.password2 = 'Passwords did not match'
    if (!['student', 'teacher'].includes(userCreationForm.role))
      errors.role = 'Please choose the position to register you with'
    return errors
  }

  const submitForm = async e => {
    e.preventDefault()
    if (loading) return
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const validated_form_data = new FormData()
      Object.entries(userCreationForm).forEach(([k, v]) => validated_form_data.append(k, v))

      await register(validated_form_data)
      navigate('/user/profile-settings')

    } catch (err) {
      if (err.response?.data) {
        setSubmitError(JSON.stringify(err.response.data))
      } else {
        setSubmitError('The registration request was unsuccessful and did not reach the server. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="card w-100" style={{ maxWidth: '555px' }}>
          <div className="card-body">
            <h4 className="card-title">Welcome aboard!</h4>
            <h6 className="card-subtitle mb-3 text-muted">
              We need some info before we get you started
            </h6>

            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}

            <form onSubmit={submitForm} noValidate>
              {/* Username */}
              <div className="mb-1">
                <label htmlFor="username" className="form-label mt-1">
                  Username
                </label>
                <input
                  name="username"
                  id="username"
                  type="text"
                  className={`form-control ${
                    errors.username ? 'is-invalid' : ''
                  }`}
                  placeholder="Enter username"
                  value={userCreationForm.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-1">
                <label htmlFor="email" className="form-label mt-1">
                  Email address
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                  value={userCreationForm.email}
                  onChange={handleChange}
                />
                <small className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-1">
                <label htmlFor="password1" className="form-label mt-1">
                  Password
                </label>
                <input
                  name="password1"
                  id="password1"
                  type="password"
                  className={`form-control ${
                    errors.password1 ? 'is-invalid' : ''
                  }`}
                  placeholder="Password"
                  autoComplete="new-password"
                  value={userCreationForm.password1}
                  onChange={handleChange}
                />
                {errors.password1 && (
                  <div className="invalid-feedback">{errors.password1}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-1">
                <label htmlFor="password2" className="form-label mt-1">
                  Confirm password
                </label>
                <input
                  name="password2"
                  id="password2"
                  type="password"
                  className={`form-control ${
                    errors.password2 ? 'is-invalid' : ''
                  }`}
                  placeholder="Password"
                  autoComplete="new-password"
                  value={userCreationForm.password2}
                  onChange={handleChange}
                />
                {errors.password2 && (
                  <div className="invalid-feedback">{errors.password2}</div>
                )}
              </div>

              {/* Role Radios */}
              <div className="form-check mt-2">
                <input
                  className={`form-check-input ${errors.role ? 'is-invalid' : ''}`}
                  type="radio"
                  name="role"
                  id="check-student"
                  value="student"
                  checked={userCreationForm.role === 'student'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="check-student">
                  Student
                </label>
              </div>
              <div className="form-check">
                <input
                  className={`form-check-input ${errors.role ? 'is-invalid' : ''}`}
                  type="radio"
                  name="role"
                  id="check-teacher"
                  value="teacher"
                  checked={userCreationForm.role === 'teacher'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="check-teacher">
                  Teacher
                </label>
              </div>
              {errors.role && (
                <div className="invalid-feedback d-block">{errors.role}</div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className={
                    loading
                      ? 'btn btn-primary disabled'
                      : 'btn btn-primary'
                  }
                  disabled={loading}
                >
                  {loading ? 'Signing up…' : 'Sign up'}
                </button>
              </div>
            </form>
            <div className="row mt-1 text-center">
              <p className="card-text">Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}