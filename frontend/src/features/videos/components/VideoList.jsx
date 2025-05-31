import { useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, Button } from 'react-bootstrap'
import { VideoModal } from './VideoModal'

export function VideoList({ videos }) {
  const [active, setActive] = useState(null)

  if (videos.length === 0) return null

  return (
    <>
      <h4>Course Videos</h4>
      <ListGroup className="mb-4">
        {videos.map(v => (
          <ListGroup.Item
            key={v.id}
            className="d-flex justify-content-between align-items-center"
          >
            {v.title}
            <Button size="sm" onClick={() => setActive(v)}>
              ▶ Play
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <VideoModal
        video={active}
        show={!!active}
        onClose={() => setActive(null)}
      />
    </>
  )
}

VideoList.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.shape({
    id:         PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title:      PropTypes.string.isRequired,
    link:       PropTypes.string.isRequired,
    key_points: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
}
