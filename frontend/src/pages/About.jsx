import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <span className="badge rounded-pill badge-soft mb-3">À propos du projet</span>
          <h1 className="display-6 fw-bold mb-4">CuisineEnsemble lutte contre l’isolement alimentaire grâce aux repas partagés.</h1>

          <div className="row g-4 mb-5">
            <div className="col-lg-7">
              <p className="lead text-muted">
                L’objectif est de permettre aux habitants d’un même quartier de proposer ou rejoindre des repas communautaires, avec une organisation claire : nombre de places, prix par personne, allergies, régimes alimentaires, chat de groupe et notation.
              </p>
              <p className="text-muted">
                Le projet s’adresse aux étudiants, nouveaux arrivants, familles, personnes seules ou habitants qui souhaitent découvrir d’autres cuisines tout en partageant les coûts.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold">Mission</h2>
                  <p className="text-muted mb-0">
                    Faciliter l’organisation de repas communautaires, favoriser les rencontres locales et rendre l’alimentation plus conviviale et accessible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="about-card">
                <div className="about-icon">👨‍🍳</div>
                <h3 className="h5 fw-bold">Hôte</h3>
                <p className="text-muted mb-0">Il propose un repas, fixe le prix, indique les places, les allergies et accepte les participants.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="about-card">
                <div className="about-icon">🍽️</div>
                <h3 className="h5 fw-bold">Convive</h3>
                <p className="text-muted mb-0">Il consulte les repas disponibles, filtre selon ses besoins, réserve une place et participe au chat.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="about-card">
                <div className="about-icon">🛡️</div>
                <h3 className="h5 fw-bold">Admin</h3>
                <p className="text-muted mb-0">Il modère les repas, les utilisateurs, les signalements et suit les statistiques de la plateforme.</p>
              </div>
            </div>
          </div>

          <div className="cta-box text-center p-4 p-lg-5">
            <h2 className="h3 fw-bold">Prêt à rejoindre un repas partagé ?</h2>
            <p className="text-muted">Crée ton compte et commence à découvrir les repas autour de toi.</p>
            <Link to="/inscription" className="btn btn-success btn-lg">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
