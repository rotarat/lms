import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCourse, fetchCourseById, updateCourse } from '../../api/courses'

export default function CourseForm() {
  const { id }        = useParams()       // will be undefined on /create
  const navigate      = useNavigate()
  const isEdit        = Boolean(id)
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null)
  const [error, setError]           = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchCourseById(id).then(course => {
        setTitle(course.title)
        setDescription(course.description)
        // you might display existing featuredImage URL here
      })
    }
  }, [id, isEdit])

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (featuredImage) {
      formData.append('featured_image', featuredImage)
    }

    try {
      if (isEdit) {
        await updateCourse(id, formData)
      } else {
        await createCourse(formData)
      }
      navigate('/user/courses')
    } catch (err) {
      setError(err.response?.data || 'Save failed')
    }
  }

  return (
    <div className="container mt-4">
      <h3>{isEdit ? 'Edit Course' : 'Create New Course'}</h3>
      {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Featured Image</label>
          <input
            type="file"
            className="form-control"
            onChange={e => setFeaturedImage(e.target.files[0])}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  )
}
