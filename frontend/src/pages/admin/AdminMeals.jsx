import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../api.js'
import { AdminLoading, StatusBadge } from './AdminDashboard.jsx'

const statuses = ['open', 'full', 'finished', 'cancelled']

export default function AdminMeals() {
  const [meals, setMeals] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await apiFetch('/admin/meals')
        setMeals(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMeals()
  }, [])

  const filteredMeals = useMemo(() => {
    const query = search.trim().toLowerCase()

    return meals.filter((meal) => {
      const matchesSearch =
        !query ||
        meal.title.toLowerCase().includes(query) ||
        (meal.host?.name || '').toLowerCase().includes(query) ||
        (meal.district || '').toLowerCase().includes(query)

      const matchesStatus = status === 'all' || meal.status === status
      return matchesSearch && matchesStatus
    })
  }, [meals, search, status])

  async function updateStatus(meal, nextStatus) {
    setProcessingId(meal.id)
    setMessage('')
    setError('')

    try {
      const updated = await apiFetch(
        `/admin/meals/${meal.id}/status?status=${encodeURIComponent(nextStatus)}`,
        { method: 'PATCH' },
      )
      setMeals((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setMessage(`Statut du repas « ${updated.title} » mis à jour.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <AdminLoading text="Chargement des repas..." />
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Modération</span>
          <h1 className="fw-bold mb-2">Gestion des repas</h1>
          <p className="text-muted mb-0">Contrôle les repas publiés et modifie leur statut si nécessaire.</p>
        </div>
        <span className="admin-count-badge">{filteredMeals.length} repas</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm admin-panel mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-8">
              <label className="form-label fw-semibold">Rechercher</label>
              <input
                className="form-control"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Titre, hôte ou quartier"
              />
            </div>
            <div className="col-lg-4">
              <label className="form-label fw-semibold">Statut</label>
              <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="open">Ouverts</option>
                <option value="full">Complets</option>
                <option value="finished">Terminés</option>
                <option value="cancelled">Annulés</option>
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
                <th>Repas</th>
                <th>Hôte</th>
                <th>Date</th>
                <th>Places</th>
                <th>Prix</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">Aucun repas trouvé.</td>
                </tr>
              ) : (
                filteredMeals.map((meal) => (
                  <tr key={meal.id}>
                    <td>
                      <strong className="d-block">{meal.title}</strong>
                      <small className="text-muted">{meal.district || 'Quartier non indiqué'}</small>
                    </td>
                    <td>{meal.host?.name || `Utilisateur #${meal.host_id}`}</td>
                    <td>{new Date(meal.meal_datetime).toLocaleString('fr-FR')}</td>
                    <td>{meal.remaining_places}/{meal.total_places}</td>
                    <td>{Number(meal.price_per_person).toFixed(2)} €</td>
                    <td><StatusBadge status={meal.status} /></td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Link className="btn btn-sm btn-outline-success" to={`/repas/${meal.id}`}>Voir</Link>
                        <select
                          className="form-select form-select-sm admin-status-select"
                          value={meal.status}
                          disabled={processingId === meal.id}
                          onChange={(event) => updateStatus(meal, event.target.value)}
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>{statusLabel(item)}</option>
                          ))}
                        </select>
                      </div>
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

function statusLabel(status) {
  return {
    open: 'Ouvert',
    full: 'Complet',
    finished: 'Terminé',
    cancelled: 'Annulé',
  }[status] || status
}
