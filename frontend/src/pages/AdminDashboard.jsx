import { useEffect, useState } from 'react'
import { apiFetch } from '../api.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { apiFetch('/admin/stats').then(setStats).catch(err => setError(err.message)) }, [])
  return (
    <div>
      <h1 className="h3 mb-3">Dashboard administrateur</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {stats && <div className="row g-3">
        {Object.entries(stats).map(([key, value]) => (
          <div className="col-md-4" key={key}><div className="card"><div className="card-body"><h5>{key}</h5><p className="display-6">{value}</p></div></div></div>
        ))}
      </div>}
    </div>
  )
}
