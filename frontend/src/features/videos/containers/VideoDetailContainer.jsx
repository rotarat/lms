import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { questionsApi } from '../../../shared/api/resourses'
import { useVideoDetail } from '../hooks/useVideoDetail'
import { VideoDetailUI } from '../components/VideoDetailUI'
import { PopupWindow } from '../../../shared/components/PopupWindow'
import { Button, Spinner } from 'react-bootstrap'

export function VideoDetailContainer({ overrideId, onClose }) {
  // 1) Load the video first
  const { video, loading: loadingVideo, error: errorVideo } = useVideoDetail(overrideId)

  // 2) questions + loadingQuestions state
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [questionsError, setQuestionsError] = useState(null)

  // 3) answers correspond 1:1 to questions
  const [answers, setAnswers] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 4) When the video ID becomes available, fetch questions
  useEffect(() => {
    if (!video?.id) return

    setLoadingQuestions(true)
    setQuestionsError(null)

    // resource.list will GET /questions/?video_id=<id>
    questionsApi
      .list({ video_id: video.id })
      .then((listOfQuestionStrings) => {
        setQuestions(listOfQuestionStrings)
        setAnswers(listOfQuestionStrings.map(() => ''))
      })
      .catch((err) => {
        const msg = err.response?.data?.detail || err.response?.data || err.message
        setQuestionsError(msg || 'Failed to load questions.')
      })
      .finally(() => {
        setLoadingQuestions(false)
      })
  }, [video?.id])

  const allFilled = answers.every((ans) => ans.trim().length > 0)

  const handleAnswerChange = (idx, val) => {
    const next = [...answers]
    next[idx] = val
    setAnswers(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      // resource.create will POST /questions/ with payload
      await questionsApi.create({
        video_id: video.id,
        responses: questions.map((qText, idx) => ({
          question: qText,
          answer: answers[idx],
        })),
      })
      setIsSubmitted(true)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data ||
        err.message ||
        'Failed to submit answers.'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 5) After submission, show only “Thank you + Close”
  if (isSubmitted) {
    return (
      <PopupWindow show={true}>
        <div className="modal-header">
          <h5 className="modal-title">
            {loadingVideo ? 'Loading…' : errorVideo ? 'Error' : video.title}
          </h5>
        </div>

        <div className="modal-body text-center my-4">
          <h6>Thank you! Your answers have been saved.</h6>
        </div>

        <div className="modal-footer d-flex justify-content-center">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </PopupWindow>
    )
  }

  // 6) While video is loading, render that; otherwise show VideoDetailUI
  return (
    <PopupWindow show={true}>
      <div className="modal-header">
        <h5 className="modal-title">
          {loadingVideo ? 'Loading Video…' : errorVideo ? 'Error' : video.title}
        </h5>
      </div>

      <div className="modal-body">
        {loadingVideo && (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading…</span>
            </Spinner>
          </div>
        )}

        {errorVideo && (
          <div className="alert alert-danger">{JSON.stringify(errorVideo)}</div>
        )}

        {!loadingVideo && !errorVideo && (
          <VideoDetailUI
            video={video}
            loadingQuestions={loadingQuestions}
            questionsError={questionsError}
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            submitError={submitError}
            allFilled={allFilled}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* No footer here; VideoDetailUI handles Submit + any interim messages */}
    </PopupWindow>
  )
}

VideoDetailContainer.propTypes = {
  overrideId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}
