import axios from 'axios'
import * as storage from '../../services/storage'

let logoutHandler = () => {}
export function registerLogoutHandler(fn) {
  logoutHandler = fn
}

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT || 'http://127.0.0.1:8000/api',
})

apiClient.interceptors.request.use(config => {
  const token = storage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * 2) RESPONSE INTERCEPTOR
 *    - On 401 due to expired access token → attempt to refresh once
 *    - If refresh succeeds, save the new tokens & retry original request
 *    - If refresh fails, invoke logoutHandler (which your AuthContext
 *      has registered to clear state + redirect)
 */
apiClient.interceptors.response.use(
  res => res,
  async err => {
    const { config, response } = err
    const isRefreshCall = config.url?.endsWith('/auth/refresh/')
    const isAccessExpired =
      response?.status === 401 &&
      response.data?.code === 'token_not_valid' &&
      response.data?.messages?.[0]?.token_class === 'AccessToken'

    if (isAccessExpired && !config.__isRetryRequest && !isRefreshCall) {
      config.__isRetryRequest = true
      const refresh = storage.getRefreshToken()

      if (refresh) {
        try {
          const { data } = await apiClient.post('/auth/refresh/', { refresh })

          // persist the new access & refresh tokens
          storage.saveTokens({ access: data.access, refresh })

          // retry the original request with the new access token
          config.headers.Authorization = `Bearer ${data.access}`
          return apiClient(config)
        } catch {
          // refresh failed → logout
          logoutHandler()
        }
      }
    }

    return Promise.reject(err)
  }
)