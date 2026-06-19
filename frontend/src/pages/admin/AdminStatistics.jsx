import { useEffect, useState } from 'react'
import { apiFetch } from '../../api.js'
import { AdminLoading, AdminStatCard } from './AdminDashboard.jsx'

export default function AdminStatistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStats() {
      try {
        setStats(await apiFetch('/admin/stats'))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <AdminLoading text="Chargement des statistiques..." />
  }

  const activeRate = percentage(stats?.active_users, stats?.users)
  const openMealRate = percentage(stats?.open_meals, stats?.meals)
  const acceptedRate = percentage(stats?.accepted_reservations, stats?.reservations)
  const closedReportRate = percentage(stats?.closed_reports, stats?.reports)

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Analyse</span>
          <h1 className="fw-bold mb-2">Statistiques</h1>
          <p className="text-muted mb-0">Mesure l’activité et l’état général de CuisineEnsemble.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          <div className="row g-3 mb-4">
            <AdminStatCard title="Utilisateurs" value={stats.users} icon="👥" />
            <AdminStatCard title="Repas proposés" value={stats.meals} icon="🍲" />
            <AdminStatCard title="Réservations" value={stats.reservations} icon="📅" />
            <AdminStatCard title="Avis publiés" value={stats.reviews} icon="⭐" />
          </div>

          <div className="row g-4">
            <div className="col-xl-7">
              <div className="card border-0 shadow-sm admin-panel h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-4">Indicateurs de fonctionnement</h2>
                  <MetricBar label="Utilisateurs actifs" value={activeRate} detail={`${stats.active_users}/${stats.users}`} />
                  <MetricBar label="Repas actuellement ouverts" value={openMealRate} detail={`${stats.open_meals}/${stats.meals}`} />
                  <MetricBar label="Réservations acceptées" value={acceptedRate} detail={`${stats.accepted_reservations}/${stats.reservations}`} />
                  <MetricBar label="Signalements fermés" value={closedReportRate} detail={`${stats.closed_reports}/${stats.reports}`} />
                </div>
              </div>
            </div>

            <div className="col-xl-5">
              <div className="card border-0 shadow-sm admin-panel h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-4">Répartition détaillée</h2>
                  <StatLine label="Utilisateurs actifs" value={stats.active_users} />
                  <StatLine label="Utilisateurs bloqués" value={stats.blocked_users} />
                  <StatLine label="Repas ouverts" value={stats.open_meals} />
                  <StatLine label="Repas complets" value={stats.full_meals} />
                  <StatLine label="Repas terminés" value={stats.finished_meals} />
                  <StatLine label="Repas annulés" value={stats.cancelled_meals} />
                  <StatLine label="Signalements ouverts" value={stats.open_reports} />
                  <StatLine label="Signalements en cours" value={stats.in_progress_reports} />
                  <StatLine label="Signalements fermés" value={stats.closed_reports} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function percentage(value = 0, total = 0) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

function MetricBar({ label, value, detail }) {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between mb-2">
        <strong>{label}</strong>
        <span className="text-muted">{detail} · {value}%</span>
      </div>
      <div className="progress admin-progress" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar bg-success" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function StatLine({ label, value }) {
  return (
    <div className="admin-stat-line">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  )
}
