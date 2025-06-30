import { useState, useEffect, useRef } from 'react'

export function useExamTake(show, examAttempt) {
  const [selected, setSelected] = useState({})
  const [timeRem, setTimeRem] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!show || !examAttempt) return

    clearInterval(timerRef.current)
    setSelected({})

    const totalSeconds = Math.floor(examAttempt.exam.duration * 60)
    setTimeRem(totalSeconds)

    timerRef.current = setInterval(() => {
      setTimeRem((t) => (t > 0 ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [show, examAttempt])

  const disabled = timeRem === 0
  const pct =
    timeRem != null
      ? ((timeRem / (examAttempt.exam.duration * 60)) * 100).toFixed(2)
      : 0

  const handleChoice = (qIdx, choiceIdx) => {
    if (disabled) return
    setSelected((s) => ({ ...s, [qIdx]: choiceIdx }))
  }

  const clearTimer = () => clearInterval(timerRef.current)

  return { selected, timeRem, pct, disabled, handleChoice, clearTimer }
}
