import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllVideos } from '../api/videos'

export default function AllVideos() {
  const [videos, setVideos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetchAllVideos()
      .then(data => setVideos(data))
      .catch(err => setError(err.response?.data || 'Load failed'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading videos…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Videos</h3>
      <div className="row">
        {videos.map(v => (
          <div key={v.id} className="col-md-3 mb-4">
            <div className="card border-secondary h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{v.title}</h5>
                <p className="card-text flex-grow-1">
                  {v.description?.slice(0,60) ?? ''}
                  {v.description?.length>60 ? '…':''}
                </p>
                <Link to={`/videos/${v.id}`} className="btn btn-sm btn-primary mt-auto">
                  Watch
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
