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
  Clock,
  AlertCircle,
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const LecturerNotifications = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0) // Notifications icon is active
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'attendance',
      status: 'success',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      message: 'Class attendance recorded successfully - 42/45 students present',
      time: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'student-late',
      status: 'warning',
      studentName: 'Kasun Perera',
      studentId: '2341822',
      courseCode: 'CS201',
      message: 'Student arrived 15 minutes late',
      time: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
      read: false
    },
    {
      id: 3,
      type: 'low-attendance',
      status: 'warning',
      studentName: 'Denuka Manujaya',
      studentId: '3411421',
      courseCode: 'CS101',
      message: 'Student attendance below 75% - Action required',
      time: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      read: false
    },
    {
      id: 4,
      type: 'session-reminder',
      status: 'info',
      courseCode: 'CS301',
      courseName: 'Database Management Systems',
      message: 'Upcoming session in 1 hour - Lab 301',
      time: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
      read: true
    },
    {
      id: 5,
      type: 'attendance',
      status: 'success',
      courseCode: 'CS201',
      courseName: 'Data Structures and Algorithms',
      message: 'Class attendance recorded successfully - 35/38 students present',
      time: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
      read: true
    },
    {
      id: 6,
      type: 'system',
      status: 'info',
      message: 'Monthly attendance report is ready for download',
      time: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
      read: true
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notification
      if (Math.random() > 0.8) {
        const mockNotifications = [
          {
            type: 'student-late',
            status: 'warning',
            studentName: 'Vidhmi Kavindya',
            studentId: '2341721',
            courseCode: 'CS101',
            message: 'Student arrived 10 minutes late'
          },
          {
            type: 'attendance',
            status: 'success',
            courseCode: 'CS301',
            courseName: 'Database Management Systems',
            message: 'Class attendance recorded successfully - 30/32 students present'
          },
          {
            type: 'low-attendance',
            status: 'warning',
            studentName: 'Ravindu Jayasinghe',
            studentId: '2342125',
            courseCode: 'CS201',
            message: 'Student attendance below 75% - Action required'
          }
        ]
        
        const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
        
        const newNotification = {
          id: Date.now(),
          ...randomNotif,
          time: new Date().toISOString(),
          read: false
        }
        
        setNotifications(prev => [newNotification, ...prev])
        
        // Show toast notification
        toast.info(randomNotif.message, {
          duration: 3000,
          icon: '🔔'
        })
      }
    }, 15000) // Check every 15 seconds

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
    if (label === 'Notifications') {
      navigate('/lecturer-notifications')
    } else if (label === 'Dashboard') {
      navigate('/lecturer-overview')
    } else if (label === 'Profile') {
      navigate('/lecturer-profile')
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
    if (type === 'attendance' && status === 'success') {
      return <CheckCircle size={20} />
    } else if (type === 'student-late' || type === 'low-attendance') {
      return <Clock size={20} />
    } else if (type === 'session-reminder') {
      return <BookOpen size={20} />
    } else {
      return <AlertCircle size={20} />
    }
  }

  const getNotificationColor = (status) => {
    switch (status) {
      case 'success':
        return '#00ff88'
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
              className={`sidebar-item ${activeTab === index ? 'active' : ''} ${
                item.label === 'Analytics' || item.label === 'Reports' 
                  ? 'restricted' 
                  : ''
              }`}
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
                            {notification.courseCode && (
                              <h3 style={{
                                color: '#4facfe',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                margin: '0 0 0.25rem 0'
                              }}>
                                {notification.courseCode}
                                {notification.courseName && (
                                  <span style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem'
                                  }}>
                                    - {notification.courseName}
                                  </span>
                                )}
                              </h3>
                            )}
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

export default LecturerNotifications
