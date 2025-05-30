import React, { useState, useEffect } from 'react'
import { Link }                      from 'react-router-dom'
import { fetchCourses }              from '../api/courses'

// Replace with your actual backend origin if different:
const API_ORIGIN = process.env.REACT_APP_DJANGO_BACKEND_API_ENDPOINT || 'http://127.0.0.1:8000'

export default function AllCourses() {
  const [data,    setData]    = useState({ results: [], count:0, next:null, previous:null })
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchCourses({ page })
      .then(setData)
      .catch(err => setError(err.response?.data || 'Load failed'))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <p>Loading courses…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  const totalPages = Math.ceil(data.count / 12)

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Courses</h3>
      <div className="row">
        {data.results.map(c => {
          // ensure we have an absolute URL for the image:
          const imgUrl = c.featured_image.startsWith('http')
            ? c.featured_image
            : API_ORIGIN + c.featured_image

          return (
            <div key={c.id} className="col-md-3">
              <div className="card border-secondary mb-3">
                <Link to={`/courses/${c.id}`}>
                  <img
                    src={imgUrl}
                    className="card-img-top"
                    alt={c.title}
                  />
                </Link>
                <div className="card-body">
                  <h4 className="card-title">
                    <Link
                      to={`/courses/${c.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {c.title}
                    </Link>
                  </h4>
                  <p className="card-text">
                    {c.description?.slice(0, 80) ?? ''}
                    {c.description?.length > 80 ? '…' : ''}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${!data.previous ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(p=>Math.max(p-1,1))}>&laquo;</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(n)}>{n}</button>
            </li>
          ))}
          <li className={`page-item ${!data.next ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(p=>p+1)}>»</button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
