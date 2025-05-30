import React, { useContext, useEffect, useState } from 'react'
import { useNavigate }          from 'react-router-dom'
import Sidebar                  from './Sidebar'
import { AuthContext }          from '../../context/AuthContext'
import { fetchVideosByOwner, deleteVideo } from '../../api/videos'

export default function UserVideos() {
  const { profile } = useContext(AuthContext)
  const navigate    = useNavigate()
  const [videos, setVideos]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    fetchVideosByOwner(profile.username)
      .then(data => { setVideos(data); setError(null) })
      .catch(e => setError(e.response?.data || 'Failed to load videos'))
      .finally(() => setLoading(false))
  }, [profile])

  const handleDelete = async id => {
    if (!window.confirm('Really delete this video?')) return
    try {
      await deleteVideo(id)
      setVideos(vs => vs.filter(v => v.id !== id))
    } catch {
      alert('Delete failed, please try again.')
    }
  }

  const handleAddNew = () => {
    navigate('/videos/create')
  }

  if (!profile)  return <p>Loading…</p>
  if (loading)   return <p>Loading your videos…</p>
  if (error)     return <div className="alert alert-danger">{error}</div>

  return (
    <div className="container mt-4">
      <div className="row">
        <aside className="col-md-3"><Sidebar/></aside>
        <section className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">My Videos</h4>
            {profile.role === 'teacher' && (
              <button className="btn btn-primary" onClick={handleAddNew}>
                Add New
              </button>
            )}
          </div>

          {videos.length === 0
            ? <p>You have no videos yet.</p>
            : (
              <table className="table table-hover">
                <thead>
                  <tr><th>Title</th><th style={{width:150}}>Actions</th></tr>
                </thead>
                <tbody>
                  {videos.map(video => (
                    <tr key={video.id}>
                      <td>{video.title}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={()=>handleDelete(video.id)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </section>
      </div>
    </div>
  )
}
