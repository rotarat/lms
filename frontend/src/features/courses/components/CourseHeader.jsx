import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export function CourseHeader({ course }) {
  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <img
          src={course.featured_image}
          className="img-fluid rounded"
          alt={course.title}
        />
      </div>
      <div className="col-md-8">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p className="fw-bold">
          Created by:{' '}
          <Link to={`/profile/${course.owner_username}`}>
            {course.owner_username}
          </Link>
        </p>
      </div>
    </div>
  )
}

CourseHeader.propTypes = {
  course: PropTypes.shape({
    title:            PropTypes.string.isRequired,
    description:      PropTypes.string,
    featured_image:   PropTypes.string,
    owner_username:   PropTypes.string.isRequired,
  }).isRequired,
}
