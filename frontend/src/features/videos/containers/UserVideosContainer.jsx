import { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '../../../shared/hooks/useAuth'
import { useUserVideos }    from '../hooks/useUserVideos'
import { UserVideosUI }     from '../components/UserVideosUI'
import { PopupWindow }          from '../../../shared/components/PopupWindow'
import TeacherVideosPage      from '../../../applications/teacher/pages/TeacherVideosPage'

export function UserVideosContainer() {
  const { profile } = useAuth()
  const navigate    = useNavigate()
  const { videos, loading, error, deleteVideo } = useUserVideos()

  const [selectedId, setSelectedId] = useState(null)

  const handleAddNew = () =>
    navigate(`/portal/${profile.role}/videos/create`)

  const handleView = id => {
    setSelectedId(id)
  }

  const closeModal = () => {
    setSelectedId(null)
  }

  return (
    <>
      <UserVideosUI
        videos={videos}
        loading={loading}
        error={error}
        canAdd={profile.role === 'teacher'}
        onAddNew={handleAddNew}
        onDelete={deleteVideo}
        onView={handleView}
      />

      {selectedId && (
        <PopupWindow show onClose={closeModal}>
          <TeacherVideosPage overrideId={selectedId} />
        </PopupWindow>
      )}
    </>
  )
}
