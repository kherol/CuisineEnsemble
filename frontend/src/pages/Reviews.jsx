import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function Reviews() {
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const me = await apiFetch('/auth/me')
        setUser(me)
        setReviews(await apiFetch(`/reviews/users/${me.id}`))
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Avis et notes</span>
          <h1 className="fw-bold mb-1">Mes avis reçus</h1>
          <p className="text-muted mb-0">Consulte les notes reçues après tes repas ou participations.</p>
        </div>
        <div className="rating-summary">
          <span>⭐</span>
          <strong>{user?.average_rating || 0}/5</strong>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="fs-1 mb-2">⭐</div>
          <h2 className="h5">Aucun avis pour le moment</h2>
          <p className="text-muted mb-3">Les avis apparaîtront ici après les repas partagés.</p>
          <Link className="btn btn-success" to="/repas">Voir les repas</Link>
        </div>
      ) : (
        <div className="row g-3">
          {reviews.map((review) => (
            <div className="col-lg-6" key={review.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h2 className="h6 fw-bold mb-0">Repas #{review.meal_id}</h2>
                    <span className="badge text-bg-warning">{review.rating}/5</span>
                  </div>
                  <p className="mb-2">{review.comment || 'Aucun commentaire ajouté.'}</p>
                  <small className="text-muted">Reçu le {new Date(review.created_at).toLocaleString('fr-FR')}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
