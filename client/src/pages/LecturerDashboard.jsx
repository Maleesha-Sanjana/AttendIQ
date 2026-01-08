import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Settings, 
  User,
  Sun,
  Search,
  Calendar,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const LecturerDashboard = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0)
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        setLoading(true)
        // Mock attendance data that matches the interface
        const mockAttendance = [
          { id: '2341421', name: 'Maleesha Sanjana', building: 'Dortian', faculty: 'Computing', date: '5 November 2025', status: 'Early Arrived', checkin: '09:00', checkout: '16:00' },
          { id: '3411421', name: 'Denuka Manujaya', building: 'Zenith', faculty: 'Management', date: '5 November 2025', status: 'Absent', checkin: '---', checkout: '16:00' },
          { id: '2341721', name: 'Vidhmi Kavindya', building: 'Westlane', faculty: 'Humanities', date: '4 November 2025', status: 'On Time', checkin: '10:30', checkout: '16:00' },
          { id: '2341421', name: 'Nurani Kawshalya', building: 'Spencer', faculty: 'Engineering', date: '5 November 2025', status: 'Early Arrived', checkin: '08:00', checkout: '16:00' },
          { id: '2341421', name: 'Samadhi Hansika', building: 'Sky', faculty: 'Management', date: '5 November 2025', status: 'Early Arrived', checkin: '08:00', checkout: '16:00' },
          { id: '2341421', name: 'Udari Malshika', building: 'Top', faculty: 'Management', date: '5 November 2025', status: 'Early Arrived', checkin: '08:00', checkout: '16:00' }
        ]
        setAttendanceData(mockAttendance)
      } catch (error) {
        console.error('Error loading attendance data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAttendanceData()
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

  const formatCurrentDate = (date) => {
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    
    return `${day} ${month} ${year}`
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
  }

  const handleLogout = async () => {
    try {
      await mockApi.logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
      // Navigate anyway
      navigate('/')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Early Arrived':
        return 'early-arrived'
      case 'On Time':
        return 'on-time'
      case 'Absent':
        return 'absent'
      default:
        return 'on-time'
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container lecturer">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
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
      {/* Left Panel - Same as Landing Page */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">ATTENDIQ</h1>
          <p className="brand-subtitle">ADMIN DASHBOARD</p>
        </div>
        
        <div className="profile-section">
          <div className="profile-avatar">
            <User size={32} />
          </div>
          <div className="profile-name">MALEESHA SANJANA</div>
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

      {/* Main Content - Same structure as Landing Page */}
      <div className="main-content">
        {/* Top Navigation - Same as Landing Page */}
        <nav className="top-nav">
          <div className="nav-left">
            <span className="nav-item active">Dashboard</span>
            <span className="nav-arrow">➤</span>
          </div>
          <div className="nav-right">
            <div className="search-container">
              <Search size={16} />
              <input type="text" placeholder="Quick Search..." />
            </div>
            <button className="logout-btn" onClick={handleLogout}>LogOut</button>
          </div>
        </nav>

        {/* Sidebar - Same as Landing Page */}
        <div className="sidebar">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`sidebar-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleSidebarClick(index, item.label)}
            >
              <item.icon size={20} />
            </div>
          ))}
        </div>

        {/* Attendance Overview - Positioned like Face Recognition Area */}
        <div className="attendance-area">
          <div className="attendance-overview">
            <div className="overview-header">
              <h2>Attendance Overview</h2>
              <div className="overview-controls">
                <div className="date-filter">
                  <Calendar size={16} />
                  <span>{formatCurrentDate(currentTime)}</span>
                </div>
                <button className="generate-report-btn">
                  <Download size={16} />
                  Generate Reports
                </button>
              </div>
            </div>
            
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Building</th>
                    <th>Faculty</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.id}</td>
                      <td>{record.name}</td>
                      <td>{record.building}</td>
                      <td>{record.faculty}</td>
                      <td>{record.date}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="time-cell">{record.checkin}</td>
                      <td className="time-cell">{record.checkout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="table-footer">
                <span>Page 1 of 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LecturerDashboard