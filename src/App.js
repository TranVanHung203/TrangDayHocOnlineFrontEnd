import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from "./routes"
import RegisterPage from './pages/AuthPage/RegisterPage'
import LoginPage from './pages/AuthPage/LoginPage'
import ResetPasswordPage from './pages/AuthPage/ResetPasswordPage'
import AdminPage from './pages/AdminPage/AdminPage'
import AdminStudent from './pages/AdminPage/AdminStudent'
import AdminLecturer from './pages/AdminPage/AdminLecturer'
import Admin from './pages/AdminPage/Admin'
import VerifyEmail from './pages/AuthPage/VerifyEmail'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          {
            routes.map((route) => {
              const Page = route.page
              return (
                <>
                  <Route path={route.path} element={<Page />} />
                </>
              )
            })
          }
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/verify-email/:verify_token' element={<VerifyEmail />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/reset-password/:reset_token' element={<ResetPasswordPage />} />

          <Route path='admin' element={<AdminPage />}>
            <Route path='student' element={<AdminStudent />} />
            <Route path='lecturer' element={<AdminLecturer />} />
            <Route path='admins' element={<Admin />} />

          </Route>
        </Routes>
      </Router>
    </div>
  )

}

export default App;
