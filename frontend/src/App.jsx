import { Navigate, Route, Routes } from 'react-router-dom'

import AppNavbar from './components/AppNavbar.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import AdminLayout from './components/AdminLayout.jsx'

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

import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminMeals from './pages/admin/AdminMeals.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import AdminStatistics from './pages/admin/AdminStatistics.jsx'

import { getToken } from './api.js'


function Protected({ children }) {
  return getToken()
    ? children
    : <Navigate to="/connexion" replace />
}


export default function App() {
  return (
    <>
      <AppNavbar />

      <main className="page-shell">
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Consultation des repas */}
          <Route path="/repas" element={<MealsList />} />
          <Route path="/repas/:id" element={<MealDetail />} />

          {/* Pages utilisateur connecté */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />

          <Route
            path="/proposer"
            element={
              <Protected>
                <CreateMeal />
              </Protected>
            }
          />

          <Route
            path="/mes-repas"
            element={
              <Protected>
                <MyMeals />
              </Protected>
            }
          />

          <Route
            path="/mes-reservations"
            element={
              <Protected>
                <MyReservations />
              </Protected>
            }
          />

          <Route
            path="/chat/:mealId"
            element={
              <Protected>
                <Chat />
              </Protected>
            }
          />

          <Route
            path="/profil"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          <Route
            path="/avis"
            element={
              <Protected>
                <Reviews />
              </Protected>
            }
          />

          {/* Espace administrateur */}
          <Route
            path="/admin"
            element={
              <Protected>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </Protected>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="repas" element={<AdminMeals />} />
            <Route path="signalements" element={<AdminReports />} />
            <Route path="statistiques" element={<AdminStatistics />} />
          </Route>

          {/* Route inexistante */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
