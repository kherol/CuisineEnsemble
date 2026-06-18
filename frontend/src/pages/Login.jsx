import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch, setToken } from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setToken(data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page container py-5">
      <div className="row justify-content-center align-items-center g-4">
        <div className="col-lg-5">
          <div className="auth-intro">
            <span className="badge rounded-pill badge-soft mb-3">Connexion</span>
            <h1 className="fw-bold">Ravi de te revoir.</h1>
            <p className="text-muted">
              Connecte-toi pour proposer un repas, réserver une place ou accéder à tes discussions de groupe.
            </p>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm auth-card">
            <div className="card-body p-4 p-lg-5">
              <h2 className="h3 fw-bold mb-3">Se connecter</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="exemple@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Mot de passe</label>
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Ton mot de passe"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                <button className="btn btn-success btn-lg w-100" disabled={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <p className="text-muted text-center mt-4 mb-0">
                Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
