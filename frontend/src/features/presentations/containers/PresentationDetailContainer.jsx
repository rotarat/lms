import { PresentationDetailUI } from '../components/PresentationDetailUI'
import { usePresentationDetail } from '../hooks/usePresentationDetail'
import { useParams }          from 'react-router-dom'

export function PresentationDetailContainer({ overrideId }) {
  const { id: paramId } = useParams()
  const idToUse = overrideId ?? paramId
  const { presentation, loading, error } = usePresentationDetail(idToUse)

  if (loading) return <p>Loading presentation…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return <PresentationDetailUI presentation={presentation} />
}
