import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3,
  TrendingUp,
  FileText,
  User,
  Sun,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const AdminNotifications = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0) // Notifications icon is active
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'face-recognition',
      status: 'success',
      studentId: '2341421',
      studentName: 'Maleesha Sanjana',
      faculty: 'Computing',
      building: 'Dortian',
      message: 'Face recognized successfully',
      time: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'face-recognition',
      status: 'success',
      studentId: '2341822',
      studentName: 'Kasun Perera',
      faculty: 'Computing',
      building: 'Phoenix',
      message: 'Face recognized successfully',
      time: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
      read: false
    },
    {
      id: 3,
      type: 'attendance',
      status: 'warning',
      studentId: '3411421',
      studentName: 'Denuka Manujaya',
      faculty: 'Management',
      building: 'Zenith',
      message: 'Late arrival detected',
      time: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      read: false
    },
    {
      id: 4,
      type: 'face-recognition',
      status: 'success',
      studentId: '2342024',
      studentName: 'Thilini Fernando',
      faculty: 'Computing',
      building: 'Aurora',
      message: 'Face recognized successfully',
      time: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
      read: true
    },
    {
      id: 5,
      type: 'system',
      status: 'info',
      message: 'System maintenance scheduled for tonight at 11:00 PM',
      time: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
      read: true
    },
    {
      id: 6,
      type: 'attendance',
      status: 'error',
      studentId: '2342226',
      studentName: 'Sanduni Wickramasinghe',
      faculty: 'Humanities',
      building: 'Vertex',
      message: 'Absent - No check-in detected',
      time: new Date(Date.now() - 90 * 60000).toISOString(), // 1.5 hours ago
      read: true
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate real-time notifications from face recognition
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new face recognition notification
      if (Math.random() > 0.7) {
        const mockStudents = [
          { id: '2341721', name: 'Vidhmi Kavindya', faculty: 'Humanities', building: 'Westlane' },
          { id: '2342125', name: 'Ravindu Jayasinghe', faculty: 'Engineering', building: 'Nexus' },
          { id: '2342428', name: 'Amara Jayawardena', faculty: 'Computing', building: 'Crystal' },
          { id: '2342529', name: 'Dilshan Mendis', faculty: 'Engineering', building: 'Platinum' }
        ]
        
        const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)]
        
        const newNotification = {
          id: Date.now(),
          type: 'face-recognition',
          status: 'success',
          studentId: randomStudent.id,
          studentName: randomStudent.name,
          faculty: randomStudent.faculty,
          building: randomStudent.building,
          message: 'Face recognized successfully',
          time: new Date().toISOString(),
          read: false
        }
        
        setNotifications(prev => [newNotification, ...prev])
        
        // Show toast notification
        toast.success(`${randomStudent.name} checked in`, {
          duration: 3000,
          icon: '✅'
        })
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
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

  const formatNotificationTime = (timeString) => {
    const notificationTime = new Date(timeString)
    const now = new Date()
    const diffMs = now - notificationTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
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
    
    // Stay on notifications when Notifications icon is clicked
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

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
    toast.success('All notifications marked as read')
  }

  const getNotificationIcon = (type, status) => {
    if (type === 'face-recognition' && status === 'success') {
      return <CheckCircle size={20} />
    } else if (status === 'error') {
      return <XCircle size={20} />
    } else if (status === 'warning') {
      return <Clock size={20} />
    } else {
      return <AlertCircle size={20} />
    }
  }

  const getNotificationColor = (status) => {
    switch (status) {
      case 'success':
        return '#00ff88'
      case 'error':
        return '#ff4444'
      case 'warning':
        return '#ffaa00'
      default:
        return '#4facfe'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="admin-dashboard-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">ATTENDIQ</h1>
          <p className="brand-subtitle">NOTIFICATIONS</p>
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
            <span className="nav-item active">Notifications</span>
            <span className="nav-arrow">➤</span>
            {unreadCount > 0 && (
              <span style={{
                background: '#ff4444',
                color: '#ffffff',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}>
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="nav-right">
            {unreadCount > 0 && (
              <button 
                className="user-registration-btn" 
                onClick={handleMarkAllAsRead}
                style={{ marginRight: '1rem' }}
              >
                Mark All as Read
              </button>
            )}
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
              {item.label === 'Notifications' && unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '8px',
                  height: '8px',
                  background: '#ff4444',
                  borderRadius: '50%',
                  border: '2px solid #3F3F3F'
                }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Notifications Area */}
        <div className="attendance-area">
          <div className="attendance-overview">
            <div className="overview-header">
              <h2>All Notifications</h2>
            </div>
            
            <div className="attendance-table-container" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              <div style={{ padding: '1rem' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    style={{
                      background: notification.read ? 'rgba(255, 255, 255, 0.03)' : 'rgba(79, 172, 254, 0.1)',
                      border: `1px solid ${notification.read ? 'rgba(255, 255, 255, 0.1)' : 'rgba(79, 172, 254, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderLeft: `4px solid ${getNotificationColor(notification.status)}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(79, 172, 254, 0.15)'
                      e.currentTarget.style.transform = 'translateX(5px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notification.read ? 'rgba(255, 255, 255, 0.03)' : 'rgba(79, 172, 254, 0.1)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        color: getNotificationColor(notification.status),
                        marginTop: '0.25rem'
                      }}>
                        {getNotificationIcon(notification.type, notification.status)}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            {notification.studentName && (
                              <h3 style={{
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                margin: '0 0 0.25rem 0'
                              }}>
                                {notification.studentName}
                                {notification.studentId && (
                                  <span style={{
                                    color: '#4facfe',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem'
                                  }}>
                                    ({notification.studentId})
                                  </span>
                                )}
                              </h3>
                            )}
                            <p style={{
                              color: notification.read ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
                              fontSize: '0.9rem',
                              margin: '0',
                              fontWeight: notification.read ? '400' : '500'
                            }}>
                              {notification.message}
                            </p>
                          </div>
                          
                          {!notification.read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              background: '#4facfe',
                              borderRadius: '50%',
                              marginTop: '0.5rem'
                            }}></div>
                          )}
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          marginTop: '0.75rem',
                          flexWrap: 'wrap'
                        }}>
                          {notification.faculty && (
                            <span style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '0.8rem'
                            }}>
                              📚 {notification.faculty}
                            </span>
                          )}
                          {notification.building && (
                            <span style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '0.8rem'
                            }}>
                              🏢 {notification.building}
                            </span>
                          )}
                          <span style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            marginLeft: 'auto'
                          }}>
                            🕐 {formatNotificationTime(notification.time)}
                          </span>
                        </div>
                      </div>
                    </div>
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

export default AdminNotifications
