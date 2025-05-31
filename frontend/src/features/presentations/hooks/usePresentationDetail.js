import { useState, useEffect } from 'react'
import { useParams }          from 'react-router-dom'
import { presentationsApi }          from '../../../shared/api/resourses'

export function usePresentationDetail(explicitId) {
  const { id: paramId } = useParams()
  const id = explicitId ?? paramId
  const [presentation, setPresentation] = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    setLoading(true)
    presentationsApi
      .get(id)
      .then(p => {
        setPresentation(p)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  return { presentation, loading, error }
}
