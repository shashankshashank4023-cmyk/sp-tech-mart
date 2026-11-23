import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../api/services'
const AuthContext = createContext(null)
function readUser() { try { return JSON.parse(localStorage.getItem('spc_user') || 'null') } catch { return null } }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [token, setToken] = useState(() => localStorage.getItem('spc_token'))
  useEffect(() => { const clear = () => { localStorage.removeItem('spc_token'); localStorage.removeItem('spc_user'); setToken(null); setUser(null) }; window.addEventListener('spc:auth-expired', clear); return () => window.removeEventListener('spc:auth-expired', clear) }, [])
  const save = useCallback((result) => { const next = { userId: result.userId, name: result.name, role: result.role }; localStorage.setItem('spc_token', result.token); localStorage.setItem('spc_user', JSON.stringify(next)); setToken(result.token); setUser(next); return next }, [])
  const login = useCallback(async (credentials) => save(await authService.login(credentials)), [save])
  const register = useCallback(async (details) => save(await authService.register(details)), [save])
  const logout = useCallback(() => { localStorage.removeItem('spc_token'); localStorage.removeItem('spc_user'); setToken(null); setUser(null) }, [])
  const value = useMemo(() => ({ user, token, isAdmin: user?.role === 'ROLE_ADMIN', isAuthenticated: Boolean(token), login, register, logout }), [user, token, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value }


