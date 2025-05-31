import { useState, useEffect } from 'react'
import { useAuth }             from '../../../shared/hooks/useAuth'
import { videosApi }           from '../../../shared/api/resourses'

export function useUserVideos() {
  const { profile } = useAuth()
  const [videos, setVideos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    videosApi
      .list({ owner: profile.username })
      .then(items => {
        setVideos(items)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [profile])

  const deleteVideo = async id => {
    await videosApi.delete(id)
    setVideos(vs => vs.filter(v => v.id !== id))
  }

  return { videos, loading, error, deleteVideo }
}
