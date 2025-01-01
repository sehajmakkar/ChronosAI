import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import LoginPage from '../screens/Login.jsx'
import SignupPage from '../screens/Register.jsx'
import Home from '../screens/Home.jsx'

const AppRoutes = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <Home/>
      } />
      <Route path="/login" element={
        <LoginPage />
      } />
      <Route path="/register" element={
        <SignupPage/>
      } />
    </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes