import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Settings, 
  User,
  Sun
} from 'lucide-react'
import toast from 'react-hot-toast'
import FaceRecognition from '../components/FaceRecognition'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0)
  const [cameraState, setCameraState] = useState({
    isLoading: false,
    needsPermission: false,
    hasError: false,
    isScanning: false,
    navigationDisabled: false
  })

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
    { icon: User, label: 'Profile' }
  ]

  const handleSidebarClick = (index, label) => {
    console.log('Sidebar clicked:', { index, label, cameraState })
    
    // Show "No access for you" popup for Analytics, Reports, and Profile
    if (label === 'Analytics' || label === 'Reports' || label === 'Profile') {
      toast.error('No access for you', {
        duration: 2000,
        style: {
          background: 'rgba(255, 68, 68, 0.9)',
          color: '#ffffff',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '500'
        }
      })
      return
    }
    
    // Prevent navigation if camera is in a restricted state (only for Dashboard)
    if (cameraState.navigationDisabled) {
      console.log('Navigation blocked due to camera state')
      if (cameraState.isLoading) {
        toast.error('Please wait for camera to initialize')
      } else if (cameraState.needsPermission) {
        toast.error('Please grant camera permission first')
      } else if (cameraState.hasError) {
        toast.error('Please resolve camera issues first')
      } else if (cameraState.isScanning) {
        toast.error('Face scanning in progress, please wait')
      } else {
        toast.error('Navigation temporarily disabled')
      }
      return
    }
    
    console.log('Navigation allowed, switching to:', label)
    setActiveTab(index)
    toast.success(`Switched to ${label} view`)
  }

  const handleCameraStateChange = (newState) => {
    console.log('Camera state changed:', newState)
    setCameraState(newState)
  }

  const handleLogin = (userType) => {
    toast.success(`Redirecting to ${userType} login...`)
    setTimeout(() => {
      navigate(`/${userType}-login`)
    }, 1000)
  }

  const handleAttendanceMarked = (attendanceData) => {
    toast.success(`Attendance marked for ${attendanceData.name}`)
    console.log('Attendance data:', attendanceData)
  }

  return (
    <div className="landing-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">
            ATTENDIQ
          </h1>
          <p className="brand-subtitle">
            STUDENT DASHBOARD
          </p>
        </div>
        
        <div className="institution-logo">
          <div className="logo-container">
            <img src="/cinec.png" alt="CINEC Campus" className="cinec-main-logo" />
          </div>
        </div>
        
        <div className="date-time-section">
          <div className="date-time-card">
            <Sun className="time-icon" size={24} />
            <div className="date-time-info">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="date">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-left">
            <span className="nav-item active">Dashboard</span>
            <span className="nav-arrow">➤</span>
          </div>
          <div className="nav-right">
            <button 
              className="login-btn admin-btn"
              onClick={() => handleLogin('admin')}
            >
              Admin Login
            </button>
            <button 
              className="login-btn lecturer-btn"
              onClick={() => handleLogin('lecturer')}
            >
              Lecturer Login
            </button>
          </div>
        </nav>

        {/* Sidebar */}
        <div className="sidebar">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`sidebar-item ${activeTab === index ? 'active' : ''} ${
                item.label === 'Analytics' || item.label === 'Reports' || item.label === 'Profile'
                  ? 'restricted' 
                  : ''
              }`}
              onClick={() => handleSidebarClick(index, item.label)}
            >
              <item.icon size={20} />
            </div>
          ))}
        </div>

        {/* Face Recognition Area */}
        <div className="recognition-area">
          <FaceRecognition 
            onAttendanceMarked={handleAttendanceMarked}
            onCameraStateChange={handleCameraStateChange}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingPage