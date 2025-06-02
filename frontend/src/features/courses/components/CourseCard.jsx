import { Link } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";

export function CourseCard({ course }) {
  const { profile } = useAuth();

  return (
    <div className="card h-100">
      <Link to={`/portal/${profile.role}/courses/${course.id}`}>
        <img
          src={course.featured_image_url} 
          className="card-img-top"
          alt={course.title}
          onError={(e) => (e.target.style.display = "none")}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link to={`/portal/${profile.role}/courses/${course.id}`} className="text-decoration-none">
            {course.title}
          </Link>
        </h5>
        <p className="card-text truncate">{course.description}</p>
        <Link
          to={`/portal/${profile.role}/courses/${course.id}`}
          className="btn btn-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
