import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try { setReservations(await apiFetch('/reservations/mine')) } catch (err) { setError(err.message) }
  }
  useEffect(() => { load() }, [])

  return (
    <div>
      <h1 className="h3 mb-3">Mes réservations</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {reservations.map(res => (
          <div className="list-group-item" key={res.id}>
            <div className="d-flex justify-content-between align-items-center">
              <div><strong>{res.meal?.title || `Repas #${res.meal_id}`}</strong><br /><span className="text-muted">Statut : {res.status}</span></div>
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-outline-success" to={`/repas/${res.meal_id}`}>Détail</Link>
                {res.status === 'accepted' && <Link className="btn btn-sm btn-outline-primary" to={`/chat/${res.meal_id}`}>Chat</Link>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
