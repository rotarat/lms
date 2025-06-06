import { useProjectDetail } from '../hooks/useProjectDetail'
import ProjectDetailUI from '../components/ProjectDetailUI'

export default function ProjectDetailContainer({ projectId, onClose }) {
  const { project, loading, error } = useProjectDetail(projectId)

  if (loading) {
    return <p className="p-4 text-center">Loading…</p>
  }
  if (error) {
    return (
      <div className="alert alert-danger p-3">
        Error loading project: {JSON.stringify(error)}
      </div>
    )
  }

  return <ProjectDetailUI project={project} onClose={onClose} />
}
