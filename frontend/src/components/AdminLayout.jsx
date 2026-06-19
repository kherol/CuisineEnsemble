import { NavLink, Outlet } from 'react-router-dom'
import '../admin.css'

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: '👥' },
  { to: '/admin/repas', label: 'Repas', icon: '🍲' },
  { to: '/admin/signalements', label: 'Signalements', icon: '🚨' },
  { to: '/admin/statistiques', label: 'Statistiques', icon: '📈' },
]

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`

  return (
    <div className="container-fluid admin-shell py-4">
      <div className="row g-4">
        <aside className="col-lg-3 col-xl-2">
          <div className="admin-sidebar sticky-lg-top">
            <div className="admin-sidebar-title">
              <span className="admin-sidebar-icon">🛡️</span>
              <div>
                <strong>Administration</strong>
                <small>CuisineEnsemble</small>
              </div>
            </div>

            <nav className="d-grid gap-2 mt-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={linkClass}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="admin-sidebar-help mt-4">
              <strong>Espace sécurisé</strong>
              <p className="mb-0">Ces pages sont accessibles uniquement aux comptes administrateurs.</p>
            </div>
          </div>
        </aside>

        <section className="col-lg-9 col-xl-10">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
