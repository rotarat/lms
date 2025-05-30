import { apiClient } from './apiClient'

/**
 * GET /api/courses/?owner=<username>&page=<n>
 * → { count, next, previous, results: Course[] }
 * @returns Course[]
 */
export async function fetchByOwner(username, { page = 1 } = {}) {
  const { data } = await apiClient.get('/courses/', {
    params: { owner: username, page }
  })
  return data.results
}

/**
 * GET /api/courses/{id}/
 * → Course
 */
export async function fetchCourseById(courseId) {
  const { data } = await apiClient.get(`/courses/${courseId}/`)
  return data
}

/**
 * POST /api/courses/
 * @param {FormData} formData
 */
export async function createCourse(formData) {
  const { data } = await apiClient.post(
    '/courses/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

/**
 * PUT /api/courses/{id}/
 */
export async function updateCourse(courseId, formData) {
  const { data } = await apiClient.put(
    `/courses/${courseId}/`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

/**
 * DELETE /api/courses/{id}/
 */
export async function deleteCourse(courseId) {
  await apiClient.delete(`/courses/${courseId}/`)
}

/**
 * GET /api/courses/?page=<n>&search=<q>
 * → { count, next, previous, results: Course[] }
 */
export async function fetchCourses({ page = 1, search = '' } = {}) {
  const { data } = await apiClient.get('/courses/', {
    params: { page, search }
  })
  return data
}
