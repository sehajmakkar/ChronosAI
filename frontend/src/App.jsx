import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <UserProvider>
    <AppRoutes />
    <ToastContainer />
    </UserProvider>
    
  )
}

export default App