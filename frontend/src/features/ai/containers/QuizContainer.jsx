import { useQuiz } from '../hooks/useQuiz'
import { QuizUI }  from '../components/QuizUI'

export function QuizContainer() {
  const quiz = useQuiz()
  return <QuizUI {...quiz} />
}
