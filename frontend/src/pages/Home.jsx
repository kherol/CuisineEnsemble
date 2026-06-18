import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, getToken } from '../api.js'

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
  const [featuredMeals, setFeaturedMeals] = useState([])
  const [mealsLoading, setMealsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()))

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(Boolean(getToken()))
    }

    window.addEventListener('auth-changed', updateAuthState)
    window.addEventListener('storage', updateAuthState)

    return () => {
      window.removeEventListener('auth-changed', updateAuthState)
      window.removeEventListener('storage', updateAuthState)
    }
  }, [])

  useEffect(() => {
    async function loadFeaturedMeals() {
      try {
        const meals = await apiFetch('/meals')
        setFeaturedMeals(meals.slice(0, 4))
      } catch (error) {
        console.error('Erreur chargement repas accueil:', error.message)
        setFeaturedMeals([])
      } finally {
        setMealsLoading(false)
      }
    }

    loadFeaturedMeals()
  }, [])

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill badge-soft mb-3">
                Repas partagés · Impact social
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Partage un repas, rencontre ton quartier.
              </h1>

              <p className="lead text-muted mb-4">
                CuisineEnsemble facilite l’organisation de repas communautaires entre habitants pour réduire l’isolement alimentaire, découvrir de nouvelles cuisines et partager les coûts.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/repas" className="btn btn-success btn-lg px-4">
                  Voir les repas
                </Link>

                {isLoggedIn ? (
                  <Link to="/proposer" className="btn btn-outline-success btn-lg px-4">
                    Proposer un repas
                  </Link>
                ) : (
                  <Link to="/inscription" className="btn btn-outline-success btn-lg px-4">
                    Créer un compte
                  </Link>
                )}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-card mx-auto">
                <div className="hero-food">🍲</div>
                <h2 className="h4 fw-bold">Dîner partagé ce soir</h2>
                <p className="text-muted mb-3">
                  Mafé maison · 4 places restantes · 5 €/personne
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="tag">Sans porc</span>
                  <span className="tag">Quartier centre</span>
                  <span className="tag">Chat actif</span>
                </div>
                <div className="small text-muted">
                  Déclaré par l’hôte : arachides possibles.
                </div>
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
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="badge rounded-pill badge-soft mb-3">
              Repas disponibles
            </span>
            <h2 className="fw-bold mb-2">
              Quelques repas à rejoindre
            </h2>
            <p className="text-muted mb-0">
              Découvrez des repas proposés par des hôtes de votre quartier.
            </p>
          </div>

          <Link to="/repas" className="btn btn-outline-success">
            Voir tous les repas
          </Link>
        </div>

        {mealsLoading ? (
          <div className="alert alert-light border">
            Chargement des repas disponibles...
          </div>
        ) : featuredMeals.length === 0 ? (
          <div className="alert alert-light border">
            Aucun repas disponible pour le moment.
          </div>
        ) : (
          <div className="row g-4">
            {featuredMeals.map((meal) => (
              <div className="col-md-6 col-lg-3" key={meal.id}>
                <div className="card feature-card h-100">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="tag">
                        {meal.remaining_places} place{meal.remaining_places > 1 ? 's' : ''}
                      </span>

                      <span className="fw-bold text-success">
                        {meal.price_per_person} €
                      </span>
                    </div>

                    <h3 className="h5 fw-bold mb-2">
                      {meal.title}
                    </h3>

                    <p className="text-muted small mb-3">
                      {meal.description?.length > 85
                        ? `${meal.description.slice(0, 85)}...`
                        : meal.description}
                    </p>

                    <div className="small text-muted mb-2">
                      📍 {meal.district}
                    </div>

                    <div className="small text-muted mb-2">
                      🍽️ {meal.dietary_tags || 'Régime non précisé'}
                    </div>

                    <div className="small text-muted mb-3">
                      ⚠️ {meal.allergens || 'Allergènes non précisés'}
                    </div>

                    <div className="mt-auto">
                      <Link to={`/repas/${meal.id}`} className="btn btn-success w-100">
                        Voir le repas
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container pb-5">
        <div className="impact-box p-4 p-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="fw-bold">
                Une application simple, mais avec un vrai impact social.
              </h2>
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
