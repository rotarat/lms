import PropTypes from 'prop-types'
import { toYouTubeEmbed } from '../../../services/prepare_video'

export function VideoDetailUI({ video }) {
  return (
    <div className="container mt-4">
      <h2>{video.title}</h2>

      <div className="ratio ratio-16x9 mb-3">
        <iframe
          src={toYouTubeEmbed(video.link)}
          title={video.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {video.description && <p>{video.description}</p>}

      {video.key_points?.length > 0 && (
        <>
          <h5>Key Points</h5>
          <ul>
            {video.key_points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

VideoDetailUI.propTypes = {
  video: PropTypes.shape({
    title:      PropTypes.string.isRequired,
    link:       PropTypes.string.isRequired,
    description: PropTypes.string,
    key_points: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
}
