import { useState, useEffect } from 'react'
import { profilesApi } from '../../../shared/api/resourses'

export default function useProfile(username) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    profilesApi
      .get(username)
      .then(data => setProfile(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [username])

  return { profile, loading, error }
}