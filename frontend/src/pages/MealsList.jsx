import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function MealsList() {
  const [meals, setMeals] = useState([])
  const [filters, setFilters] = useState({ district: '', max_price: '', dietary: '' })
  const [error, setError] = useState('')

  async function loadMeals() {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const query = params.toString() ? `?${params.toString()}` : ''
      setMeals(await apiFetch(`/meals${query}`))
    } catch (err) { setError(err.message) }
  }

  useEffect(() => { loadMeals() }, [])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Repas disponibles</h1>
        <button className="btn btn-outline-success" onClick={loadMeals}>Filtrer</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4"><div className="card-body">
        <div className="row g-2">
          <div className="col-md-4"><input className="form-control" placeholder="Quartier" value={filters.district} onChange={e => setFilters({...filters, district: e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Prix max" type="number" value={filters.max_price} onChange={e => setFilters({...filters, max_price: e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Régime : halal, végétarien..." value={filters.dietary} onChange={e => setFilters({...filters, dietary: e.target.value})} /></div>
        </div>
      </div></div>
      <div className="row g-3">
        {meals.map(meal => (
          <div className="col-md-6 col-lg-4" key={meal.id}>
            <div className="card card-meal h-100"><div className="card-body">
              <h5>{meal.title}</h5>
              <p className="text-muted small">{meal.description?.slice(0, 90)}...</p>
              <p className="mb-1">📍 {meal.district || meal.location}</p>
              <p className="mb-1">💶 {meal.price_per_person} € / personne</p>
              <p className="mb-3">👥 {meal.remaining_places} places restantes</p>
              <Link to={`/repas/${meal.id}`} className="btn btn-success w-100">Voir détail</Link>
            </div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
