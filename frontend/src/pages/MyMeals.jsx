import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MyMeals() {
  const [meals, setMeals] = useState([])
  const [reservationsByMeal, setReservationsByMeal] = useState({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    setError('')
    try {
      const myMeals = await apiFetch('/meals/mine')
      setMeals(myMeals)

      const entries = await Promise.all(
        myMeals.map(async (meal) => {
          try {
            const reservations = await apiFetch(`/reservations/meals/${meal.id}`)
            return [meal.id, reservations]
          } catch (_) {
            return [meal.id, []]
          }
        })
      )
      setReservationsByMeal(Object.fromEntries(entries))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function cancelMeal(id) {
    if (!confirm('Annuler ce repas ?')) return
    setMessage('')
    setError('')
    try {
      await apiFetch(`/meals/${id}`, { method: 'DELETE' })
      setMessage('Repas annulé.')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateReservation(reservationId, action) {
    setMessage('')
    setError('')
    try {
      await apiFetch(`/reservations/${reservationId}/${action}`, { method: 'PATCH' })
      setMessage(action === 'accept' ? 'Réservation acceptée.' : 'Réservation refusée.')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Espace hôte</span>
          <h1 className="fw-bold mb-1">Mes repas proposés</h1>
          <p className="text-muted mb-0">Gère tes repas, tes demandes de réservation et tes participants.</p>
        </div>
        <Link className="btn btn-success" to="/proposer">Proposer un nouveau repas</Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {meals.length === 0 ? (
        <div className="empty-state">
          <div className="fs-1 mb-2">👨‍🍳</div>
          <h2 className="h5">Tu n’as pas encore proposé de repas</h2>
          <p className="text-muted">Crée ton premier repas pour recevoir des demandes de convives.</p>
          <Link className="btn btn-success" to="/proposer">Créer un repas</Link>
        </div>
      ) : (
        <div className="accordion" id="myMealsAccordion">
          {meals.map((meal) => {
            const reservations = reservationsByMeal[meal.id] || []
            return (
              <div className="accordion-item border-0 shadow-sm mb-3" key={meal.id}>
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#meal-${meal.id}`}>
                    <div className="w-100 d-flex flex-column flex-lg-row justify-content-between pe-3">
                      <strong>{meal.title}</strong>
                      <span className="text-muted small">
                        {meal.status} · {meal.remaining_places}/{meal.total_places} places restantes · {reservations.length} demande(s)
                      </span>
                    </div>
                  </button>
                </h2>
                <div id={`meal-${meal.id}`} className="accordion-collapse collapse" data-bs-parent="#myMealsAccordion">
                  <div className="accordion-body">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Link className="btn btn-sm btn-outline-success" to={`/repas/${meal.id}`}>Voir détail</Link>
                      <Link className="btn btn-sm btn-outline-primary" to={`/chat/${meal.id}`}>Chat</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => cancelMeal(meal.id)}>Annuler le repas</button>
                    </div>

                    <h3 className="h6 fw-bold">Demandes de réservation</h3>
                    {reservations.length === 0 ? (
                      <p className="text-muted mb-0">Aucune demande pour ce repas.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th>Convive</th>
                              <th>Places</th>
                              <th>Allergies</th>
                              <th>Statut</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reservations.map((reservation) => (
                              <tr key={reservation.id}>
                                <td>
                                  <strong>{reservation.user?.name || `Utilisateur #${reservation.user_id}`}</strong><br />
                                  <small className="text-muted">{reservation.user?.email}</small>
                                </td>
                                <td>{reservation.places}</td>
                                <td>{reservation.user?.allergies || 'Non précisé'}</td>
                                <td><span className="badge text-bg-light">{reservation.status}</span></td>
                                <td className="text-end">
                                  {reservation.status === 'pending' ? (
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-outline-success" onClick={() => updateReservation(reservation.id, 'accept')}>Accepter</button>
                                      <button className="btn btn-outline-danger" onClick={() => updateReservation(reservation.id, 'refuse')}>Refuser</button>
                                    </div>
                                  ) : (
                                    <span className="text-muted small">Traité</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
