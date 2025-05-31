import { useState, useEffect } from 'react'
import { useParams }           from 'react-router-dom'
import { videosApi }           from '../../../shared/api/resourses'

export function useVideoDetail(explicitId) {
  const { id: paramId } = useParams()
  const id = explicitId ?? paramId
  const [video, setVideo]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    videosApi
      .get(id)
      .then(v => {
        setVideo(v)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  return { video, loading, error }
}
