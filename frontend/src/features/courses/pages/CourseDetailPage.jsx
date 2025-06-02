import { useCourseDetail } from '../hooks/useCourseDetail'
import { CourseHeader }    from '../components/CourseHeader'
import { VideoList }       from '../../videos/components/VideoList'
import { PresentationList } from '../../presentations/components/PresentationList'
import { Button }          from '../../../shared/components/Button'

export default function CourseDetailPage({ courseId, onClose }) {
  // if courseId comes via prop (in popup) or from URL
  const hook = useCourseDetail()
  const { course, videos, presentations, loading, error } = hook

  if (loading) return <p>Loading…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <>
      {/* if rendered inside a PopupWindow, show a Close button */}
      {onClose && (
        <div className="mb-3 text-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      )}

      <CourseHeader course={course} />
      <VideoList videos={videos} />
      <PresentationList presentations={presentations} />
    </>
  )
}
