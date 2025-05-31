import { VideoDetailUI }    from '../components/VideoDetailUI'
import { useVideoDetail }   from '../hooks/useVideoDetail'
import { useParams }           from 'react-router-dom'

export function VideoDetailContainer({ overrideId }) {
  const { id: paramId } = useParams()
  const { video, loading, error } = useVideoDetail(overrideId ?? paramId)

  if (loading) return <p>Loading video…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return <VideoDetailUI video={video} />
}
