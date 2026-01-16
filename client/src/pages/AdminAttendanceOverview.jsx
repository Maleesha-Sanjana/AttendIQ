import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3,
  TrendingUp,
  FileText,
  Settings,
  User,
  Sun,
  Search,
  Calendar,
  Download,
  UserPlus,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import UserRegistration from '../components/UserRegistration'
import './Dashboard.css'

const AdminAttendanceOverview = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(1) // Set to 1st icon (Dashboard/BarChart3)
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('') // Empty string to show all data by default
  const [loading, setLoading] = useState(true)
  const [showUserRegistration, setShowUserRegistration] = useState(false)

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
        const today = new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
        
        const mockAttendance = [
          { id: '2341421', name: 'Maleesha Sanjana', building: 'Dortian', faculty: 'Computing', date: '2025-11-05', status: 'Early Arrived', checkin: '09:00', checkout: '16:00' },
          { id: '3411421', name: 'Denuka Manujaya', building: 'Zenith', faculty: 'Management', date: '2025-11-05', status: 'Absent', checkin: '---', checkout: '16:00' },
          { id: '2341721', name: 'Vidhmi Kavindya', building: 'Westlane', faculty: 'Humanities', date: '2025-11-04', status: 'On Time', checkin: '10:30', checkout: '16:00' },
          { id: '2341421', name: 'Nurani Kawshalya', building: 'Spencer', faculty: 'Engineering', date: '2025-11-05', status: 'Early Arrived', checkin: '08:00', checkout: '16:00' },
          { id: '2341421', name: 'Samadhi Hansika', building: 'Sky', faculty: 'Management', date: '2025-11-05', status: 'Early Arrived', checkin: '08:00', checkout: '16:00' },
          { id: '2341421', name: 'Udari Malshika', building: 'Top', faculty: 'Management', date: '2025-11-05', status: 'Early Arrived', checkin: '08:00', checkout: '16:00' },
          { id: '2341822', name: 'Kasun Perera', building: 'Phoenix', faculty: 'Computing', date: '2026-01-08', status: 'On Time', checkin: '09:15', checkout: '16:00' },
          { id: '2342024', name: 'Thilini Fernando', building: 'Aurora', faculty: 'Computing', date: '2026-01-08', status: 'Early Arrived', checkin: '08:30', checkout: '16:00' },
          { id: '2342125', name: 'Ravindu Jayasinghe', building: 'Nexus', faculty: 'Engineering', date: '2026-01-08', status: 'On Time', checkin: '09:00', checkout: '16:00' },
          { id: '2342226', name: 'Sanduni Wickramasinghe', building: 'Vertex', faculty: 'Humanities', date: '2026-01-07', status: 'Absent', checkin: '---', checkout: '---' },
          { id: '2342327', name: 'Chamara Rathnayake', building: 'Summit', faculty: 'Management', date: '2026-01-07', status: 'On Time', checkin: '09:45', checkout: '16:00' },
          // Today's records
          { id: '2342428', name: 'Amara Jayawardena', building: 'Crystal', faculty: 'Computing', date: today, status: 'Early Arrived', checkin: '08:45', checkout: '16:00' },
          { id: '2342529', name: 'Dilshan Mendis', building: 'Platinum', faculty: 'Engineering', date: today, status: 'On Time', checkin: '09:30', checkout: '16:00' },
          { id: '2342630', name: 'Ishara Gunasekara', building: 'Diamond', faculty: 'Management', date: today, status: 'Early Arrived', checkin: '08:15', checkout: '16:00' }
        ]
        setAttendanceData(mockAttendance)
        setFilteredData(mockAttendance) // Initialize filtered data
      } catch (error) {
        console.error('Error loading attendance data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAttendanceData()
  }, [])

  // Filter data based on search query and selected date
  useEffect(() => {
    let filtered = attendanceData

    // Filter by search query (student name)
    if (searchQuery.trim()) {
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate)
    }

    setFilteredData(filtered)
  }, [searchQuery, selectedDate, attendanceData])

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

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    
    return `${day} ${month} ${year}`
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handleGenerateReports = () => {
    // Navigate to admin report generating interface
    navigate('/admin-report-generating')
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

  const handleUserRegistration = () => {
    setShowUserRegistration(true)
  }

  const handleCloseUserRegistration = () => {
    setShowUserRegistration(false)
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
          <p className="brand-subtitle">ATTENDANCE OVERVIEW</p>
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
            <span className="nav-item active">Attendance Overview</span>
            <span className="nav-arrow">➤</span>
          </div>
          <div className="nav-right">
            <div className="search-container">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Quick Search..." 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button className="user-registration-btn" onClick={handleUserRegistration}>
              <UserPlus size={16} />
              User Registration
            </button>
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

        {/* Attendance Overview */}
        <div className="attendance-area">
          <div className="attendance-overview">
            <div className="overview-header">
              <h2>Attendance Overview</h2>
              <div className="overview-controls">
                <div className="date-filter">
                  <Calendar size={16} />
                  {selectedDate ? (
                    <>
                      <span className="selected-date-text">{formatDisplayDate(selectedDate)}</span>
                      <button 
                        className="clear-date-btn"
                        onClick={() => setSelectedDate('')}
                        title="Clear date filter to show all data"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="all-date-text">All Date</span>
                  )}
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="date-input-hidden"
                  />
                </div>
                <button className="generate-report-btn" onClick={handleGenerateReports}>
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
                  {filteredData.length > 0 ? (
                    filteredData.map((record, index) => (
                      <tr key={index}>
                        <td>{record.id}</td>
                        <td>{record.name}</td>
                        <td>{record.building}</td>
                        <td>{record.faculty}</td>
                        <td>{formatDisplayDate(record.date)}</td>
                        <td className="status-cell">
                          <span className={`status-badge ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="time-cell">{record.checkin}</td>
                        <td className="time-cell">{record.checkout}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {searchQuery && selectedDate 
                          ? `No students found matching "${searchQuery}" for ${formatDisplayDate(selectedDate)}`
                          : searchQuery 
                            ? `No students found matching "${searchQuery}"`
                            : selectedDate
                              ? `No attendance records found for ${formatDisplayDate(selectedDate)}`
                              : 'No attendance records found'
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              <div className="table-footer">
                <span>
                  {searchQuery || selectedDate
                    ? `Showing ${filteredData.length} of ${attendanceData.length} records${selectedDate ? ` for ${formatDisplayDate(selectedDate)}` : ''}${searchQuery ? ` matching "${searchQuery}"` : ''}`
                    : `Showing all ${filteredData.length} attendance records`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Registration Modal */}
      <UserRegistration 
        isOpen={showUserRegistration} 
        onClose={handleCloseUserRegistration} 
      />
    </div>
  )
}

export default AdminAttendanceOverview
