import { Link, useNavigate } from 'react-router-dom'
import { getToken, logout } from '../api.js'

export default function AppNavbar() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(getToken())

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success" to="/">🍲 CuisineEnsemble</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><Link className="nav-link" to="/repas">Repas</Link></li>
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/proposer">Proposer</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
            {!isLoggedIn && <li className="nav-item"><Link className="btn btn-outline-success" to="/connexion">Connexion</Link></li>}
            {!isLoggedIn && <li className="nav-item"><Link className="btn btn-success" to="/inscription">Inscription</Link></li>}
            {isLoggedIn && <li className="nav-item"><button className="btn btn-outline-danger" onClick={handleLogout}>Déconnexion</button></li>}
          </ul>
        </div>
      </div>
    </nav>
  )
}
