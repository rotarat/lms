import { useState, useEffect } from 'react'
import { useAuth }             from '../../../shared/hooks/useAuth'
import { presentationsApi }           from '../../../shared/api/resourses'

export function useUserPresentations() {
  const { profile } = useAuth()
  const [presentations, setPresentations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    presentationsApi
      .list({ owner: profile.username })
      .then(items => {
        setPresentations(items)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [profile])

  const deletePresentation = async id => {
    await presentationsApi.delete(id)
    setPresentations(ps => ps.filter(p => p.id !== id))
  }

  return { presentations, loading, error, deletePresentation }
}
