import { apiClient } from './apiClient'

export function createResourceApi(basePath) {
  const path = `/${basePath}/`

  function isArray(data) {
    return Array.isArray(data)
  }

  return {
    /**
     * list(params) → Promise<R[]>
     * Always unwraps data or data.results → R[]
     */
    list(params) {
      return apiClient
        .get(path, { params })
        .then(resp => {
          const data = resp.data
          return isArray(data) ? data : data.results
        })
    },

    /**
     * listWithMeta(params) → Promise<{ items: R[], count, next, previous }>
     * Returns items + full DRF pagination metadata
     */
    listWithMeta(params) {
      return apiClient
        .get(path, { params })
        .then(resp => {
          const data = resp.data
          if (isArray(data)) {
            return {
              items: data,
              count: data.length,
              next: null,
              previous: null
            }
          }
          return {
            items: data.results,
            count: data.count,
            next: data.next,
            previous: data.previous
          }
        })
    },

    /**
     * listAll(params) → Promise<R[]>
     * Crawls through every DRF page under the hood → flattens all results
     */
    async listAll(params) {
      const all = []
      let url = path
      let firstParams = params

      while (url) {
        const resp = await apiClient.get(url, {
          params: url === path ? firstParams : undefined
        })
        const data = resp.data

        if (isArray(data)) {
          all.push(...data)
          break
        }

        all.push(...data.results)
        url = data.next
      }

      return all
    },

    /** GET  /<basePath>/{field}/ → Promise<R> */
    get(field) {
      return apiClient.get(`${path}${field}/`).then(r => r.data)
    },

    /** POST /<basePath>/ → Promise<R> */
    create(payload) {
      return apiClient.post(path, payload).then(r => r.data)
    },

    /** PUT  /<basePath>/{id}/ → Promise<R> */
    update(id, payload) {
      return apiClient.put(`${path}${id}/`, payload).then(r => r.data)
    },

    /** PATCH /<basePath>/{id}/ → Promise<R> */
    patch(id, payload) {
      return apiClient.patch(`${path}${id}/`, payload).then(r => r.data)
    },

    /** DELETE /<basePath>/{id}/ → Promise<void> */
    delete(id) {
      return apiClient.delete(`${path}${id}/`)
    }
  }
}
