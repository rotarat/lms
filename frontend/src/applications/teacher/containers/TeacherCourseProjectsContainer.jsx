import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeacherCourseProjects } from '../hooks/useTeacherCourseProjects'
import TeacherCourseProjectsUI from '../components/TeacherCourseProjectsUI'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import ProjectDetailContainer from '../../../features/projects/containers/ProjectDetailContainer'
import TeacherProjectFormContainer from '../containers/TeacherProjectFormContainer'

export default function TeacherCourseProjectsContainer() {
  const navigate = useNavigate()
  const { projects, loading, error } = useTeacherCourseProjects()

  // track currently viewing (detail) and grading (form)
  const [viewId, setViewId] = useState(null)
  const [gradeId, setGradeId] = useState(null)

  const handleView = (id) => setViewId(id)
  const handleAddGrade = (id) => setGradeId(id)
  const handleBack = () => navigate(-1)

  return (
    <>
      <TeacherCourseProjectsUI
        projects={projects}
        loading={loading}
        error={error}
        onView={handleView}
        onAddGrade={handleAddGrade}
        onBack={handleBack}
      />

      {/* Detail modal */}
      {viewId && (
        <PopupWindow show onClose={() => setViewId(null)}>
          <ProjectDetailContainer
            projectId={viewId}
            onClose={() => setViewId(null)}
          />
        </PopupWindow>
      )}

      {/* Grade modal */}
      {gradeId && (
        <PopupWindow show onClose={() => setGradeId(null)}>
          <TeacherProjectFormContainer
            projectId={gradeId}
            onClose={() => setGradeId(null)}
          />
        </PopupWindow>
      )}
    </>
  )
}
