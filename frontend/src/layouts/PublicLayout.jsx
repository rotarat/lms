import { Outlet } from 'react-router-dom'
/**
 * Public Layout
 *
 * A simple centered container for auth-related pages (login, register, logout).
 */
export default function PublicLayout() {
  return (
   <div className="public-wrapper">
      <main>
        <Outlet/>
      </main>
    </div>
  )
}