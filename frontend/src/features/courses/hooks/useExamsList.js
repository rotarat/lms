import { useState, useEffect } from 'react'
import { resources } from '../../../shared/api/resources'
import { useAuth } from '../../../shared/hooks/useAuth'

export function useExamsList() {
  const { profile } = useAuth()
  const [exams, setExams] = useState([])
  useEffect(()=>{
    if(!profile) return
    resources.exams.list({ course__in: profile.enrolledCourses })
      .then(data=>setExams(data.results||data))
  },[profile])
  return exams
}
