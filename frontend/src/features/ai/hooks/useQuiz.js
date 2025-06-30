import { useState, useEffect, useRef, useMemo } from 'react'
import { coursesApi, quizApi, startAdaptiveQuiz } from '../../../shared/api/resourses'
import { apiClient } from '../../../shared/api/apiClient'

/**
 * Fisher–Yates shuffle to randomize answer order
 */
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useQuiz() {
  // ───────────────────────────────────────────────────────────────────────────
  // SETTINGS STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [numQuestions, setNumQuestions] = useState(5)
  const [category, setCategory] = useState('')        // holds course_id
  const [difficulty, setDifficulty] = useState('Medium')
  const [timeLimit, setTimeLimit] = useState(30)      // seconds per question
  const [coursesList, setCoursesList] = useState([])

  // ───────────────────────────────────────────────────────────────────────────
  // QUIZ STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('settings')
  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAns, setSelectedAns] = useState(null)
  const [showExp, setShowExp] = useState(false)
  const [reflectionPrompt, setReflectionPrompt] = useState('')
  const [reflectionsList, setReflectionsList] = useState([])

  // ───────────────────────────────────────────────────────────────────────────
  // TIMER STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [timeRem, setTimeRem] = useState(timeLimit)
  const timerRef = useRef(null)
  const progressRef = useRef(null)

  // ───────────────────────────────────────────────────────────────────────────
  // PREFETCH LOGIC
  // ───────────────────────────────────────────────────────────────────────────
  const [nextQPromise, setNextQPromise] = useState(null)
  const [isNextLoading, setIsNextLoading] = useState(false)

  const prepareNextQ = async (selected) => {
    if (!currentQuestion) return null
    const lastQ = currentQuestion
    const wasCorrect = selected === lastQ.correct_answer
    const payload = {
      session_id: sessionId,
      was_correct: wasCorrect,
      question: lastQ.question,
      submitted_answer: selected || '',
      correct_answer: lastQ.correct_answer,
      distractors_with_rationale: Array.isArray(lastQ.distractors_with_rationale)
        ? lastQ.distractors_with_rationale
        : []
    }
    try {
      return await quizApi.create(payload)
    } catch {
      alert('Something went wrong getting the next question.')
      return null
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Populate courses for dropdown
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    coursesApi
      .listAll()
      .then(setCoursesList)
      .catch(() => setCoursesList([]))
  }, [])

  useEffect(() => { setTimeRem(timeLimit) }, [timeLimit])

  // ───────────────────────────────────────────────────────────────────────────
  // TIMER LOGIC
  // ───────────────────────────────────────────────────────────────────────────
  const runTimer = () => {
    clearInterval(timerRef.current)
    setTimeRem(timeLimit)
    timerRef.current = setInterval(() => {
      setTimeRem(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setShowExp(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = ((timeRem / timeLimit) * 100).toFixed(2) + '%'
    }
  }, [timeRem, timeLimit])

  // ───────────────────────────────────────────────────────────────────────────
  // Derived state
  // ───────────────────────────────────────────────────────────────────────────
  const currentQuestion = useMemo(() => questions[currentIdx] || null, [questions, currentIdx])
  const answerOptions = useMemo(() => {
    if (!currentQuestion) return []
    const distractors = (currentQuestion.distractors_with_rationale || []).map(d => d.distractor)
    return shuffleArray([currentQuestion.correct_answer || '', ...distractors])
  }, [currentQuestion])

  // ───────────────────────────────────────────────────────────────────────────
  // Start Quiz
  // ───────────────────────────────────────────────────────────────────────────
  const startQuiz = async () => {
    if (!category) { alert('Please select a course first.'); return }
    setPhase('loading')
    try {
      const { session_id, question } = await startAdaptiveQuiz({ course_id: category, difficulty, total: numQuestions })
      const firstQ = Array.isArray(question) ? question[0] : question
      if (!session_id || !firstQ) { alert('Server did not return a valid question.'); setPhase('settings'); return }
      setSessionId(session_id)
      initRun([firstQ])
    } catch {
      alert('Failed to start quiz. Please try again.')
      setPhase('settings')
    }
  }

  const initRun = (initialQs) => {
    setQuestions(initialQs);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAns(null);
    setShowExp(false);
    setReflectionPrompt('');
    setTimeRem(timeLimit);
    setPhase('running');
    runTimer();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Handle Answer
  // ───────────────────────────────────────────────────────────────────────────
  const handleAnswer = (ans) => {
    if (selectedAns || timeRem === 0) return
    clearInterval(timerRef.current)
    setSelectedAns(ans)
    setShowExp(true)
    if (ans === currentQuestion.correct_answer) setScore(s => s + 1)
    setNextQPromise(prepareNextQ(ans))
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Next Question
  // ───────────────────────────────────────────────────────────────────────────
  const nextQ = async () => {
    setIsNextLoading(true)
    const resp = nextQPromise ? await nextQPromise : await prepareNextQ(selectedAns)
    setNextQPromise(null)
    setIsNextLoading(false)
    if (!resp) return
    if (resp.finished) { setPhase('finished'); clearInterval(timerRef.current); return }
    const nextQObj = Array.isArray(resp.question) ? resp.question[0] : resp.question
    if (!nextQObj) { alert('Server did not return a new question.'); setPhase('finished'); return }
    if (resp.reflection_prompt && selectedAns !== currentQuestion.correct_answer) setReflectionPrompt(resp.reflection_prompt)
    else setReflectionPrompt('')
    setQuestions(prev => [...prev, nextQObj])
    setCurrentIdx(i => i + 1)
    setSelectedAns(null)
    setShowExp(false)
    setTimeRem(timeLimit)
    runTimer()
  }

  const resetToSettings = () => {
    clearInterval(timerRef.current)
    setPhase('settings')
    setSessionId(null)
    setQuestions([])
    setCurrentIdx(0)
    setScore(0)
    setSelectedAns(null)
    setShowExp(false)
    setReflectionPrompt('')
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch Reflections
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'finished') return
    let attempts = 0, max = 10, delay = 300
    const fetchReflections = async () => {
      try {
        const { data } = await apiClient.get('/ai/quiz/reflections/', { params: { session_id: sessionId } })
        if (data.some(item => !item.reflection_prompt) && attempts < max) {
          attempts++
          setTimeout(fetchReflections, delay)
        }
        setReflectionsList(data)
      } catch { setReflectionsList([]) }
    }
    fetchReflections()
  }, [phase, sessionId])

  return {
    // settings
    numQuestions, setNumQuestions,
    category, setCategory,
    difficulty, setDifficulty,
    timeLimit, setTimeLimit,
    coursesList,
    // quiz
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
    // actions
    startQuiz,
    handleAnswer,
    nextQ,
    resetToSettings,
    // prefetch
    isNextLoading
  }
}
