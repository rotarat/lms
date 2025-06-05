import PropTypes from 'prop-types'
import { Spinner, ProgressBar, Row, Col } from 'react-bootstrap'
import { PopupWindow } from '../../../shared/components/PopupWindow'

export function QuizUI({
  // ─── SETTINGS PROPS (unchanged) ────────────────────────────────────────────
  numQuestions,
  setNumQuestions,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  timeLimit,
  setTimeLimit,
  coursesList,

  // ─── QUIZ STATE PROPS ───────────────────────────────────────────────────────
  phase,
  questions,
  currentIdx,
  currentQuestion,
  answerOptions,
  score,
  selectedAns,
  showExp,
  reflectionPrompt,
  timeRem,
  progressRef,
  reflectionsList,

  // ─── POPUP CONTROL ──────────────────────────────────────────────────────────
  showPopup,
  onClosePopup,     // ← optional “close” handler if you want an X in the modal

  // ─── ACTIONS ───────────────────────────────────────────────────────────────
  startQuiz,
  handleAnswer,
  nextQ,
  resetToSettings
}) {
  // ────────────────────────────────────────────────────────────────────────────────
  // SETTINGS PHASE (no changes here)  
  // ────────────────────────────────────────────────────────────────────────────────
  if (phase === 'settings') {
    return (
      <div className="quiz-settings">
        <h2>Start New Quiz</h2>

        {/* … your existing “course”, “difficulty”, “numQuestions”, “timeLimit” controls */}
        <div className="form-group">
          <label htmlFor="courseSelect">Course:</label>
          <select
            id="courseSelect"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ color: 'black' }}
          >
            <option value="">-- Select a Course --</option>
            {coursesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficultySelect">Difficulty:</label>
          <select
            id="difficultySelect"
            className="form-control"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ color: 'black' }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numQuestionsInput">Number of Questions:</label>
          <input
            id="numQuestionsInput"
            type="number"
            className="form-control"
            min="1"
            max="50"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeLimitInput">Time per Question (sec):</label>
          <input
            id="timeLimitInput"
            type="number"
            className="form-control"
            min="5"
            max="120"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </div>

        <button className="btn btn-primary mt-3" onClick={startQuiz}>
          Start Quiz
        </button>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // LOADING PHASE (unchanged; still inside PopupWindow)  
  // ────────────────────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <PopupWindow show={showPopup} onClose={onClosePopup}>
        <div className="quiz-loading text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading…</span>
          </Spinner>
          <p className="mt-3">Preparing your first question…</p>
        </div>
      </PopupWindow>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // RUNNING PHASE (ONE QUESTION AT A TIME)  
  // (Here is where we make the requested changes)
  // ────────────────────────────────────────────────────────────────────────────────
  if (phase === 'running') {
    if (!currentQuestion) {
      return (
        <PopupWindow show={showPopup} onClose={onClosePopup}>
          <div className="alert alert-warning text-center">
            No question available. Please try restarting the quiz.
            <br />
            <button className="btn btn-secondary mt-2" onClick={resetToSettings}>
              Back to Settings
            </button>
          </div>
        </PopupWindow>
      )
    }

    const q = currentQuestion

    return (
      <PopupWindow show={showPopup} onClose={onClosePopup}>
        {/* ─── HEADER ROW: "Question X of Y" on left, "Score: Z" on right ───────────────── */}
        {/*
          We add px‐2 (horizontal padding) and py‐1 (vertical padding) so that
          neither text touches the very edge of the popup. 5px is roughly 0.3rem,
          so px‐2 ~ 0.5rem actually gives a little more breathing room—feel free to
          swap px‐1 if you want exactly ~5px.
        */}
        <Row className="mb-2 ">
          <Col className="">
            <strong>Question {currentIdx + 1} of {numQuestions}</strong>
          </Col>
          <Col>
            <strong>Score: {score}</strong>
          </Col>
        </Row>

        {/* ─── TIME REMAINING BAR (still just under the header) ────────────────────────── */}
        <div className="timer-container mb-3 px-2">
          <ProgressBar>
            <ProgressBar
              now={((timeRem || 0) / timeLimit) * 100}
              ref={progressRef}
              animated
            />
          </ProgressBar>
          <div className="text-center mt-1">
            Time Remaining: {timeRem} sec
          </div>
        </div>

        {/* ─── QUESTION TEXT (centered) ──────────────────────────────────────────────── */}
        <h4 className="text-center mb-4 px-2">
          {q.question || '(No question text)'}
        </h4>

        {/* ─── ANSWER BUTTONS (stacked vertically, each centered) ─────────────────────── */}
        {answerOptions.length > 0 ? (
          <div className="d-flex flex-column align-items-center mb-4 px-2">
            {answerOptions.map((ans, i) => {
              // Decide which bootstrap classes to apply to each button
              let cls = 'btn btn-outline-secondary answer-btn mb-2'
              if (selectedAns) {
                if (ans === selectedAns) {
                  cls =
                    ans === q.correct_answer
                      ? 'btn btn-success answer-btn mb-2'
                      : 'btn btn-danger answer-btn mb-2'
                } else if (ans === q.correct_answer) {
                  cls = 'btn btn-success answer-btn mb-2 disabled'
                } else {
                  cls = 'btn btn-outline-secondary answer-btn mb-2 disabled'
                }
              }

              return (
                <button
                  key={i}
                  className={cls + ' mx-auto'}
                  onClick={() => handleAnswer(ans)}
                  disabled={!!selectedAns || timeRem === 0}
                  style={{ width: '100%' /* optional—makes each button full width of the px‐2 container */ }}
                >
                  {ans}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="alert alert-info text-center mb-4 px-2">
            (No answer options were returned)
          </div>
        )}

        {/* ─── RATIONALE / EXPLANATION / REFLECTION (only if applicable) ──────────────── */}
        {selectedAns && selectedAns !== q.correct_answer && (
          <div className="alert alert-warning mb-3 px-2">
            {
              q.distractors_with_rationale
                ?.find(d => d.distractor === selectedAns)
                ?.rationale || '(No rationale provided)'
            }
          </div>
        )}
        {reflectionPrompt && (
          <div className="alert alert-info mb-3 px-2">
            {reflectionPrompt}
          </div>
        )}
        {showExp && selectedAns === q.correct_answer && (
          <div className="alert alert-success mb-3 px-2">
            {q.explanation || '(No explanation provided)'}
          </div>
        )}

        {/* ─── NEXT QUESTION BUTTON (only once explanation/rationale shows) ───────────────── */}
        {showExp && (
          <div className="text-center mb-1 px-2">
            <button className="btn btn-primary" onClick={nextQ}>
              Next Question
            </button>
          </div>
        )}
      </PopupWindow>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // FINISHED PHASE (no changes needed here—already centered content)  
  // ────────────────────────────────────────────────────────────────────────────────
  if (phase === 'finished') {
    const readyReflections = reflectionsList.filter(
      (item) => item.reflection_prompt && item.reflection_prompt.trim() !== ''
    )

    return (
      <PopupWindow show={showPopup} onClose={onClosePopup}>
        {readyReflections.length > 0 ? (
          <div className="mb-4 px-2">
            <h4>Reflect on these questions:</h4>
            {readyReflections.map((item, idx) => (
              <div key={idx} className="card mb-3 text-left">
                <div className="card-body">
                  <p>
                    <strong>Question:</strong> {item.question}
                  </p>
                  <p>
                    <strong>Reflection:</strong> {item.reflection_prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-4 text-muted px-2">No reflections were generated yet.</p>
        )}

        <h2 className="text-center mb-3 px-2">Quiz Complete!</h2>
        <p className="mt-1 text-center px-2">
          Final Score: {score} / {questions.length}
        </p>

        <div className="text-center mt-4 px-2 mb-2">
          <button className="btn btn-secondary" onClick={resetToSettings}>
            New Quiz
          </button>
        </div>
      </PopupWindow>
    )
  }

  return null
}

QuizUI.propTypes = {
  // Settings
  numQuestions: PropTypes.number.isRequired,
  setNumQuestions: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  timeLimit: PropTypes.number.isRequired,
  setTimeLimit: PropTypes.func.isRequired,
  coursesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,

  // Quiz flow
  phase: PropTypes.oneOf(['settings', 'loading', 'running', 'finished'])
    .isRequired,
  questions: PropTypes.array.isRequired,
  currentIdx: PropTypes.number.isRequired,
  currentQuestion: PropTypes.shape({
    question: PropTypes.string,
    correct_answer: PropTypes.string,
    distractors_with_rationale: PropTypes.arrayOf(
      PropTypes.shape({
        distractor: PropTypes.string,
        rationale: PropTypes.string
      })
    ),
    explanation: PropTypes.string
  }),
  answerOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  score: PropTypes.number.isRequired,
  selectedAns: PropTypes.string,
  showExp: PropTypes.bool.isRequired,
  reflectionPrompt: PropTypes.string.isRequired,
  timeRem: PropTypes.number.isRequired,
  progressRef: PropTypes.object.isRequired,
  reflectionsList: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      reflection_prompt: PropTypes.string.isRequired
    })
  ).isRequired,

  // Popup control
  showPopup: PropTypes.bool.isRequired,
  onClosePopup: PropTypes.func,

  // Actions
  startQuiz: PropTypes.func.isRequired,
  handleAnswer: PropTypes.func.isRequired,
  nextQ: PropTypes.func.isRequired,
  resetToSettings: PropTypes.func.isRequired
}
