import { apiClient } from './apiClient'

/**
 * Obtain a fresh access+refresh pair
 * (does NOT persist them; leave that to your context)
 */
export function getToken({ username, password }) {
  return apiClient
    .post('/auth/token/', { username, password })
    .then(resp => resp.data)
}

/**
 * Register a new user+profile in one go.
 * Returns { tokens: {access,refresh}, profile: {...} }
 */
export function register(formData) {
  return apiClient
    .post('/profiles/', formData)
    .then(resp => resp.data)
}
