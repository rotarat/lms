import { apiClient } from './apiClient'

/**
 * GET /api/videos/{id}/
 */
export async function fetchVideoById(videoId) {
  const { data } = await apiClient.get(`/videos/${videoId}/`)
  return data
}

/**
 * POST /api/videos/
 */
export async function createVideo(payload) {
  const { data } = await apiClient.post('/videos/', payload)
  return data
}

/**
 * PUT /api/videos/{id}/
 */
export async function updateVideo(videoId, payload) {
  const { data } = await apiClient.put(`/videos/${videoId}/`, payload)
  return data
}

/**
 * DELETE /api/videos/{id}/
 */
export async function deleteVideo(videoId) {
  await apiClient.delete(`/videos/${videoId}/`)
}

/**
 * GET /api/videos/?owner=<username>&page=<n>
 * Returns: data.results (Array<Video>)
 */
export async function fetchVideosByOwner(username, { page = 1 } = {}) {
  const { data } = await apiClient.get('/videos/', {
    params: { owner: username, page }
  })
  return data.results
}

/**
 * GET /api/videos/?course=<uuid>&page=<n>
 * Returns: data.results (Array<Video>)
 */
export async function fetchVideosByCourse(courseId, { page = 1 } = {}) {
  const { data } = await apiClient.get('/videos/', {
    params: { course: courseId, page }
  })
  return data.results
}

/**
 * GET /api/videos/
 * Returns: Array<Video>
 */
export async function fetchAllVideos() {
  const { data } = await apiClient.get('/videos/')
  // If DRF pagination is on, data = { count, next, previous, results: [...] }
  return Array.isArray(data) ? data : data.results
}
