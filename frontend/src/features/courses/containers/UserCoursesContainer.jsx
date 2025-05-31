import { useNavigate }       from 'react-router-dom'
import { useUserCourses }    from '../hooks/useUserCourses'
import { UserCoursesUI }     from '../components/UserCoursesUI'

export function UserCoursesContainer() {
  const navigate = useNavigate()
  const { courses, loading, error, deleteCourse } = useUserCourses()

  const handleView   = id => navigate(`/portal/teacher/courses/${id}`)
  const handleEdit   = id => navigate(`/portal/teacher/courses/${id}/edit`)
  const handleAddNew = () => navigate(`/portal/teacher/courses/create`)

  return (
    <UserCoursesUI
      courses={courses}
      loading={loading}
      error={error}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={deleteCourse}
      onAddNew={handleAddNew}
    />
  )
}
