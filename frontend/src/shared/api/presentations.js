import { apiClient } from './apiClient'

/**
 * GET /api/presentations/?owner=<username>&page=<n>
 * Returns: data.results (Array<Presentation>)
 */
export async function fetchPresentationsByOwner(username, { page = 1 } = {}) {
  const { data } = await apiClient.get('/presentations/', {
    params: { owner: username, page }
  })
  return data.results
}

/**
 * GET /api/presentations/{id}/
 */
export async function fetchPresentationById(presentationId) {
  const { data } = await apiClient.get(`/presentations/${presentationId}/`)
  return data
}

/**
 * POST /api/presentations/
 */
export async function createPresentation(formData) {
  const { data } = await apiClient.post(
    '/presentations/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

/**
 * PUT /api/presentations/{id}/
 */
export async function updatePresentation(presentationId, formData) {
  const { data } = await apiClient.put(
    `/presentations/${presentationId}/`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

/**
 * DELETE /api/presentations/{id}/
 */
export async function deletePresentation(presentationId) {
  await apiClient.delete(`/presentations/${presentationId}/`)
}

/**
 * GET /api/presentations/?course=<uuid>&page=<n>
 * Returns: data.results (Array<Presentation>)
 */
export async function fetchPresentationsByCourse(courseId, { page = 1 } = {}) {
  const { data } = await apiClient.get('/presentations/', {
    params: { course: courseId, page }
  })
  return data.results
}

/**
 * GET /api/presentations/
 * Returns: Array<Presentation>
 */
export async function fetchAllPresentations() {
  const { data } = await apiClient.get('/presentations/')
  return Array.isArray(data) ? data : data.results
}
