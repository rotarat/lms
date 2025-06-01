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

export async function submitDiagram(formData) {
  try {
    const response = await apiClient.post('/api/ai/diagram/', 
      formData, 
      {headers: { 'Content-Type': 'multipart/form-data' }}
    )
    // response.data is:
    //   • { imageUrl, explanation }  when action === 'diagram'
    //   • { explanation }            when action === 'explanation'
    return response.data
  } catch (error) {
    console.error("Failed to submit diagram:", error)
    throw error
  }
}
