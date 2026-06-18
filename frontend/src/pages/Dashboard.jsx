import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [myMeals, setMyMeals] = useState([])
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [me, meals, res] = await Promise.all([
          apiFetch('/auth/me'),
          apiFetch('/meals/mine'),
          apiFetch('/reservations/mine'),
        ])
        setUser(me)
        setMyMeals(meals)
        setReservations(res)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  const acceptedReservations = reservations.filter((reservation) => reservation.status === 'accepted')
  const pendingReservations = reservations.filter((reservation) => reservation.status === 'pending')

  return (
    <div className="container py-4">
      <div className="dashboard-hero mb-4">
        <div>
          <span className="badge rounded-pill badge-soft mb-3">Espace connecté</span>
          <h1 className="fw-bold mb-2">Bonjour {user?.name || ''} 👋</h1>
          <p className="text-muted mb-0">
            Gère tes repas, tes réservations, ton profil et tes discussions CuisineEnsemble.
          </p>
        </div>
        <Link className="btn btn-success btn-lg" to="/proposer">Proposer un repas</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <StatCard title="Repas proposés" value={myMeals.length} icon="🍲" />
        <StatCard title="Réservations" value={reservations.length} icon="📅" />
        <StatCard title="Acceptées" value={acceptedReservations.length} icon="✅" />
        <StatCard title="En attente" value={pendingReservations.length} icon="⏳" />
      </div>

      <div className="row g-3">
        <DashboardCard
          title="Liste des repas"
          text="Voir les repas disponibles et réserver une place."
          href="/repas"
          button="Voir les repas"
        />
        <DashboardCard
          title="Proposer un repas"
          text="Créer un repas avec plat, lieu, prix, places et allergies."
          href="/proposer"
          button="Créer"
        />
        <DashboardCard
          title="Mes repas proposés"
          text="Suivre les réservations, accepter ou refuser des convives."
          href="/mes-repas"
          button="Gérer"
        />
        <DashboardCard
          title="Mes réservations"
          text="Voir les repas réservés, leur statut et accéder au chat."
          href="/mes-reservations"
          button="Consulter"
        />
        <DashboardCard
          title="Profil utilisateur"
          text="Modifier ton quartier, tes régimes et tes allergies."
          href="/profil"
          button="Modifier"
        />
        <DashboardCard
          title="Avis et notes"
          text="Voir les notes reçues après les repas."
          href="/avis"
          button="Voir mes avis"
        />
      </div>

      {user?.role === 'admin' && (
        <div className="alert alert-success mt-4 d-flex justify-content-between align-items-center">
          <span>Tu es administrateur. Tu peux accéder à l’espace de gestion.</span>
          <Link className="btn btn-outline-success" to="/admin">Dashboard admin</Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="card border-0 shadow-sm h-100 dashboard-stat">
        <div className="card-body">
          <div className="fs-3 mb-2">{icon}</div>
          <p className="text-muted mb-1">{title}</p>
          <h2 className="fw-bold mb-0">{value}</h2>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ title, text, href, button }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm h-100 feature-card">
        <div className="card-body p-4 d-flex flex-column">
          <h5 className="fw-bold">{title}</h5>
          <p className="text-muted flex-grow-1">{text}</p>
          <Link className="btn btn-outline-success" to={href}>{button}</Link>
        </div>
      </div>
    </div>
  )
}
