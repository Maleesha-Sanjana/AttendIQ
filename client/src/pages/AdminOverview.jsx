import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3,
  TrendingUp,
  FileText,
  Settings,
  User,
  Sun,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const AdminOverview = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(2) // Analytics icon is active

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
    { icon: Bell, label: 'Notifications' },
    { icon: BarChart3, label: 'Dashboard' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: FileText, label: 'Reports' },
    { icon: User, label: 'Profile' }
  ]

  const handleSidebarClick = (index, label) => {
    setActiveTab(index)
    
    // Navigate to admin notifications when Notifications icon is clicked
    if (label === 'Notifications') {
      navigate('/admin-notifications')
    }
    // Navigate to admin attendance overview when Dashboard icon is clicked
    else if (label === 'Dashboard') {
      navigate('/admin-attendance-overview')
    }
    // Navigate to admin overview when Analytics icon is clicked
    else if (label === 'Analytics') {
      navigate('/admin-overview')
    }
    // Navigate to admin report generating page when Reports icon is clicked
    else if (label === 'Reports') {
      navigate('/admin-report-generating')
    }
    // Navigate to admin profile when Profile icon is clicked
    else if (label === 'Profile') {
      navigate('/admin-profile')
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

  return (
    <div className="admin-dashboard-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">ATTENDIQ</h1>
          <p className="brand-subtitle">ADMIN ANALYTICS</p>
        </div>
        
        <div className="profile-section">
          <div className="profile-avatar">
            <User size={32} />
          </div>
          <div className="profile-name">Maleesha Sanjana</div>
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
            <span className="nav-item active">Admin Analytics</span>
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
              className={`sidebar-item ${activeTab === index ? 'active' : ''} ${item.label === 'Notifications' ? 'notification' : ''}`}
              onClick={() => handleSidebarClick(index, item.label)}
            >
              <item.icon size={20} />
            </div>
          ))}
        </div>

        {/* Admin Analytics Content Area */}
        <div className="attendance-area">
          <div className="lecturer-analytics-content">
            {/* Stats Cards Grid */}
            <div className="lecturer-stats-grid">
              <div className="lecturer-stat-card">
                <div className="stat-value">1,245</div>
                <div className="stat-label">Total Students</div>
                <div className="stat-icon-corner">
                  <User size={20} />
                </div>
              </div>
              
              <div className="lecturer-stat-card">
                <div className="stat-value">980</div>
                <div className="stat-label">On Time</div>
                <div className="stat-icon-corner">
                  <BarChart3 size={20} />
                </div>
              </div>
              
              <div className="lecturer-stat-card">
                <div className="stat-value">185</div>
                <div className="stat-label">Late Arrival</div>
                <div className="stat-icon-corner">
                  <TrendingUp size={20} />
                </div>
              </div>
              
              <div className="lecturer-stat-card">
                <div className="stat-value">80</div>
                <div className="stat-label">Absent</div>
                <div className="stat-icon-corner">
                  <FileText size={20} />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="lecturer-charts-grid">
              {/* Weekly Attendance Chart */}
              <div className="chart-container">
                <h3>Weekly Attendance Overview</h3>
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '65%'}}></div>
                    <div className="bar" style={{height: '85%'}}></div>
                    <div className="bar active" style={{height: '95%'}}></div>
                    <div className="bar" style={{height: '75%'}}></div>
                    <div className="bar" style={{height: '55%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
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

              {/* Attendance Trends Chart */}
              <div className="chart-container">
                <h3>Attendance Trends (Weekly)</h3>
                <div className="chart-placeholder">
                  <div className="line-chart">
                    <svg viewBox="0 0 300 150" className="chart-svg">
                      {/* Present line */}
                      <polyline
                        fill="none"
                        stroke="#4facfe"
                        strokeWidth="2"
                        points="20,110 50,95 80,75 110,85 140,65 170,80 200,55 230,70 260,45 290,60"
                      />
                      {/* Late line */}
                      <polyline
                        fill="none"
                        stroke="#ffaa00"
                        strokeWidth="2"
                        points="20,90 50,80 80,90 110,70 140,85 170,65 200,75 230,55 260,70 290,50"
                      />
                      {/* Absent line */}
                      <polyline
                        fill="none"
                        stroke="#ff4444"
                        strokeWidth="2"
                        points="20,130 50,125 80,120 110,115 140,120 170,110 200,115 230,105 260,110 290,100"
                      />
                    </svg>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{backgroundColor: '#4facfe'}}></div>
                      <span>Present</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{backgroundColor: '#ffaa00'}}></div>
                      <span>Late</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{backgroundColor: '#ff4444'}}></div>
                      <span>Absent</span>
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

export default AdminOverview
