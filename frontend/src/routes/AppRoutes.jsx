import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import LoginPage from '../screens/Login.jsx'
import SignupPage from '../screens/Register.jsx'
import Home from '../screens/Home.jsx'
import Project from '../screens/Project.jsx'
import UserAuth from '../auth/UserAuth.jsx'
import Landing from '../screens/Landing.jsx'

const AppRoutes = () => {
  return (
   <BrowserRouter>
    <Routes>
    <Route path="/" element={
        <Landing />
      } />
      <Route path="/home" element={
        <UserAuth>
          <Home/>
        </UserAuth>
      } />
      <Route path="/login" element={
        <LoginPage />
      } />
      <Route path="/register" element={
        <SignupPage/>
      } />
      <Route path="/project" element={
        <UserAuth>
          <Project/>
        </UserAuth>
      } />
    </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes