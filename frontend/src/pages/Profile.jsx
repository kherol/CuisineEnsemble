import { useEffect, useState } from 'react'
import { apiFetch } from '../api.js'

export default function Profile() {
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { apiFetch('/auth/me').then(setForm).catch(err => setError(err.message)) }, [])
  if (!form) return <p>Chargement...</p>
  function update(field, value) { setForm({ ...form, [field]: value }) }
  async function submit(e) {
    e.preventDefault(); setMessage(''); setError('')
    try {
      setForm(await apiFetch('/auth/me', { method: 'PATCH', body: JSON.stringify(form) }))
      setMessage('Profil mis à jour')
    } catch (err) { setError(err.message) }
  }
  return (
    <div className="row justify-content-center"><div className="col-lg-7">
      <div className="card"><div className="card-body">
        <h1 className="h3 mb-3">Mon profil</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <input className="form-control mb-3" value={form.name || ''} onChange={e => update('name', e.target.value)} />
          <input className="form-control mb-3" value={form.district || ''} onChange={e => update('district', e.target.value)} placeholder="Quartier" />
          <input className="form-control mb-3" value={form.dietary_preferences || ''} onChange={e => update('dietary_preferences', e.target.value)} placeholder="Préférences alimentaires" />
          <input className="form-control mb-3" value={form.allergies || ''} onChange={e => update('allergies', e.target.value)} placeholder="Allergies" />
          <button className="btn btn-success">Enregistrer</button>
        </form>
      </div></div>
    </div></div>
  )
}
