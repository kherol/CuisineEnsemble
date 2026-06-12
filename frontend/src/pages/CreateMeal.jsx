import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function CreateMeal() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', meal_datetime: '', location: '', district: '', total_places: 4,
    price_per_person: 0, allergens: '', dietary_tags: '', image_url: ''
  })
  function update(field, value) { setForm({ ...form, [field]: value }) }
  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify({ ...form, total_places: Number(form.total_places), price_per_person: Number(form.price_per_person) })
      })
      navigate('/mes-repas')
    } catch (err) { setError(err.message) }
  }
  return (
    <div className="row justify-content-center"><div className="col-lg-8">
      <div className="card"><div className="card-body">
        <h1 className="h3 mb-3">Proposer un repas</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <input className="form-control mb-3" placeholder="Titre du repas" value={form.title} onChange={e => update('title', e.target.value)} required />
          <textarea className="form-control mb-3" placeholder="Description" rows="4" value={form.description} onChange={e => update('description', e.target.value)} required />
          <div className="row g-3">
            <div className="col-md-6"><input className="form-control" type="datetime-local" value={form.meal_datetime} onChange={e => update('meal_datetime', e.target.value)} required /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Lieu" value={form.location} onChange={e => update('location', e.target.value)} required /></div>
            <div className="col-md-4"><input className="form-control" placeholder="Quartier" value={form.district} onChange={e => update('district', e.target.value)} /></div>
            <div className="col-md-4"><input className="form-control" type="number" placeholder="Places" value={form.total_places} onChange={e => update('total_places', e.target.value)} required /></div>
            <div className="col-md-4"><input className="form-control" type="number" step="0.01" placeholder="Prix" value={form.price_per_person} onChange={e => update('price_per_person', e.target.value)} required /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Allergènes" value={form.allergens} onChange={e => update('allergens', e.target.value)} /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Régime alimentaire" value={form.dietary_tags} onChange={e => update('dietary_tags', e.target.value)} /></div>
            <div className="col-12"><input className="form-control" placeholder="URL image du plat" value={form.image_url} onChange={e => update('image_url', e.target.value)} /></div>
          </div>
          <button className="btn btn-success mt-3">Publier le repas</button>
        </form>
      </div></div>
    </div></div>
  )
}
