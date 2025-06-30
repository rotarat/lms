import { useParams, useNavigate } from 'react-router-dom'
import ProjectDetailContainer from '../containers/ProjectDetailContainer'

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <ProjectDetailContainer
        projectId={projectId}
        onClose={() => navigate(-1)}
      />
    </div>
  )
}
