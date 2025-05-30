import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { AuthContext } from '../../context/AuthContext'

export default function ProfileSettings() {
  const { profile, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name:  '',
    last_name:   '',
    bio:         '',
    profile_pic: null,
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess]           = useState(false)

  useEffect(() => {
    if (!profile) {
      navigate('/login', { replace: true })
      return
    }
    setForm({
      first_name:  profile.first_name || '',
      last_name:   profile.last_name  || '',
      bio:         profile.bio        || '',
      profile_pic: null,
    })
  }, [profile, navigate])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(errs => ({ ...errs, [name]: null }))
    setSubmitError(null)
    setSuccess(false)
  }

  const handleFile = e => {
    setForm(f => ({ ...f, profile_pic: e.target.files[0] }))
    setErrors(errs => ({ ...errs, profile_pic: null }))
    setSubmitError(null)
    setSuccess(false)
  }

  const validate = () => {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'First name is required'
    if (!form.last_name.trim())  errs.last_name  = 'Last name is required'
    // bio/profile_pic optional
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
      const data = new FormData()
      data.append('first_name', form.first_name)
      data.append('last_name',  form.last_name)
      data.append('bio',        form.bio)
      if (form.profile_pic) {
        data.append('profile_pic', form.profile_pic)
      }

      await updateProfile(profile.username, data)
      setForm(f => ({ ...f, profile_pic: null })) 
      setSuccess(true)
    } catch (err) {
      setSubmitError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Update failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>

        <section className="col-md-9">
          <div className="card">
            {/*  success message */}
            {success && (
                <div className="alert alert-success m-3">
                Profile updated successfully!
                </div>
            )}
            {submitError && (
              <div className="alert alert-danger m-3">{submitError}</div>
            )}
            <form
              className="mx-lg-2"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              noValidate
            >
              <div className="card-header">Profile settings</div>

              {/* First Name */}
              <div className="mb-3">
                <label htmlFor="first_name" className="form-label mt-4">
                  First Name
                </label>
                <input
                  name="first_name"
                  id="first_name"
                  type="text"
                  className={`form-control ${
                    errors.first_name ? 'is-invalid' : ''
                  }`}
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <div className="invalid-feedback">{errors.first_name}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <label htmlFor="last_name" className="form-label mt-4">
                  Last Name
                </label>
                <input
                  name="last_name"
                  id="last_name"
                  type="text"
                  className={`form-control ${
                    errors.last_name ? 'is-invalid' : ''
                  }`}
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <div className="invalid-feedback">{errors.last_name}</div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="mb-3">
                <label htmlFor="profile_pic" className="form-label mt-4">
                  Profile picture
                </label>
                <input
                  name="profile_pic"
                  id="profile_pic"
                  type="file"
                  className={`form-control ${
                    errors.profile_pic ? 'is-invalid' : ''
                  }`}
                  onChange={handleFile}
                />
                {errors.profile_pic && (
                  <div className="invalid-feedback">{errors.profile_pic}</div>
                )}
              </div>

              {/* Bio */}
              <div className="mb-3">
                <label htmlFor="bio" className="form-label mt-4">
                  Enter bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                  rows="3"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="A short bio…"
                />
                {errors.bio && (
                  <div className="invalid-feedback">{errors.bio}</div>
                )}
              </div>

              {/* Submit */}
              <div className="text-end mb-3">
                <button
                  type="submit"
                  className={loading ? 'btn btn-primary disabled' : 'btn btn-primary'}
                  disabled={loading}
                >
                  {loading ? 'Updating…' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
