import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Settings, 
  User,
  Sun
} from 'lucide-react'
import toast from 'react-hot-toast'
import cinecLogo from '../../assets/cinec.png'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th'
      switch (day % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`
  }

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: FileText, label: 'Reports' },
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'Profile' }
  ]

  const handleSidebarClick = (index, label) => {
    setActiveTab(index)
    toast.success(`Switched to ${label} view`)
  }

  const handleLogin = (userType) => {
    toast.success(`Redirecting to ${userType} login...`)
    setTimeout(() => {
      navigate(`/${userType}-login`)
    }, 1000)
  }

  return (
    <div className="landing-container">
      {/* Left Panel */}
      <motion.div 
        className="left-panel"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="brand-section">
          <motion.h1 
            className="brand-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ATTENDIQ
          </motion.h1>
          <motion.p 
            className="brand-subtitle"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            STUDENT DASHBOARD
          </motion.p>
        </div>
        
        <motion.div 
          className="institution-logo"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="logo-container">
            <img src={cinecLogo} alt="CINEC Campus" className="cinec-main-logo" />
          </div>
        </motion.div>
        
        <motion.div 
          className="date-time-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="date-time-card">
            <Sun className="time-icon" size={24} />
            <div className="date-time-info">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="date">{formatDate(currentTime)}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <motion.nav 
          className="top-nav"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="nav-left">
            <span className="nav-item active">Dashboard</span>
            <span className="nav-arrow">➤</span>
          </div>
          <div className="nav-right">
            <motion.button 
              className="login-btn admin-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogin('admin')}
            >
              Admin Login
            </motion.button>
            <motion.button 
              className="login-btn lecturer-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogin('lecturer')}
            >
              Lecturer Login
            </motion.button>
          </div>
        </motion.nav>

        {/* Sidebar */}
        <motion.div 
          className="sidebar"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {sidebarItems.map((item, index) => (
            <motion.div
              key={index}
              className={`sidebar-item ${activeTab === index ? 'active' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSidebarClick(index, item.label)}
            >
              <item.icon size={20} />
            </motion.div>
          ))}
        </motion.div>

        {/* Face Recognition Area - Matching the image design */}
        <motion.div 
          className="recognition-area"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="face-recognition-frame">
            <div className="detection-corners">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            
            <div className="face-placeholder">
              <div className="face-silhouette">
                <div className="head-shape"></div>
                <div className="shoulders-shape"></div>
              </div>
            </div>
            
            <div className="scanning-overlay">
              <motion.div 
                className="scan-line"
                animate={{ 
                  y: [0, 280],
                  opacity: [0.8, 0.3, 0.8]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage