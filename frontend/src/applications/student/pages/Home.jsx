import { Outlet } from 'react-router-dom'
import PortalLayout from '../../../layouts/PortalLayout'

export default function Home() {
  return (
    <PortalLayout>
      <Outlet/>
    </PortalLayout>
  )
}