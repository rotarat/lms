import { useState } from 'react'
import { useNavigate }     from 'react-router-dom'
import { useAuth }         from '../../../shared/hooks/useAuth'
import { useFormValidation } from '../../../shared/hooks/useFormValidation'
import { LoginForm }       from '../components/LoginForm'

export function LoginContainer() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]         = useState({ username: '', password: '' })
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading]   = useState(false)

  const { errors: formErrors, validate, setErrors } = useFormValidation()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    // clear error for this field
    setErrors(prev => ({ ...prev, [name]: null }))
    setSubmitError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return

    // Field validation (mirrors original validate() :contentReference[oaicite:5]{index=5})
    const rules = [
      { field: 'username', test: v => v.trim() !== '',      message: 'Please provide username' },
      { field: 'password', test: v => v.trim() !== '',      message: 'Please provide password' }
    ]
    if (!validate(form, rules)) return

    setLoading(true)
    setSubmitError(null)
    try {
      await login(form)
      // redirect based on role
      navigate('/portal', { replace: true })
    } catch (err) {
      // surface server‐side errors if present
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : 'Login failed. Please try again.'
      setSubmitError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginForm
      form={form}
      formErrors={formErrors}
      error={submitError}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}
