import { useState } from 'react'
import { QuizUI } from '../components/QuizUI'
import { useQuiz } from '../hooks/useQuiz'

export function QuizContainer() {
  const quiz = useQuiz()
  const [showPopup, setShowPopup] = useState(false)

  const handleStartQuiz = () => { setShowPopup(true); quiz.startQuiz() }
  const handleReset     = () => { quiz.resetToSettings(); setShowPopup(false) }

  return (
    <QuizUI
      {...quiz}
      showPopup={showPopup}
      onClosePopup={handleReset}
      startQuiz={handleStartQuiz}
      resetToSettings={handleReset}
    />
  )
}