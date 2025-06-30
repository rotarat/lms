import ProfileUI from '../components/ProfileUI'
import useProfile from '../hooks/useProfile'
import { useAuth } from '../../../shared/hooks/useAuth'

export default function ProfileContainer() {
  const { profile: authProfile } = useAuth()
  const username = authProfile?.username
  const { profile, loading, error } = useProfile(username)

  return <ProfileUI profile={profile} loading={loading} error={error} />
}
