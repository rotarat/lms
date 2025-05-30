import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link }                from 'react-router-dom'
import { fetchProfile }                   from '../../api/profile'
import * as courseApi                     from '../../api/courses'
import * as presentationApi               from '../../api/presentations'
import * as videoApi                      from '../../api/videos'
import { AuthContext }                    from '../../context/AuthContext'

export default function Profile() {
  const { profile: me } = useContext(AuthContext)
  const { username }    = useParams()

  const [profile, setProfile]         = useState(null)
  const [courses, setCourses]         = useState([])
  const [presentations, setPresentations] = useState([])
  const [videos, setVideos]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const prof = await fetchProfile(username)
        setProfile(prof)

        const [ crs, pres, vids ] = await Promise.all([
          courseApi.fetchByOwner(username),
          presentationApi.fetchPresentationsByOwner(username),
          videoApi.fetchVideosByOwner(username),
        ])
        setCourses(crs)
        setPresentations(pres)
        setVideos(vids)
      } catch (err) {
        setError(err.response?.data || 'Could not load profile')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [username])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading profile…</span>
        </div>
      </div>
    )
  }
  if (error) {
    return <div className="alert alert-danger mt-4">{JSON.stringify(error)}</div>
  }

  const picUrl = profile.profile_pic || '/static/default-avatar.png'

  return (
    <div className="container mt-3">
      <div className="row">
        {/* Avatar & bio */}
        <div className="col-md-4 text-center">
          <img
            src={picUrl}
            className="img-fluid rounded-circle mb-3"
            alt={`${profile.username}'s avatar`}
            style={{ maxWidth: '200px' }}
          />
          <h4>{profile.first_name} {profile.last_name}</h4>
          <p className="text-muted">@{profile.username}</p>
          <p>{profile.bio}</p>
        </div>

        {/* Right: lists */}
        <div className="col-md-8">
          {/* Videos */}
          <h5 className="mb-2">Created videos</h5>
          <ul className="list-group mb-4">
            {videos.length
              ? videos.map(v => (
                  <li
                    key={v.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {v.title}
                    <Link
                      to={`/videos/${v.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Watch
                    </Link>
                  </li>
                ))
              : <li className="list-group-item">No videos yet.</li>
            }
          </ul>

          {/* Courses */}
          <h5 className="mb-2">Created courses</h5>
          <ul className="list-group mb-4">
            {courses.length
              ? courses.map(c => (
                  <li
                    key={c.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {c.title}
                    <Link
                      to={`/courses/${c.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                  </li>
                ))
              : <li className="list-group-item">No courses yet.</li>
            }
          </ul>

          {/* Presentations */}
          <h5 className="mb-2">Created presentations</h5>
          <ul className="list-group">
            {presentations.length
              ? presentations.map(p => (
                  <li
                    key={p.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {p.title}
                    <Link
                      to={`/presentations/${p.id}`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Preview
                    </Link>
                  </li>
                ))
              : <li className="list-group-item">No presentations yet.</li>
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
