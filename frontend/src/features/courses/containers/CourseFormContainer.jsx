import { useCourseForm } from '../hooks/useCourseForm'
import { CourseFormUI }  from '../components/CourseFormUI'

export default function CourseFormPage() {
  const {
    isEdit,
    title,
    setTitle,
    description,
    setDescription,
    featuredImage,
    setFeaturedImage,
    loading,
    error,
    handleSubmit,
  } = useCourseForm()

  return (
    <CourseFormUI
      isEdit={isEdit}
      title={title}
      onTitleChange={setTitle}
      description={description}
      onDescriptionChange={setDescription}
      featuredImage={featuredImage}
      onFileChange={setFeaturedImage}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  )
}
