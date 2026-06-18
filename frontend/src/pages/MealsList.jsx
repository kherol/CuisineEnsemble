import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MealsList() {
  const [meals, setMeals] = useState([])
  const [filters, setFilters] = useState({ district: '', max_price: '', dietary: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadMeals(e) {
    if (e) e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (filters.district) params.set('district', filters.district)
      if (filters.max_price) params.set('max_price', filters.max_price)
      if (filters.dietary) params.set('dietary', filters.dietary)
      const query = params.toString() ? `?${params.toString()}` : ''
      setMeals(await apiFetch(`/meals${query}`))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
  }, [])

  function resetFilters() {
    setFilters({ district: '', max_price: '', dietary: '' })
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Repas disponibles</span>
          <h1 className="fw-bold mb-1">Trouver un repas dans ton quartier</h1>
          <p className="text-muted mb-0">Filtre selon ton budget, ton quartier ou ton régime alimentaire.</p>
        </div>
        <Link className="btn btn-success" to="/proposer">Proposer un repas</Link>
      </div>

      <form className="card border-0 shadow-sm mb-4" onSubmit={loadMeals}>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Quartier</label>
              <input
                className="form-control"
                placeholder="Ex : Orléans centre"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Prix max</label>
              <input
                className="form-control"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex : 8"
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Régime</label>
              <input
                className="form-control"
                placeholder="Halal, végétarien..."
                value={filters.dietary}
                onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
              />
            </div>
            <div className="col-md-2 d-grid gap-2">
              <button className="btn btn-success" disabled={loading}>{loading ? 'Recherche...' : 'Filtrer'}</button>
              <button className="btn btn-outline-secondary" type="button" onClick={resetFilters}>Reset</button>
            </div>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {meals.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="fs-1 mb-2">🍽️</div>
          <h2 className="h5">Aucun repas disponible pour le moment</h2>
          <p className="text-muted mb-0">Tu peux proposer le premier repas de ton quartier.</p>
        </div>
      ) : (
        <div className="row g-3">
          {meals.map((meal) => (
            <div className="col-md-6 col-lg-4" key={meal.id}>
              <MealCard meal={meal} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MealCard({ meal }) {
  return (
    <div className="card border-0 shadow-sm card-meal h-100">
      {meal.image_url ? (
        <img src={meal.image_url} className="meal-image" alt={meal.title} />
      ) : (
        <div className="meal-image-placeholder">🍲</div>
      )}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2 mb-2">
          <h5 className="fw-bold mb-0">{meal.title}</h5>
          <span className="badge text-bg-success align-self-start">{meal.price_per_person} €</span>
        </div>
        <p className="text-muted small flex-grow-1">{meal.description?.slice(0, 110)}{meal.description?.length > 110 ? '...' : ''}</p>
        <p className="mb-1">📍 {meal.district || meal.location}</p>
        <p className="mb-1">📅 {new Date(meal.meal_datetime).toLocaleString('fr-FR')}</p>
        <p className="mb-3">👥 {meal.remaining_places}/{meal.total_places} places restantes</p>
        <Link to={`/repas/${meal.id}`} className="btn btn-success w-100 mt-auto">Voir le détail</Link>
      </div>
    </div>
  )
}
