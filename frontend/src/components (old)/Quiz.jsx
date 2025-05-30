// src/components/Quiz.js
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { fetchCourses }   from '../api/courses'
import { getQuiz }        from '../api/ai'
import '../pages/Quiz.css'

// simple Fisher–Yates shuffle
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  // Settings
  const [numQuestions, setNumQuestions] = useState(5)
  const [category,    setCategory]     = useState('')
  const [difficulty,  setDifficulty]   = useState('easy')
  const [timeLimit,   setTimeLimit]    = useState(15)
  const [coursesList, setCoursesList]  = useState([])

  // Quiz
  const [phase,       setPhase]        = useState('settings')
  const [questions,   setQuestions]    = useState([])
  const [currentIdx,  setCurrentIdx]   = useState(0)
  const [score,       setScore]        = useState(0)
  const [selectedAns, setSelectedAns]  = useState(null)
  const [showExp,     setShowExp]      = useState(false)
  const [timeRem,     setTimeRem]      = useState(timeLimit)

  // timers & progress
  const timerRef    = useRef(null)
  const progressRef = useRef(null)

  // load courses
  useEffect(() => {
    fetchCourses().then(data => {
      const arr = data.results || []
      setCoursesList(arr)
      if (arr.length) setCategory(arr[0].id)
    })
  }, [])

  useEffect(() => () => clearInterval(timerRef.current), [])

  // Shuffle answers once per question
  const answers = useMemo(() => {
    if (!questions[currentIdx]) return []
    return shuffleArray([
      ...questions[currentIdx].incorrect_answers,
      questions[currentIdx].correct_answer
    ])
  }, [questions, currentIdx])

  // Start or retake
  const startQuiz = async e => {
    e?.preventDefault()
    // if first time fetch
    if (questions.length === 0) {
      setPhase('loading')
      try {
        const { questions: qs } = await getQuiz({ numQuestions, category, difficulty })
        setQuestions(qs)
        initRun(qs)
      } catch {
        alert('Failed to start quiz.')
        setPhase('settings')
      }
    } else {
      // retake existing
      initRun(questions)
    }
  }

  const initRun = qs => {
    setCurrentIdx(0)
    setScore(0)
    setSelectedAns(null)
    setShowExp(false)
    setTimeRem(timeLimit)
    setPhase('running')
    runTimer()
  }

  // timer
  const runTimer = () => {
    clearInterval(timerRef.current)
    setTimeRem(timeLimit)
    if (progressRef.current) progressRef.current.style.width = '100%'
    timerRef.current = setInterval(() => {
      setTimeRem(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setShowExp(true)
          return 0
        }
        const nxt = t - 1
        if (progressRef.current) {
          progressRef.current.style.width = `${(nxt / timeLimit) * 100}%`
        }
        return nxt
      })
    }, 1000)
  }

  const handleAnswer = ans => {
    if (selectedAns || timeRem === 0) return
    clearInterval(timerRef.current)
    setSelectedAns(ans)
    setShowExp(true)
    if (ans === questions[currentIdx].correct_answer) {
      setScore(s => s + 1)
    }
  }

  const nextQ = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1)
      setSelectedAns(null)
      setShowExp(false)
      runTimer()
    } else {
      setPhase('finished')
    }
  }

  // Render
  if (phase === 'settings') {
    return (
      <div className="containerquizz">
        <div className="start-screen">
          <h1 className="heading">Quiz App</h1>
          <form onSubmit={startQuiz} className="settings">
            <label className="form-label">Number of Questions</label>
            <select
              className="form-select mb-3"
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
            >
              {[4,5,8].map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <label className="form-label">Category</label>
            <select
              className="form-select mb-3"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {coursesList.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>

            <label className="form-label">Difficulty</label>
            <select
              className="form-select mb-3"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              {['easy','medium','hard'].map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>
              ))}
            </select>

            <label className="form-label">Time per Question</label>
            <select
              className="form-select mb-4"
              value={timeLimit}
              onChange={e => setTimeLimit(Number(e.target.value))}
            >
              {[15,30,60].map(t => <option key={t} value={t}>{t}s</option>)}
            </select>

            <button type="submit" className="btn btn-primary w-100">
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="containerquizz d-flex flex-column justify-content-center align-items-center vh-100">
        <p className="text-white mb-3">Generating the quiz…</p>
        <div className="spinner-border text-light" role="status"></div>
      </div>
    )
  }

  if (phase === 'running') {
    const q = questions[currentIdx]
    return (
      <div className="containerquizz">
        <div className="timer mb-2 d-flex align-items-center">
          <div className="progress flex-grow-1">
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
        <button
            className="btn btn-secondary"
            onClick={() => {
              setQuestions([])        // clear so next Start will refetch
              setPhase('settings')
            }}
          >
           Take Another Quiz
         </button>
      </div>
    </div>
  )
}
