import React, { useState, useEffect } from 'react'
import { useParams, Link }           from 'react-router-dom'
import { fetchCourseById }           from '../api/courses'
import { fetchVideosByCourse }       from '../api/videos'
import { fetchPresentationsByCourse } from '../api/presentations'
import { toYouTubeEmbed }            from '../services/prepare_video'

export default function CoursePage() {
  const { course_id } = useParams()
  const [course, setCourse]               = useState(null)
  const [videos, setVideos]               = useState([])
  const [presentations, setPresentations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [activeVideo, setActiveVideo]     = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchCourseById(course_id),
      fetchVideosByCourse(course_id),
      fetchPresentationsByCourse(course_id),
    ])
      .then(([c, vs, ps]) => {
        setCourse(c)
        setVideos(vs)
        setPresentations(ps)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || 'Load failed')
      })
      .finally(() => setLoading(false))
  }, [course_id])

  if (loading) return <p>Loading…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-4">
          <img
            src={course.featured_image}
            className="img-fluid rounded"
            alt={course.title}
          />
        </div>
        <div className="col-md-8">
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p className="fw-bold">
            Created by:{' '}
            <Link to={`/user/profile/${course.owner_username}`}>
              {course.owner_username}
            </Link>
          </p>
        </div>
      </div>

      {/* Videos */}
      {videos.length > 0 && (
        <>
          <h4>Course Videos</h4>
          <ul className="list-group mb-4">
            {videos.map(v => (
              <li
                key={v.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {v.title}
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setActiveVideo(v)}
                >
                  ▶ Play
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{activeVideo.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActiveVideo(null)}
                />
              </div>
              <div className="modal-body">
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={toYouTubeEmbed(activeVideo.link)}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h6>Key Points</h6>
                <ul>
                  {activeVideo.key_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presentations */}
      {presentations.length > 0 && (
        <>
          <h4 className="mt-5">Course Presentations</h4>
          <ul className="list-group mb-5">
            {presentations.map(p => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <Link to={p.file}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
