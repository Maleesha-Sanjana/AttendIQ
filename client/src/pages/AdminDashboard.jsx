import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Automatically redirect to admin attendance overview when accessing admin dashboard
    navigate('/admin-attendance-overview', { replace: true })
  }, [navigate])

  // Show nothing while redirecting
  return null
}

export default AdminDashboard
