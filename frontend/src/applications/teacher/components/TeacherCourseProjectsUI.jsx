import PropTypes from 'prop-types'
import { Button, Spinner, Alert } from 'react-bootstrap'
import { CardList } from '../../../shared/components/CardList'
import ProjectCard from '../../../features/projects/components/ProjectCard'

export default function TeacherCourseProjectsUI({
  projects,
  loading,
  error,
  onView,
  onAddGrade,
  onBack,
}) {
  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <strong>Error loading projects:</strong> {JSON.stringify(error)}
      </Alert>
    )
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Submitted Projects</h3>
        <Button variant="secondary" onClick={onBack}>
          Back to Course
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-center">No projects submitted for this course.</p>
      ) : (
        <CardList
          items={projects}
          cols={3}
          renderItem={(project) => (
            <ProjectCard
              project={project}
              onView={() => onView(project.id)}
              onAddGrade={() => onAddGrade(project.id)}
            />
          )}
        />
      )}
    </div>
  )
}

TeacherCourseProjectsUI.propTypes = {
  projects:    PropTypes.array.isRequired,
  loading:     PropTypes.bool.isRequired,
  error:       PropTypes.any,
  onView:      PropTypes.func.isRequired,
  onAddGrade:  PropTypes.func.isRequired,
  onBack:      PropTypes.func.isRequired,
}
