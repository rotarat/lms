import { UserMenu } from './UserMenu'

export default function NavbarPortal() {
  return (
    <div className="d-flex w-100 align-items-center">
      {/* user info */}
			<div className="flex-grow-1"/>
      <UserMenu />
    </div>
  )
}
