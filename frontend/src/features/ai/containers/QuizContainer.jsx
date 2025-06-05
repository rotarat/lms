// src/features/quiz/QuizContainer.jsx
import React, { useState } from 'react'
import { QuizUI } from '../components/QuizUI'
import { useQuiz } from '../hooks/useQuiz'

export function QuizContainer() {
  const quiz = useQuiz()
  const [showPopup, setShowPopup] = useState(false)

  // Show popup and start the quiz logic
  const handleStartQuiz = () => {
    setShowPopup(true)
    quiz.startQuiz()
  }

  // Reset everything and close the popup
  const handleReset = () => {
    quiz.resetToSettings()
    setShowPopup(false)
  }

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
