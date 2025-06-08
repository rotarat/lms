import { createResourceApi } from './resourceFactory'
import { apiClient } from './apiClient'

export const coursesApi = createResourceApi('courses')

export const videosApi = createResourceApi('videos')

export const presentationsApi = createResourceApi('presentations')

export const examsApi = createResourceApi('exams')

export const studentExamsApi = {
  ...createResourceApi('student/exams'),
  /**
   * POST /api/student/exams/{id}/submit/
   */
  submit: (id, data) =>
    apiClient
      .post(`/student/exams/${id}/submit/`, data)
      .then((r) => r.data),
}

export const questionsApi = createResourceApi('questions')

export const profilesApi = createResourceApi('profiles')

export const quizApi = createResourceApi('ai/quiz')

export const projectsApi = createResourceApi('projects')


/**
 * POST /api/profiles/password/
 * Change the current user's password.
 * @param {{ old_password: string, new_password1: string, new_password2: string }}
 */
export function changePassword(payload) {
  return apiClient
    .post('/profiles/password/', payload)
    .then(resp => resp.data)
}

/**
 * GET /api/ai/quiz/?course_id=<id>&difficulty=<level>&total=<n>
 * Starts a new adaptive quiz session. Returns { session_id, question }.
 *
 * @param {{ course_id: string, difficulty: string, total: number }}
 * @returns {Promise<{ session_id: string, question: object }>}
 */
export function startAdaptiveQuiz({ course_id, difficulty, total }) {
  return apiClient
    .get('/ai/quiz/', {
      params: { course_id, difficulty, total }
    })
    .then(resp => resp.data)
}

export async function generateAudio(courseId) {
    const response = await apiClient.post(
      `/courses/${courseId}/generate-audio/`
    )
    return response.data
}

export async function enroll(courseId) {
  const response = await apiClient.post(`courses/${courseId}/enroll/`)
  return response.data
}
