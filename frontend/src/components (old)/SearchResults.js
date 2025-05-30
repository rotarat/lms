import React, { useState, useEffect } from 'react'
import { useSearchParams, Link }      from 'react-router-dom'
import {
  searchCourses,
  searchVideos,
  searchPresentations,
  searchProfiles,
} from '../api/search'

export default function SearchResults() {
  const [params]       = useSearchParams()
  const q              = params.get('q') || ''
  const [page, setPage]= useState(1)

  // Courses (paginated)
  const [courses, setCourses]         = useState([])
  const [courseCount, setCourseCount] = useState(0)

  // Videos, Presentations, Profiles (first page only)
  const [videos, setVideos]             = useState([])
  const [presentations, setPresentations]= useState([])
  const [profiles, setProfiles]         = useState([])

  useEffect(() => {
    // 1) Courses
    searchCourses({ page, search: q })
      .then(data => {
        setCourses(data.results)
        setCourseCount(data.count)
      })

    // 2) Videos
    searchVideos({ search: q })
      .then(data => setVideos(data.results))

    // 3) Presentations
    searchPresentations({ search: q })
      .then(data => setPresentations(data.results))

    // 4) Profiles
    searchProfiles({ search: q })
      .then(data => setProfiles(data.results))

  }, [q, page])

  const totalPages = Math.ceil(courseCount / 10)

  return (
    <div className="container mt-4">
      <h3>
        {q
          ? <>Search results for “<strong>{q}</strong>”</>
          : 'All results'}
      </h3>

      {/* Courses */}
      {courseCount > 0 && (
        <>
          <h4 className="mt-4">Courses</h4>
          <div className="row">
            {courses.map(c => (
              <div key={c.id} className="col-md-3 mb-4">
                <div className="card h-100 border-secondary">
                  <Link to={`/courses/${c.id}`}>
                    <img
                      src={c.featured_image}
                      className="card-img-top"
                      alt={c.title}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <Link
                        to={`/courses/${c.id}`}
                        className="text-decoration-none text-dark"
                      >
                        {c.title}
                      </Link>
                    </h5>
                    <p className="card-text flex-grow-1">
                      {c.description?.slice(0, 60) ?? ''}
                      {c.description?.length > 60 ? '…' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* pagination */}
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                &laquo;
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                page === totalPages ? 'disabled' : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <>
          <h4 className="mt-5">Videos</h4>
          <div className="row">
            {videos.map(v => (
              <div key={v.id} className="col-md-3 mb-4">
                <div className="card h-100 border-secondary">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{v.title}</h5>
                    <p className="card-text flex-grow-1">
                      {v.description?.slice(0, 60) ?? ''}
                      {v.description?.length > 60 ? '…' : ''}
                    </p>
                    <Link
                      to={`/videos/${v.id}`}
                      className="btn btn-sm btn-primary mt-auto"
                    >
                      View Video
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Presentations */}
      {presentations.length > 0 && (
        <>
          <h4 className="mt-5">Presentations</h4>
          <div className="row">
            {presentations.map(p => (
              <div key={p.id} className="col-md-3 mb-4">
                <div className="card h-100 border-secondary">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.title}</h5>
                    <p className="card-text flex-grow-1">
                      {p.description?.slice(0, 60) ?? ''}
                      {p.description?.length > 60 ? '…' : ''}
                    </p>
                    <Link
                      to={`/presentations/${p.id}`}
                      className="btn btn-sm btn-primary mt-auto"
                    >
                      View Presentation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Profiles */}
      {profiles.length > 0 && (
        <>
          <h4 className="mt-5">Profiles</h4>
          <div className="row">
            {profiles.map(u => (
              <div key={u.id} className="col-md-3 mb-4">
                <div className="card h-100 border-secondary">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">@{u.username}</h5>
                    <p className="card-text flex-grow-1">
                      {u.bio?.slice(0, 60) ?? ''}{u.bio?.length > 60 ? '…' : ''}
                    </p>
                    <Link
                      to={`/user/profile/${u.username}`}
                      className="btn btn-sm btn-primary mt-auto"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
