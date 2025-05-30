import { useAuth } from '../hooks/useAuth'

export function UserMenu() {
  const { profile } = useAuth()
  const name = profile.first_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile.username

  return (
    <div className="d-flex align-items-center">
      <div className="text-end me-3">
        <div className="fw-semibold text-light">{name}</div>
        <small className="text-light text-capitalize">
          {profile.role}
        </small>
      </div>
      <img
        src={profile.profile_pic}
        alt={name}
        width={36}
        height={36}
        className="rounded-circle border border-light"
      />
    </div>
  )
}
