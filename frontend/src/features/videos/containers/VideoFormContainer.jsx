import { useVideoForm } from '../hooks/useVideoForm'
import { VideoFormUI }  from '../components/VideoFormUI'

export function VideoFormContainer() {
  const {
    courses,
    form,
    loading,
    saving,
    error,
    confirmation,
    handleChange,
    handleSubmit
  } = useVideoForm()

  return (
    <VideoFormUI
      courses={courses}
      form={form}
      loading={loading}
      saving={saving}
      error={error}
      confirmation={confirmation}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}
