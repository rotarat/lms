import { useState } from 'react'
import { useEnrolledExamsData } from '../../../features/courses/hooks/useEnrolledExamsData'
import { ExamCard }               from '../../../features/courses/components/ExamCard'
import { FinishedExamTable }      from '../../../features/courses/components/FinishedExamTable'
import { ExamTakeContainer }  from '../../../features/courses/containers/ExamTakeContainer'

export default function ExamsPage() {
  const { upcoming, finished, loading } = useEnrolledExamsData()
  const [activeExam, setActiveExam] = useState(null)

  if (loading) return <div>Loading exams…</div>

  return (
    <>
      <h2>Upcoming Exams</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {upcoming.map(e => (
          <div className="col" key={e.id}>
            <ExamCard exam={e} onStart={setActiveExam} />
          </div>
        ))}
      </div>

      <h2 className="mt-5">Finished Exams</h2>
      <FinishedExamTable exams={finished} />

      <ExamTakeContainer
       show={!!activeExam}
       examId={activeExam}
       onClose={()=>setActiveExam(null)}
     />
    </>
  )
}
