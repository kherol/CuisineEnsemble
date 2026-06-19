import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../../api.js'
import { AdminLoading } from './AdminDashboard.jsx'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [processingId, setProcessingId] = useState(null)

  async function loadUsers() {
    try {
      setError('')
      const data = await apiFetch('/admin/users')
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        (user.district || '').toLowerCase().includes(normalizedSearch)

      const matchesRole = role === 'all' || user.role === role
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && user.is_active) ||
        (status === 'blocked' && !user.is_active)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, role, status])

  async function toggleUserStatus(user) {
    setProcessingId(user.id)
    setMessage('')
    setError('')

    try {
      const updated = await apiFetch(`/admin/users/${user.id}/toggle-status`, {
        method: 'PATCH',
      })
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setMessage(updated.is_active ? 'Utilisateur réactivé.' : 'Utilisateur bloqué.')
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function changeRole(user, nextRole) {
    setProcessingId(user.id)
    setMessage('')
    setError('')

    try {
      const updated = await apiFetch(
        `/admin/users/${user.id}/role?role=${encodeURIComponent(nextRole)}`,
        { method: 'PATCH' },
      )
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setMessage(`Rôle de ${updated.name} mis à jour.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <AdminLoading text="Chargement des utilisateurs..." />
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Administration</span>
          <h1 className="fw-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-muted mb-0">Consulte, bloque, réactive ou modifie le rôle des comptes.</p>
        </div>
        <span className="admin-count-badge">{filteredUsers.length} utilisateur(s)</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm admin-panel mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-6">
              <label className="form-label fw-semibold">Rechercher</label>
              <input
                className="form-control"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom, email ou quartier"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Rôle</label>
              <select className="form-select" value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="all">Tous</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Statut</label>
              <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="blocked">Bloqués</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm admin-panel overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0 admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Quartier</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">Aucun utilisateur trouvé.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong className="d-block">{user.name}</strong>
                      <small className="text-muted">{user.email}</small>
                    </td>
                    <td>{user.district || 'Non indiqué'}</td>
                    <td>
                      <select
                        className="form-select form-select-sm admin-role-select"
                        value={user.role}
                        disabled={processingId === user.id}
                        onChange={(event) => changeRole(user, event.target.value)}
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${user.is_active ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {user.is_active ? 'Actif' : 'Bloqué'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm ${user.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        disabled={processingId === user.id}
                        onClick={() => toggleUserStatus(user)}
                      >
                        {processingId === user.id
                          ? 'Traitement...'
                          : user.is_active
                            ? 'Bloquer'
                            : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
