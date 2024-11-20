import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from "./routes"
import RegisterPage from './pages/AuthPage/RegisterPage'
import LoginPage from './pages/AuthPage/LoginPage'
import ResetPasswordPage from './pages/AuthPage/ResetPasswordPage'

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
          <Route path='/login' element={<LoginPage />} />
          <Route path='/reset-password/:reset_token' element={<ResetPasswordPage />} />
        </Routes>
      </Router>
    </div>
  )

}

export default App;
