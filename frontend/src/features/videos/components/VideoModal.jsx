import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { toYouTubeEmbed } from '../../../services/prepare_video'

export function VideoModal({ video, show, onClose }) {
  if (!video) return null

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{video.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={toYouTubeEmbed(video.link)}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

VideoModal.propTypes = {
  video: PropTypes.shape({
    title:      PropTypes.string.isRequired,
    link:       PropTypes.string.isRequired,
  }),
  show:  PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
