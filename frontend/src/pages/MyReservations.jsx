import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      setReservations(await apiFetch('/reservations/mine'))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function cancelReservation(id) {
    if (!confirm('Annuler cette réservation ?')) return
    setMessage('')
    setError('')
    try {
      await apiFetch(`/reservations/${id}/cancel`, { method: 'PATCH' })
      setMessage('Réservation annulée.')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <span className="badge rounded-pill badge-soft mb-2">Convive</span>
        <h1 className="fw-bold mb-1">Mes réservations</h1>
        <p className="text-muted mb-0">Suis les repas auxquels tu souhaites participer.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {reservations.length === 0 ? (
        <div className="empty-state">
          <div className="fs-1 mb-2">📅</div>
          <h2 className="h5">Aucune réservation pour l’instant</h2>
          <p className="text-muted">Trouve un repas disponible et réserve ta place.</p>
          <Link className="btn btn-success" to="/repas">Voir les repas</Link>
        </div>
      ) : (
        <div className="row g-3">
          {reservations.map((reservation) => (
            <div className="col-lg-6" key={reservation.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between gap-2 mb-2">
                    <h2 className="h5 fw-bold mb-0">{reservation.meal?.title || `Repas #${reservation.meal_id}`}</h2>
                    <StatusBadge status={reservation.status} />
                  </div>
                  <p className="text-muted mb-2">{reservation.meal?.description?.slice(0, 120)}</p>
                  <p className="mb-1">📍 {reservation.meal?.district || reservation.meal?.location || 'Lieu non précisé'}</p>
                  <p className="mb-3">📅 {reservation.meal ? new Date(reservation.meal.meal_datetime).toLocaleString('fr-FR') : 'Date non précisée'}</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-sm btn-outline-success" to={`/repas/${reservation.meal_id}`}>Détail</Link>
                    {reservation.status === 'accepted' && <Link className="btn btn-sm btn-outline-primary" to={`/chat/${reservation.meal_id}`}>Chat</Link>}
                    {reservation.status !== 'cancelled' && <button className="btn btn-sm btn-outline-danger" onClick={() => cancelReservation(reservation.id)}>Annuler</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const className = {
    pending: 'text-bg-warning',
    accepted: 'text-bg-success',
    refused: 'text-bg-danger',
    cancelled: 'text-bg-secondary',
  }[status] || 'text-bg-light'

  const label = {
    pending: 'En attente',
    accepted: 'Acceptée',
    refused: 'Refusée',
    cancelled: 'Annulée',
  }[status] || status

  return <span className={`badge ${className}`}>{label}</span>
}
