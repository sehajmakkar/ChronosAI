import React from 'react'
import { useLocation } from 'react-router-dom'

const Project = () => {
  const location = useLocation();
  console.log(location.state)
  return (
    <div>Project</div>
  )
}

export default Project