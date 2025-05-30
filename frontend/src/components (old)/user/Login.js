import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [form, setForm]         = useState({ username: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(errs => ({ ...errs, [name]: null }))
    setSubmitError(null)
  }

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = 'Please provide username'
    if (!form.password) errs.password = 'Please provide password'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await login({ username: form.username, password: form.password })
      navigate('/')
    } catch (err) {
      if (err.response?.data) {
        setSubmitError(JSON.stringify(err.response.data))
      } else {
        setSubmitError('Login failed. Please try again.')
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
            <h4 className="card-title">Welcome back!</h4>
            <h6 className="card-subtitle mb-3 text-muted">Happy to see you again</h6>

            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-1">
                <label htmlFor="username" className="form-label mt-1">
                  Username
                </label>
                <input
                  name="username"
                  id="username"
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-1">
                <label htmlFor="password" className="form-label mt-1">
                  Password
                </label>
                <input
                  name="password"
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={loading ? 'btn btn-primary disabled' : 'btn btn-primary'}
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="row mt-1 text-center">
              <p className="card-text">
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
