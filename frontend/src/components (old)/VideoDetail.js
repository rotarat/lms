import React, { useState, useEffect } from 'react'
import { useParams }                   from 'react-router-dom'
import { fetchVideoById }              from '../api/videos'
import { toYouTubeEmbed }              from '../services/prepare_video'

export default function VideoDetail() {
  const { id }           = useParams()
  const [video, setVideo]= useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetchVideoById(id)
      .then(v => setVideo(v))
      .catch(err => setError(err.response?.data || 'Load failed'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <div className="container mt-4">
      <h2>{video.title}</h2>
      <div className="ratio ratio-16x9 mb-3">
        <iframe
          src={toYouTubeEmbed(video.link)}
          title={video.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {video.description && <p>{video.description}</p>}
      {video.key_points?.length > 0 && (
        <>
          <h5>Key Points</h5>
          <ul>
            {video.key_points.map((pt,i) => <li key={i}>{pt}</li>)}
          </ul>
        </>
      )}
    </div>
  )
}
