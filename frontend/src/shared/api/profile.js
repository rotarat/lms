import { apiClient } from './apiClient'

/** Fetch a profile by username */
export function fetchProfile(username) {
  return apiClient
    .get(`/profiles/${username}/`)
    .then(resp => resp.data)
}

/** Update a profile by username (multipart/form-data) */
export function updateProfile(username, formData) {
  return apiClient
    .patch(`/profiles/${username}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(resp => resp.data)
}

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
