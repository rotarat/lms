import PropTypes from 'prop-types'
import './Quiz.css'

export function QuizUI({
  // settings
  numQuestions,
  setNumQuestions,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  timeLimit,
  setTimeLimit,
  coursesList,

  // quiz
  phase,
  questions,
  currentIdx,
  score,
  selectedAns,
  showExp,
  timeRem,
  answers,
  progressRef,

  // actions
  startQuiz,
  handleAnswer,
  nextQ,
  resetToSettings
}) {
  if (phase === 'settings') {
    return (
      <div className="containerquizz">
        <form onSubmit={startQuiz} className="settings">
          <h1 className="heading">Quiz App</h1>

          <label className="form-label">Number of Questions</label>
          <select
            className="form-select mb-3"
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
          >
            {[4,5,8].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <label className="form-label">Category</label>
          <select
            className="form-select mb-3"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {coursesList.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <label className="form-label">Difficulty</label>
          <select
            className="form-select mb-3"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            {['easy','medium','hard'].map(d => (
              <option key={d} value={d}>
                {d[0].toUpperCase()+d.slice(1)}
              </option>
            ))}
          </select>

          <label className="form-label">Time per Question</label>
          <select
            className="form-select mb-4"
            value={timeLimit}
            onChange={e => setTimeLimit(Number(e.target.value))}
          >
            {[15,30,60].map(t => (
              <option key={t} value={t}>{t}s</option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary w-100">
            Start Quiz
          </button>
        </form>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="containerquizz d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    )
  }

  if (phase === 'running') {
    const q = questions[currentIdx]
    return (
      <div className="containerquizz">
        <div className="timer mb-2">
          <div className="progress">
            <div
              ref={progressRef}
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: '100%' }}
            >
              {timeRem}s
            </div>
          </div>
        </div>

        <div className="question-wrapper">
          <div className="number mb-2">
            Question {currentIdx+1} / {questions.length}
          </div>
          <div className="question mb-3">{q.question}</div>

          <div className="d-grid gap-2">
            {answers.map((ans,i) => {
              let cls = 'btn btn-outline-light'
              if (selectedAns) {
                if (ans === selectedAns) {
                  cls = ans === q.correct_answer
                    ? 'btn btn-success'
                    : 'btn btn-danger'
                } else if (ans === q.correct_answer) {
                  cls = 'btn btn-success disabled'
                } else {
                  cls = 'btn btn-outline-light disabled'
                }
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleAnswer(ans)}
                  disabled={!!selectedAns || timeRem===0}
                >
                  {ans}
                </button>
              )
            })}
          </div>

          {showExp && (
            <div className="alert alert-info mt-3">
              {q.explanation}
            </div>
          )}

          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={nextQ}>
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  // finished
  return (
    <div className="containerquizz">
      <div className="end-screen text-center">
        <h1 className="heading mb-4">Quiz Complete!</h1>
        <div className="final-score mb-4">
          Score: {score} / {questions.length}
        </div>
        <button className="btn btn-primary me-2" onClick={startQuiz}>
          Retake Quiz
        </button>
        <button className="btn btn-secondary" onClick={resetToSettings}>
          New Quiz
        </button>
      </div>
    </div>
  )
}

QuizUI.propTypes = {
  // settings
  numQuestions:  PropTypes.number.isRequired,
  setNumQuestions: PropTypes.func.isRequired,
  category:      PropTypes.string.isRequired,
  setCategory:   PropTypes.func.isRequired,
  difficulty:    PropTypes.string.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  timeLimit:     PropTypes.number.isRequired,
  setTimeLimit:  PropTypes.func.isRequired,
  coursesList:   PropTypes.array.isRequired,

  // quiz
  phase:         PropTypes.string.isRequired,
  questions:     PropTypes.array.isRequired,
  currentIdx:    PropTypes.number.isRequired,
  score:         PropTypes.number.isRequired,
  selectedAns:   PropTypes.string,
  showExp:       PropTypes.bool.isRequired,
  timeRem:       PropTypes.number.isRequired,
  answers:       PropTypes.array.isRequired,
  progressRef:   PropTypes.object.isRequired,

  // actions
  startQuiz:    PropTypes.func.isRequired,
  handleAnswer: PropTypes.func.isRequired,
  nextQ:        PropTypes.func.isRequired,
  resetToSettings: PropTypes.func.isRequired
}
