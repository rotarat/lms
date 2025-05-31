import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import { coursesApi, presentationsApi } from '../../../shared/api/resourses'

export function usePresentationForm() {
  const { id } = useParams()
  const isEdit   = Boolean(id)
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({
    course:      '',
    title:       '',
    description: '',
    file:        null
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  // Load courses owned by this user
  useEffect(() => {
    if (!profile) return
    coursesApi
      .list({ owner: profile.username })
      .then(items => {
        setCourses(items)
        if (!isEdit && items.length) {
          setForm(f => ({ ...f, course: items[0].id }))
        }
      })
      .catch(() => setError('Could not load courses'))
  }, [profile, isEdit])

  // If editing, fetch existing presentation
  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }
    presentationsApi
      .get(id)
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

  function handleChange(name, value) {
    setForm(f => ({ ...f, [name]: value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = new FormData()
    data.append('course',      form.course)
    data.append('title',       form.title)
    data.append('description', form.description)
    if (form.file) data.append('file', form.file)

    try {
      if (isEdit) {
        await presentationsApi.update(id, data)
      } else {
        await presentationsApi.create(data)
      }
      navigate('/portal/teacher/courses')  // adjust to your teacher list route
    } catch (err) {
      setError(err.response?.data || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return {
    isEdit,
    form,
    courses,
    loading,
    saving,
    error,
    handleChange,
    setFile: file => handleChange('file', file),
    handleSubmit,
  }
}
