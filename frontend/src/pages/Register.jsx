import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', district: '', dietary_preferences: '', allergies: ''
  })

  function update(field, value) { setForm({ ...form, [field]: value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(form) })
      navigate('/connexion')
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="row justify-content-center"><div className="col-lg-7">
      <div className="card"><div className="card-body">
        <h1 className="h3 mb-3">Créer un compte</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6"><input className="form-control" placeholder="Nom" value={form.name} onChange={e => update('name', e.target.value)} required /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Mot de passe" type="password" value={form.password} onChange={e => update('password', e.target.value)} required /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Quartier" value={form.district} onChange={e => update('district', e.target.value)} /></div>
            <div className="col-12"><input className="form-control" placeholder="Préférences alimentaires : halal, végétarien..." value={form.dietary_preferences} onChange={e => update('dietary_preferences', e.target.value)} /></div>
            <div className="col-12"><input className="form-control" placeholder="Allergies : gluten, lactose, arachides..." value={form.allergies} onChange={e => update('allergies', e.target.value)} /></div>
          </div>
          <button className="btn btn-success mt-3">S'inscrire</button>
        </form>
      </div></div>
    </div></div>
  )
}
