import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch, getToken } from '../api.js'

export default function MealDetail() {
  const { id } = useParams()
  const [meal, setMeal] = useState(null)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadMeal() {
    setError('')
    try {
      setMeal(await apiFetch(`/meals/${id}`))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadMeal()
  }, [id])

  async function reserve() {
    setMessage('')
    setError('')
    setLoading(true)
    try {
      await apiFetch(`/reservations/meals/${id}`, {
        method: 'POST',
        body: JSON.stringify({ places: 1, note_to_host: '' }),
      })
      setMessage('Demande de réservation envoyée. L’hôte doit encore l’accepter.')
      await loadMeal()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function sendReview(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await apiFetch(`/reviews/meals/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          reviewed_id: meal.host_id,
          rating: Number(review.rating),
          comment: review.comment,
        }),
      })
      setReview({ rating: 5, comment: '' })
      setMessage('Avis envoyé avec succès.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && !meal) {
    return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>
  }

  if (!meal) {
    return <div className="container py-4"><p>Chargement du repas...</p></div>
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm overflow-hidden">
            {meal.image_url ? (
              <img src={meal.image_url} className="meal-detail-image" alt={meal.title} />
            ) : (
              <div className="meal-detail-placeholder">🍲</div>
            )}
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                <div>
                  <span className="badge rounded-pill badge-soft mb-2">{meal.status}</span>
                  <h1 className="fw-bold mb-1">{meal.title}</h1>
                  <p className="text-muted mb-0">Proposé par {meal.host?.name || 'un hôte CuisineEnsemble'}</p>
                </div>
                <span className="badge text-bg-success fs-6">{meal.price_per_person} € / pers.</span>
              </div>

              <hr />

              <p className="lead">{meal.description}</p>

              <div className="row g-3 mt-2">
                <InfoItem label="Date" value={new Date(meal.meal_datetime).toLocaleString('fr-FR')} />
                <InfoItem label="Lieu" value={meal.location} />
                <InfoItem label="Quartier" value={meal.district || 'Non précisé'} />
                <InfoItem label="Places" value={`${meal.remaining_places}/${meal.total_places} restantes`} />
                <InfoItem label="Régime" value={meal.dietary_tags || 'Non précisé'} />
                <InfoItem label="Allergènes" value={meal.allergens || 'Non précisé'} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold">Réserver une place</h2>
              <p className="text-muted">Une demande sera envoyée à l’hôte. Il pourra l’accepter ou la refuser.</p>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              {getToken() ? (
                <button className="btn btn-success btn-lg w-100" onClick={reserve} disabled={loading || meal.remaining_places <= 0}>
                  {loading ? 'Envoi...' : meal.remaining_places <= 0 ? 'Repas complet' : 'Demander une place'}
                </button>
              ) : (
                <Link className="btn btn-success btn-lg w-100" to="/connexion">Se connecter pour réserver</Link>
              )}

              {getToken() && (
                <Link className="btn btn-outline-primary w-100 mt-2" to={`/chat/${meal.id}`}>Accéder au chat</Link>
              )}
            </div>
          </div>

          {getToken() && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold">Noter l’hôte après le repas</h2>
                <p className="text-muted small">Disponible uniquement si tu as une réservation acceptée sur ce repas.</p>
                <form onSubmit={sendReview}>
                  <label className="form-label">Note</label>
                  <select className="form-select mb-3" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                    <option value="5">5 — Excellent</option>
                    <option value="4">4 — Très bien</option>
                    <option value="3">3 — Correct</option>
                    <option value="2">2 — Moyen</option>
                    <option value="1">1 — Mauvais</option>
                  </select>
                  <label className="form-label">Commentaire</label>
                  <textarea className="form-control mb-3" rows="3" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Ton retour sur le repas..." />
                  <button className="btn btn-outline-success w-100">Envoyer l’avis</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="col-md-6">
      <div className="info-item">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}
