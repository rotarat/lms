import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext }            from '../../context/AuthContext'
import { fetchByOwner }           from '../../api/courses'
import {
  fetchPresentationById,
  createPresentation,
  updatePresentation
} from '../../api/presentations'

export default function PresentationForm() {
  const { id }       = useParams()
  const isEdit       = Boolean(id)
  const navigate     = useNavigate()
  const { profile }  = useContext(AuthContext)

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  const [form, setForm] = useState({
    course:      '',
    title:       '',
    description: '',
    file:        null
  })

  // load courses for dropdown
  useEffect(() => {
    if (!profile) return
    fetchByOwner(profile.username)
      .then(data => {
        setCourses(data)
        if (!isEdit && data.length) {
          setForm(f => ({ ...f, course: data[0].id }))
        }
      })
      .catch(() => setError('Could not load courses'))
  }, [profile, isEdit])

  // if editing: load existing presentation
  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }
    fetchPresentationById(id)
      .then(p => {
        setForm({
          course:      p.course,
          title:       p.title,
          description: p.description || '',
          file:        null
        })
      })
      .catch(() => setError('Could not load presentation'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError(null)
  }

  function handleFile(e) {
    setForm(f => ({ ...f, file: e.target.files[0] }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const data = new FormData()
    data.append('course',      form.course)
    data.append('title',       form.title)
    data.append('description', form.description)
    if (form.file) data.append('file', form.file)

    try {
      if (isEdit) {
        await updatePresentation(id, data)
      } else {
        await createPresentation(data)
      }
      navigate('/user/presentations')
    } catch (err) {
      setError(err.response?.data || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading…</p>

  return (
    <div className="container mt-4">
      <h3>{isEdit ? 'Edit Presentation' : 'Create Presentation'}</h3>
      {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        {/* Course selector */}
        <div className="mb-3">
          <label className="form-label">Course</label>
          <select
            name="course"
            className="form-select"
            value={form.course}
            onChange={handleChange}
            required
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* File upload */}
        <div className="mb-3">
          <label className="form-label">File</label>
          <input
            name="file"
            type="file"
            className="form-control"
            onChange={handleFile}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  )
}
