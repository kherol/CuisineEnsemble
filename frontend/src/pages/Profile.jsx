import { useEffect, useState } from 'react'
import { apiFetch } from '../api.js'

const dietaryOptions = ['Végétarien', 'Halal', 'Sans porc', 'Sans gluten', 'Sans lactose']
const allergyOptions = ['Arachides / fruits à coque', 'Poisson / crustacés', 'Gluten', 'Lactose', 'Œufs']

export default function Profile() {
  const [form, setForm] = useState(null)
  const [selectedDiets, setSelectedDiets] = useState([])
  const [selectedAllergies, setSelectedAllergies] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const user = await apiFetch('/auth/me')
        setForm(user)
        setSelectedDiets(splitValues(user.dietary_preferences))
        setSelectedAllergies(splitValues(user.allergies))
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  function toggle(item, list, setList) {
    setList(list.includes(item) ? list.filter((value) => value !== item) : [...list, item])
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const updated = await apiFetch('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: form.name,
          district: form.district,
          dietary_preferences: selectedDiets.join(', '),
          allergies: selectedAllergies.join(', '),
        }),
      })
      setForm(updated)
      setMessage('Profil mis à jour avec succès.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && !form) {
    return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>
  }

  if (!form) {
    return <div className="container py-4"><p>Chargement du profil...</p></div>
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm auth-card">
            <div className="card-body p-4 p-lg-5">
              <span className="badge rounded-pill badge-soft mb-3">Profil utilisateur</span>
              <h1 className="fw-bold mb-2">Mon profil</h1>
              <p className="text-muted mb-4">Mets à jour tes informations, ton quartier et tes contraintes alimentaires.</p>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nom</label>
                    <input className="form-control" value={form.name || ''} onChange={(e) => update('name', e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={form.email || ''} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Quartier / ville</label>
                    <input className="form-control" value={form.district || ''} onChange={(e) => update('district', e.target.value)} placeholder="Ex : Orléans centre" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Note moyenne</label>
                    <input className="form-control" value={`${form.average_rating || 0}/5`} disabled />
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
                  <label className="form-label fw-semibold">Allergies</label>
                  <div className="d-flex flex-wrap gap-2">
                    {allergyOptions.map((option) => (
                      <button type="button" key={option} className={`choice-chip ${selectedAllergies.includes(option) ? 'active danger' : ''}`} onClick={() => toggle(option, selectedAllergies, setSelectedAllergies)}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-success btn-lg w-100 mt-4">Enregistrer les modifications</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function splitValues(value) {
  if (!value) return []
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}
