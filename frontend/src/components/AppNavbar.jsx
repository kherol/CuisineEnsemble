import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getToken, logout } from '../api.js'

export default function AppNavbar() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(getToken())

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active fw-semibold text-success' : ''}`

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold brand-logo" to="/">
          <span className="brand-icon">🍲</span> CuisineEnsemble
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Ouvrir le menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><NavLink className={linkClass} to="/">Accueil</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/a-propos">À propos</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/repas">Repas</NavLink></li>

            {isLoggedIn && <li className="nav-item"><NavLink className={linkClass} to="/proposer">Proposer</NavLink></li>}
            {isLoggedIn && <li className="nav-item"><NavLink className={linkClass} to="/dashboard">Dashboard</NavLink></li>}

            {!isLoggedIn && (
              <li className="nav-item mt-2 mt-lg-0">
                <Link className="btn btn-outline-success" to="/connexion">Connexion</Link>
              </li>
            )}
            {!isLoggedIn && (
              <li className="nav-item mt-2 mt-lg-0">
                <Link className="btn btn-success" to="/inscription">Inscription</Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="nav-item mt-2 mt-lg-0">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Déconnexion</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
