import { Navigate, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MealsList from './pages/MealsList.jsx'
import MealDetail from './pages/MealDetail.jsx'
import CreateMeal from './pages/CreateMeal.jsx'
import MyMeals from './pages/MyMeals.jsx'
import MyReservations from './pages/MyReservations.jsx'
import Chat from './pages/Chat.jsx'
import Profile from './pages/Profile.jsx'
import Reviews from './pages/Reviews.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { getToken } from './api.js'

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/connexion" replace />
}

export default function App() {
  return (
    <>
      <AppNavbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          <Route path="/repas" element={<MealsList />} />
          <Route path="/repas/:id" element={<MealDetail />} />

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/proposer" element={<Protected><CreateMeal /></Protected>} />
          <Route path="/mes-repas" element={<Protected><MyMeals /></Protected>} />
          <Route path="/mes-reservations" element={<Protected><MyReservations /></Protected>} />
          <Route path="/chat/:mealId" element={<Protected><Chat /></Protected>} />
          <Route path="/profil" element={<Protected><Profile /></Protected>} />
          <Route path="/avis" element={<Protected><Reviews /></Protected>} />
          <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
