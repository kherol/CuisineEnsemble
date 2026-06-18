import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

const dietaryOptions = [
  'Végétarien',
  'Halal',
  'Sans porc',
  'Sans gluten',
  'Sans lactose',
]

const allergyOptions = [
  'Arachides / fruits à coque',
  'Poisson / crustacés',
  'Gluten',
  'Lactose',
  'Œufs',
]

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDiets, setSelectedDiets] = useState([])
  const [selectedAllergies, setSelectedAllergies] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    district: '',
  })

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  function toggleItem(item, list, setList) {
    setList(list.includes(item) ? list.filter((value) => value !== item) : [...list, item])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          dietary_preferences: selectedDiets.join(', '),
          allergies: selectedAllergies.join(', '),
        }),
      })
      navigate('/connexion')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm auth-card">
            <div className="card-body p-4 p-lg-5">
              <span className="badge rounded-pill badge-soft mb-3">Inscription</span>
              <h1 className="h2 fw-bold mb-2">Créer un compte</h1>
              <p className="text-muted mb-4">
                Rejoins CuisineEnsemble pour proposer ou réserver des repas partagés dans ton quartier.
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nom complet</label>
                    <input
                      className="form-control form-control-lg"
                      placeholder="Ton nom"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control form-control-lg"
                      placeholder="exemple@email.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mot de passe</label>
                    <input
                      className="form-control form-control-lg"
                      placeholder="Minimum 6 caractères"
                      type="password"
                      minLength="6"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Quartier / ville</label>
                    <input
                      className="form-control form-control-lg"
                      placeholder="Ex : Orléans centre"
                      value={form.district}
                      onChange={(e) => update('district', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label fw-semibold">Régimes alimentaires</label>
                  <div className="d-flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={`choice-chip ${selectedDiets.includes(option) ? 'active' : ''}`}
                        onClick={() => toggleItem(option, selectedDiets, setSelectedDiets)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label fw-semibold">Allergies</label>
                  <div className="d-flex flex-wrap gap-2">
                    {allergyOptions.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={`choice-chip ${selectedAllergies.includes(option) ? 'active danger' : ''}`}
                        onClick={() => toggleItem(option, selectedAllergies, setSelectedAllergies)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-success btn-lg w-100 mt-4" disabled={loading}>
                  {loading ? 'Création du compte...' : 'Créer mon compte'}
                </button>
              </form>

              <p className="text-muted text-center mt-4 mb-0">
                Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
