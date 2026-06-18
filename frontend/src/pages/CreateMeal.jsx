import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

const dietaryOptions = ['Végétarien', 'Halal', 'Sans porc', 'Sans gluten', 'Sans lactose']
const allergyOptions = ['Arachides / fruits à coque', 'Poisson / crustacés', 'Gluten', 'Lactose', 'Œufs']

export default function CreateMeal() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDiets, setSelectedDiets] = useState([])
  const [selectedAllergies, setSelectedAllergies] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    meal_datetime: '',
    location: '',
    district: '',
    total_places: 4,
    price_per_person: 0,
    image_url: '',
  })

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  function toggle(item, list, setList) {
    setList(list.includes(item) ? list.filter((value) => value !== item) : [...list, item])
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const meal = await apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          total_places: Number(form.total_places),
          price_per_person: Number(form.price_per_person),
          allergens: selectedAllergies.join(', '),
          dietary_tags: selectedDiets.join(', '),
        }),
      })
      navigate(`/repas/${meal.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm auth-card">
            <div className="card-body p-4 p-lg-5">
              <span className="badge rounded-pill badge-soft mb-3">Hôte / cuisinier</span>
              <h1 className="fw-bold mb-2">Proposer un repas</h1>
              <p className="text-muted mb-4">Renseigne les informations essentielles pour permettre aux convives de réserver en confiance.</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Titre du repas</label>
                    <input className="form-control form-control-lg" placeholder="Ex : Couscous maison du samedi" value={form.title} onChange={(e) => update('title', e.target.value)} required />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="4" placeholder="Présente le plat, l’ambiance et les informations importantes." value={form.description} onChange={(e) => update('description', e.target.value)} required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Date et heure</label>
                    <input className="form-control" type="datetime-local" value={form.meal_datetime} onChange={(e) => update('meal_datetime', e.target.value)} required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Lieu</label>
                    <input className="form-control" placeholder="Adresse ou lieu de rendez-vous" value={form.location} onChange={(e) => update('location', e.target.value)} required />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Quartier</label>
                    <input className="form-control" placeholder="Ex : Orléans centre" value={form.district} onChange={(e) => update('district', e.target.value)} />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Nombre de places</label>
                    <input className="form-control" type="number" min="1" value={form.total_places} onChange={(e) => update('total_places', e.target.value)} required />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Prix par personne</label>
                    <input className="form-control" type="number" min="0" step="0.01" value={form.price_per_person} onChange={(e) => update('price_per_person', e.target.value)} required />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Image du plat</label>
                    <input className="form-control" placeholder="URL de l’image, optionnel" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label fw-semibold">Régimes alimentaires</label>
                  <div className="d-flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <button type="button" key={option} className={`choice-chip ${selectedDiets.includes(option) ? 'active' : ''}`} onClick={() => toggle(option, selectedDiets, setSelectedDiets)}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label fw-semibold">Allergènes possibles</label>
                  <div className="d-flex flex-wrap gap-2">
                    {allergyOptions.map((option) => (
                      <button type="button" key={option} className={`choice-chip ${selectedAllergies.includes(option) ? 'active danger' : ''}`} onClick={() => toggle(option, selectedAllergies, setSelectedAllergies)}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-success btn-lg w-100 mt-4" disabled={loading}>
                  {loading ? 'Publication...' : 'Publier le repas'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
