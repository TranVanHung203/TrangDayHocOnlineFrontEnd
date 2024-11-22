import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminPage from './pages/AdminPage/AdminPage'
import AdminStudent from './pages/AdminPage/AdminStudent'
import AdminLecturer from './pages/AdminPage/AdminLecturer'
import Admin from './pages/AdminPage/Admin'
import { routes } from "./routes"

function App() {

  return (
    <div>
      <Router>
        <Routes>
          {
            routes.map((route) => {
              const Page = route.page
              return (
                <Route path={route.path} element={<Page />} />
              )
            })
          }
          {(localStorage.getItem("role") === 'Admin') && (
            <Route path='admin' element={<AdminPage />}>
              <Route path='student' element={<AdminStudent />} />
              <Route path='lecturer' element={<AdminLecturer />} />
              <Route path='admins' element={<Admin />} />
            </Route>
          )}

        </Routes>

      </Router>

    </div>
  )

}

export default App;
