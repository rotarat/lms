import { useState } from 'react'
import { useAllCourses }   from '../../../features/courses/hooks/useAllCourses'
import { CourseCard }      from '../../../features/courses/components/CourseCard'
import { CardList }            from '../../../shared/components/CardList'
import { PopupWindow }         from '../../../shared/components/PopupWindow'
import CourseDetailPage    from '../../../features/courses/pages/CourseDetailPage'

export default function AllCoursesPage() {
  const { courses, page, totalPages, setPage, loading, error } = useAllCourses()
  const [selectedId, setSelectedId] = useState(null)

  if (loading) return <p>Loading courses…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <>
      <h3 className="mb-3">All Courses</h3>
      <CardList
        items={courses}
        renderItem={c => <CourseCard key={c.id} course={c} onView={setSelectedId}/>}
        gridClassName="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4"
      />

      {/* pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page-1)}>&laquo;</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
            <li key={n} className={`page-item ${n===page?'active':''}`}>
              <button className="page-link" onClick={()=>setPage(n)}>{n}</button>
            </li>
          ))}
          <li className={`page-item ${page===totalPages?'disabled':''}`}>
            <button className="page-link" onClick={()=>setPage(page+1)}>»</button>
          </li>
        </ul>
      </nav>

      {/* Course detail popup */}
      <PopupWindow show={!!selectedId}>
        <CourseDetailPage 
          courseId={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      </PopupWindow>
    </>
  )
}
