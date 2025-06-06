import PropTypes from 'prop-types'
import { CardList } from '../../../shared/components/CardList'
import { ResourceCard } from '../../../shared/components/ResourceCard'

export default function EnrolledCoursesUI({ courses, loading, error, onView }) {
  if (loading) return <p>Loading your courses…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  if (!Array.isArray(courses) || courses.length === 0) {
    return <p className="text-center">You're not enrolled in any courses yet.</p>
  }

  return (
    <CardList
      items={courses}
      cols={3}
      renderItem={(course) => (
        <ResourceCard
          key={course.id}
          to={`/portal/student/courses/${course.id}`}
          imageSrc={course.thumbnail || course.featured_image_url}
          title={course.title}
          description={course.description}
          onClick={() => onView(course.id)}
        />
      )}
    />
  )
}

EnrolledCoursesUI.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id:                 PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title:              PropTypes.string.isRequired,
      description:        PropTypes.string,
      thumbnail:          PropTypes.string,
      featured_image_url: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error:   PropTypes.any,
  onView:  PropTypes.func.isRequired,
}
