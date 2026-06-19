import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../../api.js'
import { AdminLoading, StatusBadge } from './AdminDashboard.jsx'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await apiFetch('/admin/reports')
        setReports(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  const filteredReports = useMemo(
    () => reports.filter((report) => status === 'all' || report.status === status),
    [reports, status],
  )

  async function updateReportStatus(report, nextStatus) {
    setProcessingId(report.id)
    setMessage('')
    setError('')

    try {
      const updated = await apiFetch(
        `/admin/reports/${report.id}/status?status=${encodeURIComponent(nextStatus)}`,
        { method: 'PATCH' },
      )
      setReports((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setMessage('Signalement mis à jour.')
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <AdminLoading text="Chargement des signalements..." />
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Modération</span>
          <h1 className="fw-bold mb-2">Signalements</h1>
          <p className="text-muted mb-0">Examine et traite les contenus ou comportements signalés.</p>
        </div>
        <span className="admin-count-badge">{filteredReports.length} signalement(s)</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm admin-panel mb-4">
        <div className="card-body p-4">
          <div className="row align-items-end g-3">
            <div className="col-md-5">
              <label className="form-label fw-semibold">Filtrer par statut</label>
              <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Tous</option>
                <option value="open">Ouverts</option>
                <option value="in_progress">En cours</option>
                <option value="closed">Fermés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredReports.length === 0 ? (
          <div className="col-12">
            <div className="empty-state">Aucun signalement dans cette catégorie.</div>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div className="col-lg-6" key={report.id}>
              <article className="card border-0 shadow-sm admin-panel h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between gap-3 mb-3">
                    <div>
                      <span className="text-muted small">Signalement #{report.id}</span>
                      <h2 className="h5 fw-bold mt-1 mb-0">{report.reason}</h2>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  <p className="text-muted">
                    {report.comment || 'Aucun commentaire complémentaire.'}
                  </p>

                  <div className="admin-report-meta mb-4">
                    <div>
                      <span>Déclaré par</span>
                      <strong>{report.reporter?.name || `Utilisateur #${report.reporter_id}`}</strong>
                    </div>
                    <div>
                      <span>Utilisateur concerné</span>
                      <strong>{report.reported_user?.name || (report.reported_user_id ? `Utilisateur #${report.reported_user_id}` : 'Aucun')}</strong>
                    </div>
                    <div>
                      <span>Repas concerné</span>
                      <strong>{report.meal?.title || (report.meal_id ? `Repas #${report.meal_id}` : 'Aucun')}</strong>
                    </div>
                    <div>
                      <span>Date</span>
                      <strong>{new Date(report.created_at).toLocaleString('fr-FR')}</strong>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <label className="form-label fw-semibold">Changer le statut</label>
                    <select
                      className="form-select"
                      value={report.status}
                      disabled={processingId === report.id}
                      onChange={(event) => updateReportStatus(report, event.target.value)}
                    >
                      <option value="open">Ouvert</option>
                      <option value="in_progress">En cours</option>
                      <option value="closed">Fermé</option>
                    </select>
                  </div>
                </div>
              </article>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
