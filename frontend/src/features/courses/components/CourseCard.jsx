import PropTypes from 'prop-types'
import { ResourceCard } from '../../../shared/components/ResourceCard'
import { Button } from '../../../shared/components/Button'

export function CourseCard({ course, onView }) {
  return (
    <ResourceCard
      title={course.title}
      imageUrl={course.featured_image}
      description={course.description}
    >
      <Button
        variant="primary"
        onClick={() => onView(course.id)}
      >
        View
      </Button>
    </ResourceCard>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id:             PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
    title:          PropTypes.string.isRequired,
    featured_image: PropTypes.string,
    description:    PropTypes.string
  }).isRequired,
  onView: PropTypes.func.isRequired
}
