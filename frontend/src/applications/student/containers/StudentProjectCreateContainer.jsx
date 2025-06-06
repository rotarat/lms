import StudentProjectForm from '../components/StudentProjectForm'
import { useStudentProjectForm } from '../hooks/useStudentProjectForm'

export default function StudentProjectCreateContainer() {
  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    title,
    setTitle,
    description,
    setDescription,
    file,
    setFile,
    loadingCourses,
    errorCourses,
    submitting,
    submitError,
    handleSubmit,
  } = useStudentProjectForm()

  return (
    <StudentProjectForm
      courses={courses}
      selectedCourse={selectedCourse}
      onCourseChange={setSelectedCourse}
      title={title}
      onTitleChange={setTitle}
      description={description}
      onDescriptionChange={setDescription}
      file={file}
      onFileChange={setFile}
      loadingCourses={loadingCourses}
      errorCourses={errorCourses}
      submitting={submitting}
      submitError={submitError}
      onSubmit={handleSubmit}
    />
  )
}
