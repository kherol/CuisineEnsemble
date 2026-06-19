import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../api.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentMeals, setRecentMeals] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, users, meals, reports] = await Promise.all([
          apiFetch('/admin/stats'),
          apiFetch('/admin/users'),
          apiFetch('/admin/meals'),
          apiFetch('/admin/reports'),
        ])

        setStats(statsData)
        setRecentUsers(users.slice(0, 5))
        setRecentMeals(meals.slice(0, 5))
        setRecentReports(reports.slice(0, 5))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <AdminLoading text="Chargement du dashboard administrateur..." />
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Vue générale</span>
          <h1 className="fw-bold mb-2">Dashboard administrateur</h1>
          <p className="text-muted mb-0">Supervise les utilisateurs, les repas et la modération de la plateforme.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="row g-3 mb-4">
          <AdminStatCard title="Utilisateurs" value={stats.users} icon="👥" />
          <AdminStatCard title="Repas" value={stats.meals} icon="🍲" />
          <AdminStatCard title="Réservations" value={stats.reservations} icon="📅" />
          <AdminStatCard title="Signalements ouverts" value={stats.open_reports} icon="🚨" />
        </div>
      )}

      <div className="row g-4">
        <div className="col-xl-6">
          <DashboardListCard
            title="Derniers utilisateurs"
            action="Voir les utilisateurs"
            href="/admin/utilisateurs"
          >
            {recentUsers.length === 0 ? (
              <EmptyLine text="Aucun utilisateur." />
            ) : (
              recentUsers.map((user) => (
                <div className="admin-list-row" key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <span className={`badge ${user.is_active ? 'text-bg-success' : 'text-bg-secondary'}`}>
                    {user.is_active ? 'Actif' : 'Bloqué'}
                  </span>
                </div>
              ))
            )}
          </DashboardListCard>
        </div>

        <div className="col-xl-6">
          <DashboardListCard
            title="Derniers repas"
            action="Gérer les repas"
            href="/admin/repas"
          >
            {recentMeals.length === 0 ? (
              <EmptyLine text="Aucun repas." />
            ) : (
              recentMeals.map((meal) => (
                <div className="admin-list-row" key={meal.id}>
                  <div>
                    <strong>{meal.title}</strong>
                    <small>{meal.host?.name || 'Hôte inconnu'} · {meal.district || 'Quartier non indiqué'}</small>
                  </div>
                  <StatusBadge status={meal.status} />
                </div>
              ))
            )}
          </DashboardListCard>
        </div>

        <div className="col-12">
          <DashboardListCard
            title="Signalements récents"
            action="Traiter les signalements"
            href="/admin/signalements"
          >
            {recentReports.length === 0 ? (
              <EmptyLine text="Aucun signalement pour le moment." />
            ) : (
              recentReports.map((report) => (
                <div className="admin-list-row" key={report.id}>
                  <div>
                    <strong>{report.reason}</strong>
                    <small>
                      Signalé par {report.reporter?.name || `Utilisateur #${report.reporter_id}`}
                    </small>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
              ))
            )}
          </DashboardListCard>
        </div>
      </div>
    </div>
  )
}

export function AdminLoading({ text }) {
  return (
    <div className="admin-loading">
      <div className="spinner-border text-success" role="status" />
      <p className="text-muted mt-3 mb-0">{text}</p>
    </div>
  )
}

export function AdminStatCard({ title, value, icon }) {
  return (
    <div className="col-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100 admin-stat-card">
        <div className="card-body p-4">
          <div className="admin-stat-icon mb-3">{icon}</div>
          <p className="text-muted mb-1">{title}</p>
          <h2 className="fw-bold mb-0">{value ?? 0}</h2>
        </div>
      </div>
    </div>
  )
}

function DashboardListCard({ title, action, href, children }) {
  return (
    <div className="card border-0 shadow-sm admin-panel h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">{title}</h2>
          <Link className="btn btn-sm btn-outline-success" to={href}>{action}</Link>
        </div>
        <div className="d-grid gap-2">{children}</div>
      </div>
    </div>
  )
}

function EmptyLine({ text }) {
  return <div className="text-muted py-3">{text}</div>
}

export function StatusBadge({ status }) {
  const classes = {
    open: 'text-bg-success',
    active: 'text-bg-success',
    accepted: 'text-bg-success',
    full: 'text-bg-primary',
    pending: 'text-bg-warning',
    in_progress: 'text-bg-warning',
    closed: 'text-bg-secondary',
    cancelled: 'text-bg-danger',
    refused: 'text-bg-danger',
    finished: 'text-bg-dark',
  }

  const labels = {
    open: 'Ouvert',
    active: 'Actif',
    accepted: 'Acceptée',
    full: 'Complet',
    pending: 'En attente',
    in_progress: 'En cours',
    closed: 'Fermé',
    cancelled: 'Annulé',
    refused: 'Refusée',
    finished: 'Terminé',
  }

  return (
    <span className={`badge ${classes[status] || 'text-bg-secondary'}`}>
      {labels[status] || status}
    </span>
  )
}
