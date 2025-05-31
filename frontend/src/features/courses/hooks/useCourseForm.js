import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { coursesApi } from '../../../shared/api/resourses'

export function useCourseForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null)
  const [loading, setLoading]         = useState(isEdit)
  const [error, setError]             = useState(null)

  // If editing, fetch existing course
  useEffect(() => {
    if (!isEdit) return
    coursesApi.get(id)
      .then(c => {
        setTitle(c.title)
        setDescription(c.description)
      })
      .catch(err => setError(err.response?.data || err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (featuredImage) {
      formData.append('featured_image', featuredImage)
    }

    try {
      if (isEdit) {
        await coursesApi.update(id, formData)
      } else {
        await coursesApi.create(formData)
      }
      navigate('/portal/student/courses')   // or wherever your courses listing lives
    } catch (err) {
      setError(err.response?.data || err.message)
      setLoading(false)
    }
  }

  return {
    isEdit,
    title,
    setTitle,
    description,
    setDescription,
    featuredImage,
    setFeaturedImage,
    loading,
    error,
    handleSubmit,
  }
}
