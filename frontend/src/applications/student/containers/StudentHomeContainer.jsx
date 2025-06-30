import React from 'react'
import StudentHomeUI from '../components/StudentHomeUI'
import useStudentHome from '../hooks/useStudentHome'

export default function StudentHomeContainer() {
  const { userProfile, courses, loading, error } = useStudentHome()
  return (
    <StudentHomeUI
      user={userProfile}
      courses={courses}
      loading={loading}
      error={error}
    />
  )
}