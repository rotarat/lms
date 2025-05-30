import { useEffect, useState  } from 'react'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '../../../shared/hooks/useAuth'
import { LogoutSignal }     from '../components/LogoutSignal'

/**
 * LogoutContainer
 *
 * Calls logout(), then immediately navigates to /home.
 * Renders <LogoutSignal /> while the effect runs.
 */
export function LogoutContainer() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [busy, setBusy] = useState(true)
  console.log('👉 LogoutContainer mounted, calling logout()');

  useEffect(() => {
    // Clear auth and redirect
    console.log('👉 LogoutContainer mounted, calling logout()');
    logout()
    setBusy(false)
    navigate('/home', { replace: true })
  }, [logout, navigate])

  if (!busy) return null

  return <LogoutSignal />
}
