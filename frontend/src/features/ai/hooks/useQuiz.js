// src/features/quiz/useQuiz.js

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
  const [sessionId, setSessionId] = useState(null)     // adaptive session UUID
  const [questions, setQuestions] = useState([])       // array of MCQ objects
  const [currentIdx, setCurrentIdx] = useState(0)      // index into `questions`
  const [score, setScore] = useState(0)
  const [selectedAns, setSelectedAns] = useState(null) // what student clicked
  const [showExp, setShowExp] = useState(false)        // reveal rationale/explanation
  const [reflectionPrompt, setReflectionPrompt] = useState('')

  // ───────────────────────────────────────────────────────────────────────────
  // NEW: Hold the list of saved reflections after quiz finishes
  // ───────────────────────────────────────────────────────────────────────────
  const [reflectionsList, setReflectionsList] = useState([])

  // ───────────────────────────────────────────────────────────────────────────
  // TIMER STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [timeRem, setTimeRem] = useState(timeLimit)
  const timerRef = useRef(null)
  const progressRef = useRef(null)

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch list of courses for “category” dropdown
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    coursesApi
      .listAll()
      .then(courseArray => {
        setCoursesList(courseArray)
      })
      .catch(() => {
        setCoursesList([])
      })
  }, [])

  // Whenever timeLimit changes, reset timeRem
  useEffect(() => {
    setTimeRem(timeLimit)
  }, [timeLimit])

  // ───────────────────────────────────────────────────────────────────────────
  // TIMER LOGIC
  // ───────────────────────────────────────────────────────────────────────────
  const runTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Whenever timeRem changes, update the progress bar
  useEffect(() => {
    if (progressRef.current) {
      const pct = ((timeRem / timeLimit) * 100).toFixed(2) + '%'
      progressRef.current.style.width = pct
    }
  }, [timeRem, timeLimit])

  // ───────────────────────────────────────────────────────────────────────────
  // Derived: current question object and shuffled answer options
  // ───────────────────────────────────────────────────────────────────────────
  const currentQuestion = useMemo(() => {
    return questions[currentIdx] || null
  }, [questions, currentIdx])

  const answerOptions = useMemo(() => {
    if (!currentQuestion) return []
    const distractors = Array.isArray(currentQuestion.distractors_with_rationale)
      ? currentQuestion.distractors_with_rationale.map(d => d.distractor)
      : []
    const all = [currentQuestion.correct_answer || '', ...distractors]
    return shuffleArray(all)
  }, [currentQuestion])

  // ───────────────────────────────────────────────────────────────────────────
  // ACTION: Start Quiz (using startAdaptiveQuiz)
  // ───────────────────────────────────────────────────────────────────────────
  const startQuiz = async () => {
    if (!category) {
      alert('Please select a course first.')
      return
    }
    setPhase('loading')

    try {
      const resp = await startAdaptiveQuiz({
        course_id: category,
        difficulty,
        total: numQuestions
      })

      const { session_id, question } = resp
      const firstQuestionObj = Array.isArray(question)
        ? question[0]
        : question

      if (!session_id || !firstQuestionObj) {
        alert('Server did not return a valid question. Check console.')
        setPhase('settings')
        return
      }

      setSessionId(session_id)
      setQuestions([firstQuestionObj])
      initRun([firstQuestionObj])
    } catch {
      alert('Failed to start quiz. Please try again.')
      setPhase('settings')
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Helper: Initialize “running” state with the first question
  // ───────────────────────────────────────────────────────────────────────────
  const initRun = initialQs => {
    setQuestions(initialQs)
    setCurrentIdx(0)
    setScore(0)
    setSelectedAns(null)
    setShowExp(false)
    setReflectionPrompt('')
    setTimeRem(timeLimit)
    setPhase('running')
    runTimer()
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ACTION: Handle Answer Selection
  // ───────────────────────────────────────────────────────────────────────────
  const handleAnswer = ans => {
    if (selectedAns || timeRem === 0) return
    clearInterval(timerRef.current)
    setSelectedAns(ans)
    setShowExp(true)
    const isCorrect = ans === (currentQuestion?.correct_answer || '')
    if (isCorrect) {
      setScore(s => s + 1)
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ACTION: Next Question (POST to quizApi.create)
  // ───────────────────────────────────────────────────────────────────────────
  const nextQ = async () => {
    if (!currentQuestion) return

    const lastQ = currentQuestion
    const wasCorrect = selectedAns === lastQ.correct_answer

    const payload = {
      session_id: sessionId,
      was_correct: wasCorrect,
      question: lastQ.question,
      submitted_answer: selectedAns || '',
      correct_answer: lastQ.correct_answer,
      distractors_with_rationale: Array.isArray(lastQ.distractors_with_rationale)
        ? lastQ.distractors_with_rationale
        : []
    }

    try {
      const resp = await quizApi.create(payload)

      if (resp.finished) {
        setPhase('finished')
        clearInterval(timerRef.current)
        return
      }

      const nextQuestionObj = Array.isArray(resp.question)
        ? resp.question[0]
        : resp.question

      if (!nextQuestionObj) {
        alert('Server did not return a new question. Check console.')
        setPhase('finished')
        return
      }

      if (!wasCorrect && resp.reflection_prompt) {
        setReflectionPrompt(resp.reflection_prompt)
      } else {
        setReflectionPrompt('')
      }

      setQuestions(prev => [...prev, nextQuestionObj])
      setCurrentIdx(i => i + 1)
      setSelectedAns(null)
      setShowExp(false)
      setTimeRem(timeLimit)
      runTimer()
    } catch {
      alert('Something went wrong getting the next question.')
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ACTION: Reset to Settings
  // ───────────────────────────────────────────────────────────────────────────
  const resetToSettings = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSessionId(null)
    setQuestions([])
    setCurrentIdx(0)
    setScore(0)
    setSelectedAns(null)
    setShowExp(false)
    setReflectionPrompt('')
    setPhase('settings')
  }

  // ───────────────────────────────────────────────────────────────────────────
  // NEW: Fetch & Poll reflections until every item has a non‐empty prompt
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'finished') return

    let attempts = 0
    const maxAttempts = 10
    const delayMs = 300

    async function fetchReflections() {
      try {
        const resp = await apiClient.get('/ai/quiz/reflections/', {
          params: { session_id: sessionId }
        })
        let data = resp.data

        // Check if any item has an empty reflection_prompt
        const pending = data.filter(item => !item.reflection_prompt)

        if (pending.length > 0 && attempts < maxAttempts) {
          attempts += 1
          setTimeout(fetchReflections, delayMs)
        }

        setReflectionsList(data)
      } catch {
        setReflectionsList([])
      }
    }

    fetchReflections()
  }, [phase, sessionId])

  // ───────────────────────────────────────────────────────────────────────────
  // Return everything the UI needs
  // ───────────────────────────────────────────────────────────────────────────
  return {
    // Settings
    numQuestions,
    setNumQuestions,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    timeLimit,
    setTimeLimit,
    coursesList,

    // Quiz state
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

    // NEW: fetched list of reflections
    reflectionsList,

    // Actions
    startQuiz,
    handleAnswer,
    nextQ,
    resetToSettings
  }
}
