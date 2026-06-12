import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="hero mb-4">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="badge badge-soft mb-3">Repas partagés · Impact social</span>
            <h1 className="display-5 fw-bold">Mangez ensemble, partagez plus qu’un repas.</h1>
            <p className="lead text-muted">
              CuisineEnsemble aide les habitants d’un quartier à proposer, réserver et organiser des repas communautaires.
            </p>
            <div className="d-flex gap-2">
              <Link to="/repas" className="btn btn-success btn-lg">Voir les repas</Link>
              <Link to="/proposer" className="btn btn-outline-success btn-lg">Proposer un repas</Link>
            </div>
          </div>
          <div className="col-lg-5 text-center fs-1 d-none d-lg-block">🍲 🥗 🍛</div>
        </div>
      </section>

      <div className="row g-3">
        <div className="col-md-4"><div className="card h-100"><div className="card-body"><h5>1. Proposez</h5><p>Un hôte crée un repas avec prix, places, lieu et allergies.</p></div></div></div>
        <div className="col-md-4"><div className="card h-100"><div className="card-body"><h5>2. Réservez</h5><p>Les convives trouvent un repas selon leur budget et régime.</p></div></div></div>
        <div className="col-md-4"><div className="card h-100"><div className="card-body"><h5>3. Partagez</h5><p>Le groupe discute, mange ensemble et laisse une note.</p></div></div></div>
      </div>
    </div>
  )
}
