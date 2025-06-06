import { useCourseDetail } from '../hooks/useCourseDetail'
import { CourseHeader }     from '../components/CourseHeader'
import { VideoList }        from '../../videos/components/VideoList'
import { PresentationList } from '../../presentations/components/PresentationList'
import { Button }           from '../../../shared/components/Button'

export default function CourseDetailPage({ courseId, onClose }) {
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

      {course.audio ? (
        <div className="mb-4">
          <h5>Automated Audio Lecture</h5>
          <audio
            controls
            style={{ width: '100%' }}
            src={course.audio}
          >
            Вашият браузър не поддържа елемента <code>audio</code>.
          </audio>
        </div>
      ) : (
        // optional: you could show “No audio yet”
        <div className="mb-4 text-muted">
          <em>No audio lecture available.</em>
        </div>
      )}

      <VideoList videos={videos} />
      <PresentationList presentations={presentations} />
    </>
  )
}
