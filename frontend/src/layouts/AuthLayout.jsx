import { Outlet } from 'react-router-dom'

/**
 * AuthLayout
 *
 * A simple centered container for auth-related pages (login, register, logout).
 */
export default function AuthLayout() {
  return (
    <div className="
        container-fluid
        min-vh-100
        d-flex
        justify-content-center
        align-items-center
    ">
      <div style={{ maxWidth: '555px', width: '100%' }}>
          <Outlet/>
      </div>
    </div>
  )
}
