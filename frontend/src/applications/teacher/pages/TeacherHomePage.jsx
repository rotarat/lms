import { Outlet } from 'react-router-dom'

export default function TeacherHomePage() {
  return (
    <div>
      <h1>This is the Teacher Home page</h1>
      <Outlet/>
    </div>
  )
}