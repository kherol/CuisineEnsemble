import { Link } from 'react-router-dom'

const steps = [
  {
    title: 'Proposez',
    text: 'Un hôte publie un repas avec le plat, le prix, les places, le lieu et les allergènes.',
    icon: '👨‍🍳',
  },
  {
    title: 'Réservez',
    text: 'Les convives trouvent un repas selon leur quartier, leur budget et leurs contraintes alimentaires.',
    icon: '🍽️',
  },
  {
    title: 'Partagez',
    text: 'Le groupe échange dans le chat, se retrouve autour du repas puis laisse une note.',
    icon: '🤝',
  },
]

const highlights = [
  'Repas disponibles dans le quartier',
  'Allergies et régimes clairement indiqués',
  'Participation aux frais transparente',
  'Avis après chaque expérience',
]

export default function Home() {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill badge-soft mb-3">Repas partagés · Impact social</span>
              <h1 className="display-4 fw-bold mb-3">
                Partage un repas, rencontre ton quartier.
              </h1>
              <p className="lead text-muted mb-4">
                CuisineEnsemble facilite l’organisation de repas communautaires entre habitants pour réduire l’isolement alimentaire, découvrir de nouvelles cuisines et partager les coûts.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/repas" className="btn btn-success btn-lg px-4">Voir les repas</Link>
                <Link to="/inscription" className="btn btn-outline-success btn-lg px-4">Créer un compte</Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-card mx-auto">
                <div className="hero-food">🍲</div>
                <h2 className="h4 fw-bold">Dîner partagé ce soir</h2>
                <p className="text-muted mb-3">Mafé maison · 4 places restantes · 5 €/personne</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="tag">Sans porc</span>
                  <span className="tag">Quartier centre</span>
                  <span className="tag">Chat actif</span>
                </div>
                <div className="small text-muted">Déclaré par l’hôte : arachides possibles.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {steps.map((step) => (
            <div className="col-md-4" key={step.title}>
              <div className="card feature-card h-100">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">{step.icon}</div>
                  <h3 className="h5 fw-bold">{step.title}</h3>
                  <p className="text-muted mb-0">{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="impact-box p-4 p-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="fw-bold">Une application simple, mais avec un vrai impact social.</h2>
              <p className="text-muted mb-0">
                Le projet met en relation des personnes qui veulent cuisiner, partager ou simplement ne pas manger seules.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {highlights.map((item) => (
                  <div className="col-sm-6" key={item}>
                    <div className="check-item">✓ {item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
