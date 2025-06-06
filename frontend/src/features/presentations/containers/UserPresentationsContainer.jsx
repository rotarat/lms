import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPresentations } from '../hooks/useUserPresentations'
import { UserPresentationsUI } from '../components/UserPresentationsUI'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import { PresentationDetailUI } from '../components/PresentationDetailUI'
import { presentationsApi } from '../../../shared/api/resourses'

export function UserPresentationsContainer() {
  const navigate = useNavigate()
  const { presentations, loading, error, deletePresentation } = useUserPresentations()

  const [selectedId, setSelectedId] = useState(null)
  const [currentPresentation, setCurrentPresentation] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const handleAddNew = () => {
    navigate('/portal/teacher/presentations/create')
  }

  const handleEdit = (id) => {
    navigate(`/portal/teacher/presentations/${id}/edit`)
  }

  const handleCreateVideo = (title, course) => {
    navigate(`/portal/teacher/videos/create?title=${encodeURIComponent(title)}&course=${course}`)
  }

  // When the teacher clicks “View”, fetch that one presentation
  const handleView = async (id) => {
    setSelectedId(id)
    setDetailLoading(true)
    setDetailError(null)

    try {
      const data = await presentationsApi.get(id)
      setCurrentPresentation(data)
    } catch (err) {
      setDetailError(err.response?.data || err.message)
      setCurrentPresentation(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedId(null)
    setCurrentPresentation(null)
    setDetailError(null)
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
          {detailLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
              <div className="mt-2">Loading presentation…</div>
            </div>
          ) : detailError ? (
            <div className="alert alert-danger m-3">
              <strong>Error loading presentation:</strong> {JSON.stringify(detailError)}
              <div className="mt-2">
                <button className="btn btn-secondary btn-sm" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          ) : currentPresentation ? (
            <PresentationDetailUI
              presentation={currentPresentation}
              onClose={closeModal}
            />
          ) : null}
        </PopupWindow>
      )}
    </>
  )
}
