import PropTypes from 'prop-types'
import { CardList } from '../../../shared/components/CardList'
import { CourseCard } from './CourseCard'

export default function AllCoursesUI({
  courses,
  page,
  totalPages,
  setPage,
  loading,
  error,
  enrolledCourseIds,
  onEnroll,
}) {
  if (loading) return <p>Loading courses…</p>
  if (error) return <div className="alert alert-danger">{error.message || JSON.stringify(error)}</div>

  if (!courses || courses.length === 0) {
    return <p className="text-center">No available courses to enroll in.</p>
  }

  return (
    <>
      <h3 className="mb-3">All Courses</h3>
      <CardList
        items={courses}
        renderItem={(course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={enrolledCourseIds.includes(course.id)}
            onEnroll={() => onEnroll(course.id)}
          />
        )}
        gridClassName="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4"
      />

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(n)}>
                {n}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              »
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

AllCoursesUI.propTypes = {
  courses:           PropTypes.array.isRequired,
  page:              PropTypes.number.isRequired,
  totalPages:        PropTypes.number.isRequired,
  setPage:           PropTypes.func.isRequired,
  loading:           PropTypes.bool.isRequired,
  error:             PropTypes.any,
  enrolledCourseIds: PropTypes.array.isRequired,
  onEnroll:          PropTypes.func.isRequired,
}
