import { useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, Button } from 'react-bootstrap'
import { VideoDetailContainer } from '../containers/VideoDetailContainer'

export function VideoList({ videos }) {
  const [activeId, setActiveId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  if (!Array.isArray(videos) || videos.length === 0) return null

  const openVideo = (id) => {
    setActiveId(id)
    setShowModal(true)
  }

  const closeVideo = () => {
    setShowModal(false)
    setActiveId(null)
  }

  return (
    <>
      <h4>Course Videos</h4>
      <ListGroup className="mb-4">
        {videos.map((v) => (
          <ListGroup.Item
            key={v.id}
            className="d-flex justify-content-between align-items-center"
          >
            {v.title}
            <Button size="sm" onClick={() => openVideo(v.id)}>
              ▶ Play
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* 
        When showModal is true, render VideoDetailContainer in a popup.
        We pass overrideId={activeId} and onClose={closeVideo}.
      */}
      {showModal && (
        <VideoDetailContainer overrideId={activeId} onClose={closeVideo} />
      )}
    </>
  )
}

VideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
}
