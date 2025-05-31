import { useNavigate } from 'react-router-dom'
import { useEnrolledCourses } from '../../../features/courses/hooks/useEnrolledCourses'
import { CardList }         from '../../../shared/components/CardList'
import { ResourceCard }     from '../../../shared/components/ResourceCard'

export default function EnrolledCoursesPage() {
  const { courses, loading, error } = useEnrolledCourses()
  const navigate = useNavigate()

  const handleView = id => navigate(`/courses/${id}`)

  if (loading) return <p>Loading your courses…</p>
  if (error)   return <div className="alert alert-danger">{error}</div>
  if (!courses.length)
    return <p className="text-center">You're not enrolled in any courses yet.</p>

  return (
    <CardList
      items={courses}
      cols={3}
      renderItem={course => (
        <ResourceCard
          to={`/courses/${course.id}`}
          imageSrc={course.thumbnail}
          title={course.title}
          description={course.description}
          onClick={() => handleView(course.id)}
        />
      )}
    />
  )
}
