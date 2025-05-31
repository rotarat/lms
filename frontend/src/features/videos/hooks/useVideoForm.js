import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth }   from '../../../shared/hooks/useAuth'
import { coursesApi, videosApi } from '../../../shared/api/resourses'

export function useVideoForm() {
  const { profile } = useAuth()
  const navigate    = useNavigate()
  const [search]    = useSearchParams()

  const presetTitle    = search.get('title')  || ''
  const presetCourseId = search.get('course') || ''

  const [courses, setCourses]   = useState([])
  const [form, setForm]         = useState({
    course:      presetCourseId,
    title:       presetTitle,
    description: ''
  })
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)

  // load the teacher's courses
  useEffect(() => {
    if (!profile) return
    coursesApi
      .list({ owner: profile.username })
      .then(items => {
        setCourses(items)
        // if no preset course, default to first
        if (!presetCourseId && items.length) {
          setForm(f => ({ ...f, course: items[0].id.toString() }))
        }
      })
      .catch(() => setError('Could not load courses'))
      .finally(() => setLoading(false))
  }, [profile, presetCourseId])

  function handleChange(name, value) {
    setForm(f => ({ ...f, [name]: value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        course:      form.course,
        title:       form.title,
        description: form.description
      }
      const video = await videosApi.create(payload)
      navigate(`/portal/${profile.role}/videos/${video.id}`)
    } catch {
      setError('Failed to create video.')
      setSaving(false)
    }
  }

  return {
    courses,
    form,
    loading,
    saving,
    error,
    handleChange,
    handleSubmit
  }
}
