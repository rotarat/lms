import { createResourceApi } from './resourceFactory'
import { apiClient } from './apiClient'

export const coursesApi = createResourceApi('courses')

export const videosApi = createResourceApi('videos')

export const presentationsApi = createResourceApi('presentations')

export const examsApi = createResourceApi('exams')

export const studentExamsApi = createResourceApi('student/exams')

export const questionsApi = createResourceApi('questions')

export const profilesApi = createResourceApi('profiles')


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