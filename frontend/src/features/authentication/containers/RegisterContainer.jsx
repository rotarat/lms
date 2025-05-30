import { useState } from 'react'
import { useNavigate }     from 'react-router-dom'
import { useAuth }         from '../../../shared/hooks/useAuth'
import { useFormValidation } from '../../../shared/hooks/useFormValidation'
import { RegisterForm }    from '../components/RegisterForm'

export function RegisterContainer() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]             = useState({
    username: '', email: '',
    password1: '', password2: '',
    role: ''
  })
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading]       = useState(false)

  const { errors: formErrors, validate, setErrors } = useFormValidation()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
    setSubmitError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return

    // Field validation (mirrors original validate() :contentReference[oaicite:6]{index=6})
    const rules = [
      { field: 'username',  test: v => v.trim() !== '',            message: 'Please provide username' },
      { field: 'email',     test: v => v.trim() !== '',            message: 'Please provide email' },
      { field: 'email',     test: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), message: 'The given email address is invalid' },
      { field: 'password1', test: v => v.length >= 8,              message: 'Password must be at least 8 characters' },
      { field: 'password2', test: (v, all) => v === all.password1, message: 'Passwords did not match' },
      { field: 'role',      test: v => ['student','teacher'].includes(v),   message: 'Please choose a role' }
    ]
    if (!validate(form, rules)) return

    setLoading(true)
    setSubmitError(null)
    try {
      await register(form)
      // on successful register we already have tokens + profile,
      // so redirect immediately
      navigate('/portal', { replace: true })
    } catch (err) {
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : 'Registration failed. Please try again.'
      setSubmitError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterForm
      form={form}
      formErrors={formErrors}
      error={submitError}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}
