import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { AuthContext } from '../../context/AuthContext'
import { fetchByOwner, deleteCourse } from '../../api/courses'

export default function UserCourses() {
  const { profile }      = useContext(AuthContext)
  const navigate         = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    fetchByOwner(profile.username)
      .then(data => {
        setCourses(data)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data || 'Failed to load courses')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [profile])

  const handleDelete = async id => {
    if (!window.confirm('Really delete this course?')) return
    try {
      await deleteCourse(id)
      setCourses(cs => cs.filter(c => c.id !== id))
    } catch {
      alert('Delete failed, please try again.')
    }
  }

  const handleEdit = id => {
    navigate(`/courses/${id}/edit`)
  }

  // ** NEW **
  const handleAddNew = () => {
    navigate('/courses/create')
  }

  if (!profile)  return <p>Loading profile…</p>
  if (loading)   return <p>Loading your courses…</p>
  if (error)     return <div className="alert alert-danger">{error}</div>

  return (
    <div className="container mt-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">My Courses</h4>
            {/* Add New button in the top-right */}
            <button
              className="btn btn-primary"
              onClick={handleAddNew}
            >
              Add New
            </button>
          </div>

          {courses.length === 0 ? (
            <p>You have no courses yet.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr><th>Name</th><th style={{ width:'150px' }}>Actions</th></tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handleEdit(course.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(course.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </section>
      </div>
    </div>
  )
}
