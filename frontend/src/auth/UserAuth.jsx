// jaise hi page refresh horha hai toh seedhe login page pe redirect horha hai chahe user logged in ho tab bhi. toh yeh solve karna hai **************
// userAuth ka function hai ki koi bhi user directly access nahi kr sakta koi project without loggin in.

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { useContext, useEffect, useState } from 'react'

const UserAuth = ({children}) => {
  const { user } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
      if (user) {
          setLoading(false)
      }

      if (!token) {
          navigate('/login')
      }

      if (!user) {
          navigate('/login')
      }

  }, [])

  if (loading) {
      return <div>Loading...</div>
  }


  return (
    <>
    {children}
    </>
  )
}

export default UserAuth