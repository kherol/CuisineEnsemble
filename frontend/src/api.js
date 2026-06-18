const envBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL

const API_BASE =
  window.location.port === '5173' && (!envBase || envBase === '/api')
    ? 'http://localhost:8000/api'
    : (envBase || '/api')

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
  window.dispatchEvent(new Event('auth-changed'))
}

export function logout() {
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('auth-changed'))
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let detail = `Erreur API ${response.status}`
    try {
      const data = await response.json()
      detail = data.detail || JSON.stringify(data)
    } catch (_) {
      try {
        detail = await response.text()
      } catch (_) {}
    }
    throw new Error(detail)
  }

  if (response.status === 204) return null
  return response.json()
}
