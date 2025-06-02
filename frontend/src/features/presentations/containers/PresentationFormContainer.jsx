import { usePresentationForm } from '../hooks/usePresentationForm'
import { PresentationFormUI } from '../components/PresentationFormUI'

export function PresentationFormContainer() {
  const {
    isEdit,
    form,
    courses,
    loading,
    saving,
    error,
    handleChange,
    setFile,
    handleSubmit
  } = usePresentationForm()

  return (
    <PresentationFormUI
      isEdit={isEdit}
      form={form}
      courses={courses}
      loading={loading}
      saving={saving}
      error={error}
      onChange={handleChange}
      onFileChange={setFile}
      onSubmit={handleSubmit}
    />
  )
}
