import axios from 'axios'
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', headers: { 'Content-Type': 'application/json' } })
apiClient.interceptors.request.use((config) => { const token = localStorage.getItem('spc_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config })
apiClient.interceptors.response.use((response) => response, (error) => { if (error.response?.status === 401) { localStorage.removeItem('spc_token'); localStorage.removeItem('spc_user'); window.dispatchEvent(new Event('spc:auth-expired')); if (window.location.pathname !== '/login') { window.history.replaceState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')) } } error.message = error.response?.data?.message || (error.request ? 'Cannot reach the SP Computers API. Start the Spring Boot backend and database.' : error.message) || 'Request failed'; return Promise.reject(error) })
export default apiClient


