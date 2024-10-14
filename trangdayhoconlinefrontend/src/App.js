<<<<<<< HEAD
// src/App.js

import React from 'react';
import HomePage from './pages/HomePage'; // Import HomePage

function App() {
  return <HomePage />; // Gọi HomePage
=======
import React from 'react'
import{BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {routes} from "./routes"

function App(){

  return(
    <div>
      <Router>
        <Routes>
          {
            routes.map((route)=>{
              const Page=route.page
              return(
                <Route path={route.path} element ={<Page/>} />
              )
            })
          }
        </Routes>
      </Router>
    </div>
  )
>>>>>>> origin/master
}
// Trong App.js, bạn cần export default component App
export default App;
