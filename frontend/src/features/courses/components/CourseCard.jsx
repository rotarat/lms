import PropTypes from 'prop-types'

export function CourseCard({ course, isEnrolled, onEnroll, onView }) {
  return (
    <div className="card h-100">
      <img
        src={course.featured_image_url}
        className="card-img-top"
        alt={course.title}
        onError={(e) => (e.target.style.display = 'none')}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text truncate">{course.description}</p>
        <div className="mt-auto d-flex justify-content-between">
          {isEnrolled ? (
            <button className="btn btn-secondary" disabled>
              Enrolled
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onEnroll}>
              Enroll
            </button>
          )}
          <button
            className="btn btn-info ms-2"
            onClick={onView}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id:                 PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title:              PropTypes.string.isRequired,
    description:        PropTypes.string,
    featured_image_url: PropTypes.string,
  }).isRequired,
  isEnrolled: PropTypes.bool.isRequired,
  onEnroll:   PropTypes.func.isRequired,
  onView:     PropTypes.func.isRequired,
}
