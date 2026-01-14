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
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const LecturerOverview = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0) // Dashboard is active
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadLecturerData = async () => {
      try {
        setLoading(true)
        // Simulate loading data
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('Error loading lecturer data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLecturerData()
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
    if (label === 'Dashboard') {
      navigate('/lecturer-overview')
    } else if (label === 'Profile') {
      navigate('/lecturer-profile')
    } else if (label === 'Analytics' || label === 'Reports' || label === 'Settings') {
      // Show no access popup for restricted tabs
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
    } else {
      setActiveTab(index)
    }
  }

  const handleLogout = async () => {
    try {
      await mockApi.logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
      navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">ATTENDIQ</h1>
          <p className="brand-subtitle">LECTURER OVERVIEW</p>
        </div>
        
        <div className="profile-section">
          <div className="profile-avatar">
            <User size={32} />
          </div>
          <div className="profile-name">LECTURER</div>
        </div>
        
        <div className="time-widget">
          <div className="time-icon">
            <Sun size={24} />
          </div>
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-left">
            <span className="nav-item active">Lecturer Overview</span>
            <span className="nav-arrow">➤</span>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={handleLogout}>LogOut</button>
          </div>
        </nav>

        {/* Sidebar */}
        <div className="sidebar">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`sidebar-item ${activeTab === index ? 'active' : ''} ${
                item.label === 'Analytics' || item.label === 'Reports' || item.label === 'Settings' 
                  ? 'restricted' 
                  : ''
              }`}
              onClick={() => handleSidebarClick(index, item.label)}
            >
              <item.icon size={20} />
            </div>
          ))}
        </div>

        {/* Lecturer Content Area */}
        <div className="attendance-area">
          <div className="lecturer-analytics-content">
            {/* Stats Cards Grid */}
            <div className="lecturer-stats-grid">
              <div className="lecturer-stat-card">
                <div className="stat-value">452</div>
                <div className="stat-label">Total Students</div>
                <div className="stat-icon-corner">
                  <User size={20} />
                </div>
              </div>
              
              <div className="lecturer-stat-card">
                <div className="stat-value">360</div>
                <div className="stat-label">On Time</div>
                <div className="stat-sublabel">24% more than yesterday</div>
                <div className="stat-icon-corner">
                  <BarChart3 size={20} />
                </div>
              </div>
              
              <div className="lecturer-stat-card">
                <div className="stat-value">62</div>
                <div className="stat-label">Late Arrival</div>
                <div className="stat-sublabel">12% less than yesterday</div>
                <div className="stat-icon-corner">
                  <TrendingUp size={20} />
                </div>
              </div>
              
              <div className="lecturer-stat-card">
                <div className="stat-value">6</div>
                <div className="stat-label">Early Departures</div>
                <div className="stat-sublabel">2% less than yesterday</div>
                <div className="stat-icon-corner">
                  <FileText size={20} />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="lecturer-charts-grid">
              {/* Weekly Attendance Chart */}
              <div className="chart-container">
                <h3>Weekly Attendance</h3>
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar" style={{height: '40%'}}></div>
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar active" style={{height: '100%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                    <div className="bar" style={{height: '50%'}}></div>
                    <div className="bar" style={{height: '65%'}}></div>
                  </div>
                  <div className="chart-labels">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Attendance Weekly Chart */}
              <div className="chart-container">
                <h3>Attendance Weekly Chart</h3>
                <div className="chart-placeholder">
                  <div className="line-chart">
                    <svg viewBox="0 0 300 150" className="chart-svg">
                      <polyline
                        fill="none"
                        stroke="#4facfe"
                        strokeWidth="2"
                        points="20,120 50,100 80,80 110,90 140,70 170,85 200,60 230,75 260,50 290,65"
                      />
                      <polyline
                        fill="none"
                        stroke="#00ff88"
                        strokeWidth="2"
                        points="20,100 50,85 80,95 110,75 140,90 170,70 200,80 230,60 260,75 290,55"
                      />
                    </svg>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{backgroundColor: '#4facfe'}}></div>
                      <span>Present</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{backgroundColor: '#00ff88'}}></div>
                      <span>Late</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LecturerOverview
