import { useState } from 'react'
import { useNavigate }             from 'react-router-dom'
import { useUserPresentations }    from '../hooks/useUserPresentations'
import { UserPresentationsUI }     from '../components/UserPresentationsUI'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import TeacherPresentationsPage from '../../../applications/teacher/pages/TeacherPresentationsPage'

export function UserPresentationsContainer() {
  const navigate = useNavigate()
  const {
    presentations,
    loading,
    error,
    deletePresentation
  } = useUserPresentations()

  const [selectedId, setSelectedId] = useState(null)

  const handleAddNew = () =>
    navigate('/portal/teacher/presentations/create')

  const handleEdit = id =>
    navigate(`/portal/teacher/presentations/${id}/edit`)

  const handleCreateVideo = (title, course) =>
    navigate(`/portal/teacher/videos/create?title=${encodeURIComponent(title)}&course=${course}`)

  const handleView = id => {
    setSelectedId(id)
  }

  const closeModal = () => {
    setSelectedId(null)
  }

  return (
    <>
      <UserPresentationsUI
        presentations={presentations}
        loading={loading}
        error={error}
        onAddNew={handleAddNew}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={deletePresentation}
        onCreateVideo={handleCreateVideo}
      />

      {selectedId && (
        <PopupWindow show onClose={closeModal}>
          <TeacherPresentationsPage overrideId={selectedId} />
        </PopupWindow>
      )}
    </>
  )
}
