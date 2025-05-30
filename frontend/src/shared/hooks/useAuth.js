import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'

export function useAuth() {
  const ctx = useContext(AuthContext)
  console.log(ctx)
  if (ctx === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx;
}
