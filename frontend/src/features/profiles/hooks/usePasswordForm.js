import { useState }       from 'react'
import { profilesApi }      from '../../../shared/api/resourses'

export function usePasswordForm() {
  const [form, setForm]           = useState({
    old_password:   '',
    new_password1:  '',
    new_password2:  ''
  })
  const [errors, setErrors]       = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  function handleChange(name, value) {
    setForm(f => ({ ...f, [name]: value }))
    setErrors(e => ({ ...e, [name]: null }))
    setSubmitError(null)
    setSuccess(false)
  }

  function validate() {
    const errs = {}
    if (!form.old_password) errs.old_password = 'Required'
    if (form.new_password1.length < 8)
      errs.new_password1 = 'Must be ≥ 8 chars'
    if (form.new_password1 !== form.new_password2)
      errs.new_password2 = 'Does not match'
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
    try {
      await profilesApi.changePassword(form)
      setSuccess(true)
    } catch (err) {
      setSubmitError(err.response?.data ?? 'Password change failed')
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
    handleSubmit
  }
}
