import { useParams, useNavigate  } from 'react-router-dom'
import ProjectDetailContainer from '../../../features/projects/containers/ProjectDetailContainer'

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  // onClose could redirect back, but if this is a full page, you might not need it.
  // For now, pass a no-op or window.history.back.
  return <ProjectDetailContainer projectId={projectId} onClose={() => navigate(-1)} />
}
