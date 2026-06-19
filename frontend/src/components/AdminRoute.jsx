import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function AdminRoute({ children }) {
  const [state, setState] = useState({ loading: true, user: null, error: '' })

  useEffect(() => {
    let cancelled = false

    async function loadCurrentUser() {
      try {
        const user = await apiFetch('/auth/me')
        if (!cancelled) {
          setState({ loading: false, user, error: '' })
        }
      } catch (error) {
        if (!cancelled) {
          setState({ loading: false, user: null, error: error.message })
        }
      }
    }

    loadCurrentUser()

    return () => {
      cancelled = true
    }
  }, [])

  if (state.loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status" />
        <p className="text-muted mt-3">Vérification de l’accès administrateur...</p>
      </div>
    )
  }

  if (!state.user) {
    return <Navigate to="/connexion" replace />
  }

  if (state.user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
