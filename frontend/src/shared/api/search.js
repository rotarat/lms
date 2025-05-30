
// import { apiClient } from './apiClient'

// /**
//  * All four of these now accept an optional
//  *   { page, search } object and return
//  *   { count, next, previous, results }
//  */
// export function searchCourses({ page = 1, search = '' } = {}) {
//   return apiClient
//     .get('/courses/', { params: { page, search } })
//     .then(r => r.data)
// }

// export function searchVideos({ page = 1, search = '' } = {}) {
//   return apiClient
//     .get('/videos/', { params: { page, search } })
//     .then(r => r.data)
// }

// export function searchPresentations({ page = 1, search = '' } = {}) {
//   return apiClient
//     .get('/presentations/', { params: { page, search } })
//     .then(r => r.data)
// }

// export function searchProfiles({ page = 1, search = '' } = {}) {
//   return apiClient
//     .get('/profiles/', { params: { page, search } })
//     .then(r => r.data)
// }
