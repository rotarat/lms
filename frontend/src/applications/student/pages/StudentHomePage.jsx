import { Outlet } from 'react-router-dom'

export default function StudentHomePage() {
  return (
    <div>
      <h1>This is the Student Home page</h1>
      <Outlet/>
    </div>
  )
}