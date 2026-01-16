import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3,
  TrendingUp,
  FileText,
  User,
  Sun,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const LecturerProfile = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(4) // Profile tab is active (index changed due to Notifications icon)
  const [loading, setLoading] = useState(true)
  const [todayTasks, setTodayTasks] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true)
        
        // Mock today's tasks data
        const mockTasks = [
          {
            time: '9:00 A.M',
            lecturer: 'Maleesha Sanjana',
            task: 'Lecture at Dartion IT Lab 03'
          },
          {
            time: '1:00 P.M',
            lecturer: 'Maleesha Sanjana', 
            task: 'Lecture at Dartion Zenith 602'
          },
          {
            time: '3:00 P.M',
            lecturer: 'Maleesha Sanjana',
            task: 'Viva at Dartion Lab 4/5'
          }
        ]

        setTodayTasks(mockTasks)
      } catch (error) {
        console.error('Error loading profile data:', error)
      } finally {
        setLoading(false)
      }
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
    if (label === 'Notifications') {
      navigate('/lecturer-notifications')
    } else if (index === 1) {
      navigate('/lecturer-overview')
    } else if (label === 'Analytics' || label === 'Reports') {
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
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      {/* Left Panel - Same as Landing Page */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">ATTENDIQ</h1>
          <p className="brand-subtitle">YOUR PROFILE</p>
        </div>
        
        <div className="profile-section">
          <div className="profile-avatar" style={{
            background: 'none',
            padding: 0,
            overflow: 'hidden'
          }}>
            <img src="/profile.jpg" alt="Profile" style={{ 
              width: '80px', 
              height: '80px', 
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
            <span className="nav-item active">Lecturer Profile</span>
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
                item.label === 'Analytics' || item.label === 'Reports' 
                  ? 'restricted' 
                  : ''
              } ${item.label === 'Notifications' ? 'notification' : ''}`}
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
                  <h1 className="profile-full-name">MALEESHA SANJANA DILSHAN BULATHSINHALA</h1>
                  <p className="profile-position">SENIOR LECTURER</p>
                  <p className="profile-faculty">FACULTY OF COMPUTING</p>
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
                    <div className="task-lecturer">{task.lecturer}</div>
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

export default LecturerProfile