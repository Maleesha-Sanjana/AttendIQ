import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Login.css'

const LecturerLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use admin credentials for lecturer login as requested
      const response = await mockApi.login(formData.username, formData.password, 'admin')
      toast.success('Login successful!')
      // Redirect to lecturer dashboard after admin authentication
      navigate('/lecturer-dashboard')
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <motion.button
        className="back-btn"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Back to Home
      </motion.button>

      <motion.div
        className="login-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <h1>Lecturer Access</h1>
          <p>Enter admin credentials to access lecturer dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="login-submit-btn lecturer"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="login-footer">
          <p>Demo credentials: admin / admin123</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LecturerLogin