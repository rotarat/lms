import { useState, useEffect } from 'react'
import { useAuth }              from '../../../shared/hooks/useAuth'
import { profilesApi }            from '../../../shared/api/resourses'

export function useProfileForm() {
  const { profile, updateProfile } = useAuth()
  const [form, setForm]         = useState({
    first_name:  '',
    last_name:   '',
    bio:         '',
    profile_pic: null
  })
  const [errors, setErrors]     = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [success, setSuccess]   = useState(false)

  // initialize form from profile
  useEffect(() => {
    if (!profile) return
    setForm({
      first_name: profile.first_name || '',
      last_name:  profile.last_name  || '',
      bio:        profile.bio        || '',
      profile_pic: null
    })
    setLoading(false)
  }, [profile])

  function handleChange(name, value) {
    setForm(f => ({ ...f, [name]: value }))
    setErrors(e => ({ ...e, [name]: null }))
    setSubmitError(null)
    setSuccess(false)
  }

  function validate() {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'Required'
    if (!form.last_name.trim())  errs.last_name  = 'Required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    const fieldErrs = validate()
    if (Object.keys(fieldErrs).length) {
      setErrors(fieldErrs)
      return
    }

    setLoading(true)
    const data = new FormData()
    data.append('first_name', form.first_name)
    data.append('last_name',  form.last_name)
    data.append('bio',        form.bio)
    if (form.profile_pic) data.append('profile_pic', form.profile_pic)

    try {
      const updated = await profilesApi.patch(profile.id, data)
      updateProfile(updated)
      setSuccess(true)
    } catch (err) {
      setSubmitError(err.response?.data ?? 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    errors,
    submitError,
    loading,
    success,
    handleChange,
    setFile: file => handleChange('profile_pic', file),
    handleSubmit
  }
}
