import { apiClient } from './apiClient'

/**
 * POST /api/ai/chatbot/
 * body: { message: string }
 * returns { message_resp: string }
 */
export function askChatbot(message) {
  return apiClient
    .post('/ai/chatbot/', { message })
    .then(res => res.data)
}

/**
 * Kick off a new quiz.
 * @param {object} opts
 * @param {number} opts.numQuestions
 * @param {string} opts.category
 * @param {string} opts.difficulty
 * @param {number} opts.timePerQuestion
 * @returns {Promise<{
 *   time_per_question: number,
 *   questions: Array<{
 *     question: string,
 *     options: string[],
 *     correct_index: number
 *   }>
 * }>}
 */
export function getQuiz({ numQuestions, category, difficulty }) {
  return apiClient
    .post('/ai/quiz/', {
      num_questions: numQuestions,
      category,
      difficulty,
    })
    .then((resp) => resp.data);
}

export const submitDiagram = async (text, imageFile) => {
  const formData = new FormData()
  formData.append('text', text)
  if (imageFile) {
    formData.append('image', imageFile)
  }

  try {
    const response = await apiClient.post('/api/ai/diagram/', formData)
    return response.data  // Expected: { imageUrl, explanation }
  } catch (error) {
    console.error("Failed to submit diagram:", error)
    throw error
  }
};

export const downloadDiagram = async (name) => {
  try {
    const response = await apiClient.get(`/api/ai/diagrams/${name}`, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error("Failed to download diagram:", error)
    throw error
  }
};