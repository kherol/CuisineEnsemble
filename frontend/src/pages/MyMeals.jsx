import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MyMeals() {
  const [meals, setMeals] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try { setMeals(await apiFetch('/meals/mine')) } catch (err) { setError(err.message) }
  }
  useEffect(() => { load() }, [])

  async function cancelMeal(id) {
    if (!confirm('Annuler ce repas ?')) return
    await apiFetch(`/meals/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <h1 className="h3 mb-3">Mes repas proposés</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {meals.map(meal => (
          <div className="list-group-item" key={meal.id}>
            <div className="d-flex justify-content-between">
              <div><strong>{meal.title}</strong><br /><span className="text-muted">{meal.status} · {meal.remaining_places} places restantes</span></div>
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-outline-success" to={`/repas/${meal.id}`}>Détail</Link>
                <Link className="btn btn-sm btn-outline-primary" to={`/chat/${meal.id}`}>Chat</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => cancelMeal(meal.id)}>Annuler</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
