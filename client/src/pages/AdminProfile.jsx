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

const AdminProfile = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(4) // Profile tab is active
  const [todayTasks, setTodayTasks] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadProfileData = () => {
      // Mock today's tasks data for admin
      const mockTasks = [
        {
          time: '8:00 A.M',
          person: 'Admin',
          task: 'Review attendance reports for all faculties'
        },
        {
          time: '10:30 A.M',
          person: 'Admin', 
          task: 'Meeting with faculty heads at Admin Office'
        },
        {
          time: '2:00 P.M',
          person: 'Admin',
          task: 'System maintenance and user registration approvals'
        },
        {
          time: '4:00 P.M',
          person: 'Admin',
          task: 'Generate monthly attendance reports'
        }
      ]

      setTodayTasks(mockTasks)
    }

    loadProfileData()
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
    // Stay on profile page when Profile icon is clicked
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
          <p className="brand-subtitle">ADMIN PROFILE</p>
        </div>
        
        <div className="profile-section">
          <div className="profile-avatar" style={{
            background: 'none',
            padding: 0,
            overflow: 'hidden'
          }}>
            <img src="/profile.jpg" alt="Profile" style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              display: 'block'
            }} />
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
            <span className="nav-item active">Admin Profile</span>
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

        {/* Profile Content Area */}
        <div className="attendance-area">
          <div className="profile-content">
            {/* Profile Header Section */}
            <div className="profile-header-section">
              <div className="profile-main-info">
                <div className="profile-avatar-large" style={{
                  background: 'none',
                  padding: 0,
                  overflow: 'hidden'
                }}>
                  <img src="/profile.jpg" alt="Profile" style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    display: 'block'
                  }} />
                </div>
                <div className="profile-details">
                  <h1 className="profile-full-name">Maleesha Sanjan Dilshan Bulathsinhala</h1>
                  <p className="profile-position">ADMIN</p>
                  <p className="profile-faculty">ATTENDIQ SYSTEM</p>
                  <p className="profile-campus">CINEC CAMPUS</p>
                </div>
              </div>
            </div>

            {/* Today's Tasks Section */}
            <div className="today-tasks-section">
              <h2 className="tasks-title">Things You Have to Do Today</h2>
              <div className="tasks-list">
                {todayTasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-time">{task.time}</div>
                    <div className="task-lecturer">{task.person}</div>
                    <div className="task-description">{task.task}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
