import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, setToken } from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      setToken(data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card"><div className="card-body">
          <h1 className="h3 mb-3">Connexion</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input className="form-control mb-3" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
            <input className="form-control mb-3" placeholder="Mot de passe" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
            <button className="btn btn-success w-100">Se connecter</button>
          </form>
        </div></div>
      </div>
    </div>
  )
}
