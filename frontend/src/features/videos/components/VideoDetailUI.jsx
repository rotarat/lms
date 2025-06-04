import PropTypes from 'prop-types'
import { toYouTubeEmbed } from '../../../services/prepare_video'
import { Form, Alert } from 'react-bootstrap'
import { LoadingButton } from '../../../shared/components/LoadingButton'

export function VideoDetailUI({
  video,
  loadingQuestions,
  questionsError,
  questions,
  answers,
  onAnswerChange,
  onSubmit,
  submitError,
  allFilled,
  isSubmitting,
}) {
  return (
    <div>
      <div className="ratio ratio-16x9 mb-3">
        <iframe
          src={toYouTubeEmbed(video.link)}
          title={video.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {video.description && <p>{video.description}</p>}

      {/* Show “Preparing personalized questions…” or error, or the form */}
      {loadingQuestions && (
        <p className="text-center text-muted">Preparing personalized questions…</p>
      )}

      {questionsError && (
        <Alert variant="danger">{questionsError}</Alert>
      )}

      {!loadingQuestions && !questionsError && questions.length > 0 && (
        <Form onSubmit={onSubmit}>
          {questions.map((qText, idx) => (
            <Form.Group className="mb-3 mt-4" controlId={`openQuestion${idx}`} key={idx}>
              <Form.Label>
                <h6>{qText}</h6>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={answers[idx] || ''}
                onChange={(e) => onAnswerChange(idx, e.target.value)}
                placeholder="Type your answer here…"
              />
            </Form.Group>
          ))}

          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <div className="text-center">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={!allFilled || isSubmitting}
              loading={isSubmitting}
              loadingLabel="Submitting..."
            >
              Submit Answers
            </LoadingButton>
          </div>
        </Form>
      )}

      {!loadingQuestions && !questionsError && questions.length === 0 && (
        <p className="text-center text-muted">No questions available.</p>
      )}
    </div>
  )
}

VideoDetailUI.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,

  loadingQuestions: PropTypes.bool.isRequired,
  questionsError: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitError: PropTypes.string,
  allFilled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
}
