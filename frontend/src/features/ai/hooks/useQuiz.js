import { useState, useEffect, useRef, useMemo } from 'react'
import { coursesApi } from '../../../shared/api/resourses'
import { getQuiz }   from '../../../shared/api/ai'

// Fisher–Yates shuffle
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useQuiz() {
  // SETTINGS
  const [numQuestions, setNumQuestions] = useState(5)
  const [category,    setCategory]     = useState('')
  const [difficulty,  setDifficulty]   = useState('easy')
  const [timeLimit,   setTimeLimit]    = useState(15)

  // QUIZ STATE
  const [phase,       setPhase]        = useState('settings')
  const [questions,   setQuestions]    = useState([])
  const [currentIdx,  setCurrentIdx]   = useState(0)
  const [score,       setScore]        = useState(0)
  const [selectedAns, setSelectedAns]  = useState(null)
  const [showExp,     setShowExp]      = useState(false)
  const [timeRem,     setTimeRem]      = useState(timeLimit)

  // dropdown data
  const [coursesList, setCoursesList]  = useState([])

  // timers & progress
  const timerRef    = useRef(null)
  const progressRef = useRef(null)

  // load categories (courses)
  useEffect(() => {
    coursesApi
      .list()
      .then(arr => {
        setCoursesList(arr)
        if (arr.length) setCategory(arr[0].id.toString())
      })
  }, [])

  // cleanup
  useEffect(() => () => clearInterval(timerRef.current), [])

  // shuffled answers for current question
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
    if (questions.length === 0) {
      setPhase('loading')
      try {
        const { questions: qs } = await getQuiz({
          numQuestions,
          category,
          difficulty
        })
        setQuestions(qs)
        initRun(qs)
      } catch {
        alert('Failed to start quiz.')
        setPhase('settings')
      }
    } else {
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

  const resetToSettings = () => {
    setQuestions([])
    setPhase('settings')
  }

  return {
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

    // quiz state
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
  }
}
