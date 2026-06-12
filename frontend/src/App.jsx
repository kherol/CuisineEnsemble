import { Navigate, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar.jsx'
import Home from './pages/Home.jsx'
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
import AdminDashboard from './pages/AdminDashboard.jsx'
import { getToken } from './api.js'

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/connexion" />
}

export default function App() {
  return (
    <>
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
        </Routes>
      </main>
    </>
  )
}
