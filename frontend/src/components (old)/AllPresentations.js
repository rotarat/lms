import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPresentations } from '../api/presentations'

export default function AllPresentations() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetchAllPresentations()
      .then(data => setItems(data))
      .catch(err => setError(err.response?.data || 'Load failed'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading presentations…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Presentations</h3>
      <div className="row">
        {items.map(p => (
          <div key={p.id} className="col-md-3 mb-4">
            <div className="card border-secondary h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text flex-grow-1">
                  {p.description?.slice(0,60) ?? ''}
                  {p.description?.length>60 ? '…':''}
                </p>
                <Link
                  to={`/presentations/${p.id}`}
                  className="btn btn-sm btn-primary mt-auto"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
