import { Link } from 'react-router-dom'

export default function Dashboard() {
  const cards = [
    ['Proposer un repas', '/proposer', 'Créer un repas avec prix, places, lieu et allergies.'],
    ['Mes repas proposés', '/mes-repas', 'Gérer les réservations et participants.'],
    ['Mes réservations', '/mes-reservations', 'Suivre les repas auxquels je participe.'],
    ['Mon profil', '/profil', 'Modifier mes infos et contraintes alimentaires.'],
    ['Admin', '/admin', 'Accéder au dashboard administrateur.']
  ]
  return (
    <div>
      <h1 className="h3 mb-3">Tableau de bord</h1>
      <div className="row g-3">
        {cards.map(([title, href, text]) => (
          <div className="col-md-6 col-lg-4" key={href}>
            <div className="card h-100"><div className="card-body">
              <h5>{title}</h5><p className="text-muted">{text}</p>
              <Link className="btn btn-outline-success" to={href}>Ouvrir</Link>
            </div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
