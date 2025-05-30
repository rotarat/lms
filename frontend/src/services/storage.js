export const STORAGE_KEYS = {
    ACCESS:  'access_token',
    REFRESH: 'refresh_token',
    PROFILE: 'profile',
  }
  
  /**
   * Persist an access + refresh token pair.
   */
  export function saveTokens({ access, refresh }) {
    localStorage.setItem(STORAGE_KEYS.ACCESS,  access)
    localStorage.setItem(STORAGE_KEYS.REFRESH, refresh)
  }
  
  /** Read back the current access JWT (or null) */
  export function getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS)
  }
  /** Read back the current refresh JWT (or null) */
  export function getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH)
  }
  
  /** Persist the user’s profile object */
  export function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
  }
  /** Read back the persisted profile (or null) */
  export function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE)
    return raw ? JSON.parse(raw) : null
  }
  
  /** Remove tokens from storage */
  export function clearTokens() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS)
    localStorage.removeItem(STORAGE_KEYS.REFRESH)
  }
  /** Remove profile from storage */
  export function clearProfile() {
    localStorage.removeItem(STORAGE_KEYS.PROFILE)
  }
  