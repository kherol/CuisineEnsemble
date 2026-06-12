import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MealDetail() {
  const { id } = useParams()
  const [meal, setMeal] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`/meals/${id}`).then(setMeal).catch(err => setError(err.message))
  }, [id])

  async function reserve() {
    setError(''); setMessage('')
    try {
      await apiFetch(`/reservations/meals/${id}`, { method: 'POST', body: JSON.stringify({ places: 1 }) })
      setMessage('Demande de réservation envoyée à l’hôte.')
    } catch (err) { setError(err.message) }
  }

  if (!meal) return <p>Chargement...</p>

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="card"><div className="card-body">
          <h1 className="h3">{meal.title}</h1>
          <p className="text-muted">Proposé par {meal.host?.name || 'un hôte'}</p>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <p>{meal.description}</p>
          <hr />
          <p><strong>Date :</strong> {new Date(meal.meal_datetime).toLocaleString()}</p>
          <p><strong>Lieu :</strong> {meal.location}</p>
          <p><strong>Prix :</strong> {meal.price_per_person} € / personne</p>
          <p><strong>Places restantes :</strong> {meal.remaining_places}</p>
          <p><strong>Régime :</strong> {meal.dietary_tags || 'Non précisé'}</p>
          <p><strong>Allergènes :</strong> {meal.allergens || 'Non précisé'}</p>
          <button className="btn btn-success me-2" onClick={reserve}>Réserver une place</button>
          <Link className="btn btn-outline-secondary" to={`/chat/${meal.id}`}>Accéder au chat</Link>
        </div></div>
      </div>
    </div>
  )
}
