import { useState, useEffect, useCallback } from 'react'

/**
 * Wraps a CRUD API to handle form state + submission.
 *
 * @param {object} api     — a resourceApi with .get(id), .create(data), .update(id,data)
 * @param {string|number} id — optional; if present, we load existing data
 */
export function useResourceForm(api, id) {
  const isEdit = Boolean(id)
  const [formState, setFormState] = useState({})
  const [loading, setLoading]     = useState(isEdit)
  const [error, setError]         = useState(null)

  // Load existing data on edit
  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    api.get(id)
      .then(data => setFormState(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [api, id, isEdit])

  const handleChange = useCallback((field, value) => {
    setFormState(fs => ({ ...fs, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isEdit) {
        await api.update(id, formState)
      } else {
        await api.create(formState)
      }
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [api, id, isEdit, formState])

  return {
    formState,
    loading,
    error,
    isEdit,
    handleChange,
    handleSubmit
  }
}
