import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudentProjects } from '../hooks/useStudentProjects'
import StudentProjectsUI from '../components/StudentProjectsUI'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import ProjectDetailContainer from '../../../features/projects/containers/ProjectDetailContainer'

export default function StudentProjectsContainer() {
  const navigate = useNavigate()
  const { projects, loading, error } = useStudentProjects()

  // Group by course title
  const groupedByCourse = useMemo(() => {
    return projects.reduce((acc, proj) => {
      const course = proj.course_title || 'No Course'
      if (!acc[course]) acc[course] = []
      acc[course].push(proj)
      return acc
    }, {})
  }, [projects])

  // State to track which project is currently “viewed”
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  // Handler: when student clicks “Add New”
  const handleAddNew = () => {
    navigate('/portal/student/projects/create')
  }

  // Handler: when student clicks on a project title
  const handleView = (projectId) => {
    setSelectedProjectId(projectId)
  }

  // Handler: close the popup
  const handleClosePopup = () => {
    setSelectedProjectId(null)
  }

  return (
    <>
      <StudentProjectsUI
        groupedByCourse={groupedByCourse}
        loading={loading}
        error={error}
        onAddNew={handleAddNew}
        onView={handleView}
      />

      {selectedProjectId && (
        <PopupWindow show onClose={handleClosePopup}>
          <ProjectDetailContainer
            projectId={selectedProjectId}
            onClose={handleClosePopup}
          />
        </PopupWindow>
      )}
    </>
  )
}
