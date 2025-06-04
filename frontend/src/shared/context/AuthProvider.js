import {
    createContext,
    useState,
    useEffect,
    useCallback
  } from 'react'
  
  import * as storage     from '../../services/storage'
  import * as authApi     from '../api/auth'
  import { profilesApi } from '../api/resourses'
  import { registerLogoutHandler } from '../api/apiClient'
  
  export const AuthContext = createContext({
    profile: null,
    tokens:  null,
    login:   async () => {},
    register:async () => {},
    updateProfile: async () => {},
    logout:  () => {},
  })
    
  export default function AuthProvider({ children }) {
    // 1) Rehydrate tokens & profile from localStorage
    const [tokens, setTokens] = useState(() => {
      const a = storage.getAccessToken()
      const r = storage.getRefreshToken()
      return a && r ? { access: a, refresh: r } : null
    })
    const [profile, setProfile] = useState(storage.loadProfile())

    // 2) login: fetch tokens, persist, then fetch+persist profile
    const login = useCallback(async ({ username, password }) => {
      const newTokens  = await authApi.getToken({ username, password })
      storage.saveTokens(newTokens)               // ← persist here
      setTokens(newTokens)
  
      const newProfile = await profilesApi.get(username)
      storage.saveProfile(newProfile)
      setProfile(newProfile)
  
      return { tokens: newTokens, profile: newProfile }
    }, [])
  
    // 3) register: endpoint returns both tokens+profile
    const register = useCallback(async formData => {
      const { tokens: newTokens, profile: newProfile } =
        await authApi.register(formData)
  
      storage.saveTokens(newTokens)
      storage.saveProfile(newProfile)
      setTokens(newTokens)
      setProfile(newProfile)
  
      return { tokens: newTokens, profile: newProfile }
    }, [])
  
    // 4) updateProfile: patch + overwrite in storage+state
    const updateProfile = useCallback(async (username, formData) => {
      const updated = await profilesApi.update(username, formData)
      storage.saveProfile(updated)
      setProfile(updated)
      return updated
    }, [])
  
    // 5) logout: clear storage + state + navigate
    const logout = useCallback(() => {
      storage.clearTokens()
      storage.clearProfile()
      setTokens(null)
      setProfile(null)
    }, [])
  
    // 6) register our logout handler for 401→refresh failures
    useEffect(() => {
      registerLogoutHandler(logout)
    }, [logout])

    return (
      <AuthContext.Provider
        value={{
          profile,
          tokens,
          login,
          register,
          updateProfile,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  