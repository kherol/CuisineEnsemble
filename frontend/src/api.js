const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function logout() {
  localStorage.removeItem('token')
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
    let detail = 'Erreur API'
    try {
      const data = await response.json()
      detail = data.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }

  if (response.status === 204) return null
  return response.json()
}
