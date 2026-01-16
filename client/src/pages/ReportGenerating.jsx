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
  Download,
  ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const ReportGenerating = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(2) // Set to 3rd icon (Reports)

  // Sample data for different report types
  const sampleData = {
    students: {
      earlyDepartures: [
        { id: 'STU001', name: 'John Doe', faculty: 'Computing', date: '2026-01-08', departureTime: '15:30', scheduledEnd: '16:00' },
        { id: 'STU002', name: 'Jane Smith', faculty: 'Engineering', date: '2026-01-08', departureTime: '15:45', scheduledEnd: '16:00' },
        { id: 'STU003', name: 'Mike Johnson', faculty: 'Management', date: '2026-01-07', departureTime: '15:20', scheduledEnd: '16:00' },
        { id: 'STU004', name: 'Sarah Wilson', faculty: 'Humanities', date: '2026-01-07', departureTime: '15:35', scheduledEnd: '16:00' }
      ],
      lateDepartures: [
        { id: 'STU005', name: 'David Brown', faculty: 'Computing', date: '2026-01-08', departureTime: '16:30', scheduledEnd: '16:00' },
        { id: 'STU006', name: 'Lisa Davis', faculty: 'Engineering', date: '2026-01-08', departureTime: '16:45', scheduledEnd: '16:00' },
        { id: 'STU007', name: 'Tom Miller', faculty: 'Management', date: '2026-01-07', departureTime: '16:20', scheduledEnd: '16:00' }
      ],
      absent: [
        { id: 'STU008', name: 'Emma Garcia', faculty: 'Computing', date: '2026-01-08', reason: 'Sick Leave' },
        { id: 'STU009', name: 'Chris Martinez', faculty: 'Humanities', date: '2026-01-08', reason: 'Personal Emergency' },
        { id: 'STU010', name: 'Amy Taylor', faculty: 'Engineering', date: '2026-01-07', reason: 'Medical Appointment' }
      ]
    },
    lecturers: {
      earlyDepartures: [
        { id: 'LEC001', name: 'Dr. Robert Anderson', department: 'Computer Science', date: '2026-01-08', departureTime: '15:45', scheduledEnd: '16:00' },
        { id: 'LEC002', name: 'Prof. Maria Rodriguez', department: 'Mathematics', date: '2026-01-07', departureTime: '15:30', scheduledEnd: '16:00' }
      ],
      lateDepartures: [
        { id: 'LEC003', name: 'Dr. James Wilson', department: 'Physics', date: '2026-01-08', departureTime: '16:30', scheduledEnd: '16:00' },
        { id: 'LEC004', name: 'Prof. Linda Thompson', department: 'Chemistry', date: '2026-01-07', departureTime: '16:25', scheduledEnd: '16:00' }
      ],
      absent: [
        { id: 'LEC005', name: 'Dr. Michael Davis', department: 'Biology', date: '2026-01-08', reason: 'Conference Attendance' },
        { id: 'LEC006', name: 'Prof. Susan Clark', department: 'English', date: '2026-01-07', reason: 'Medical Leave' }
      ]
    }
  }

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
    setActiveTab(index)
  }

  const handleBackToAdmin = () => {
    navigate('/admin-dashboard')
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

  const handleDownloadReport = (reportType, category) => {
    try {
      toast.success(`Generating ${reportType} report...`)
      
      // Create PDF document
      const doc = new jsPDF()
      
      // Set up document header
      doc.setFontSize(20)
      doc.text('ATTENDIQ - Attendance Report', 20, 20)
      
      // Add report details
      const now = new Date()
      const reportDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const reportTime = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      })

      doc.setFontSize(12)
      doc.text(`Report Type: ${reportType.replace(/-/g, ' ').toUpperCase()}`, 20, 35)
      doc.text(`Category: ${category === 'students' ? 'Students' : 'Lecturers'}`, 20, 45)
      doc.text(`Generated on: ${reportDate} at ${reportTime}`, 20, 55)
      
      // Get appropriate data based on report type and category
      let data = []
      let headers = []
      
      if (reportType.includes('early-departures')) {
        data = sampleData[category].earlyDepartures
        if (category === 'students') {
          headers = ['ID', 'Name', 'Faculty', 'Date', 'Departure', 'Scheduled']
        } else {
          headers = ['ID', 'Name', 'Department', 'Date', 'Departure', 'Scheduled']
        }
      } else if (reportType.includes('late-departures')) {
        data = sampleData[category].lateDepartures
        if (category === 'students') {
          headers = ['ID', 'Name', 'Faculty', 'Date', 'Departure', 'Scheduled']
        } else {
          headers = ['ID', 'Name', 'Department', 'Date', 'Departure', 'Scheduled']
        }
      } else if (reportType.includes('absent')) {
        data = sampleData[category].absent
        if (category === 'students') {
          headers = ['ID', 'Name', 'Faculty', 'Date', 'Reason']
        } else {
          headers = ['ID', 'Name', 'Department', 'Date', 'Reason']
        }
      }

      // Draw table manually
      let yPosition = 75
      
      // Draw headers
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      
      const columnWidths = reportType.includes('absent') 
        ? [25, 40, 35, 30, 50] 
        : [25, 40, 35, 30, 25, 25]
      
      let xPosition = 20
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition)
        xPosition += columnWidths[index]
      })
      
      // Draw header line
      yPosition += 5
      doc.line(20, yPosition, 180, yPosition)
      yPosition += 10
      
      // Draw data rows
      doc.setFont(undefined, 'normal')
      data.forEach((item, rowIndex) => {
        if (yPosition > 250) { // Start new page if needed
          doc.addPage()
          yPosition = 20
        }
        
        xPosition = 20
        
        if (reportType.includes('absent')) {
          const rowData = [
            item.id,
            item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
            item.faculty || item.department,
            item.date,
            item.reason.length > 20 ? item.reason.substring(0, 20) + '...' : item.reason
          ]
          
          rowData.forEach((cell, index) => {
            doc.text(String(cell), xPosition, yPosition)
            xPosition += columnWidths[index]
          })
        } else {
          const rowData = [
            item.id,
            item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
            item.faculty || item.department,
            item.date,
            item.departureTime,
            item.scheduledEnd
          ]
          
          rowData.forEach((cell, index) => {
            doc.text(String(cell), xPosition, yPosition)
            xPosition += columnWidths[index]
          })
        }
        
        yPosition += 8
      })
      
      // Add summary
      yPosition += 10
      doc.line(20, yPosition, 180, yPosition)
      yPosition += 10
      doc.setFont(undefined, 'bold')
      doc.text(`Total Records: ${data.length}`, 20, yPosition)
      
      // Generate filename
      const timestamp = now.toISOString().split('T')[0]
      const filename = `${reportType}-${timestamp}.pdf`

      // Save the PDF
      doc.save(filename)
      
      toast.success(`Report downloaded successfully! (${data.length} records)`)
      
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error(`Failed to generate report: ${error.message}`)
    }
  }

  const reportCards = [
    { title: 'Early Departures - Students', type: 'early-departures-students', category: 'students' },
    { title: 'Early Departures - Lecturers', type: 'early-departures-lecturers', category: 'lecturers' },
    { title: 'Late Departures - Students', type: 'late-departures-students', category: 'students' },
    { title: 'Late Departures - Lecturers', type: 'late-departures-lecturers', category: 'lecturers' },
    { title: 'Absent - Lecturers', type: 'absent-lecturers', category: 'lecturers' },
    { title: 'Absent - Students', type: 'absent-students', category: 'students' }
  ]

  return (
    <div className="admin-dashboard-container">
      {/* Left Panel - Same as Landing Page */}
      <div className="left-panel">
        <div className="brand-section">
          <h1 className="brand-title">ATTENDIQ</h1>
          <p className="brand-subtitle">REPORT GENERATING</p>
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
            <button className="back-btn-nav" onClick={handleBackToAdmin}>
              <ArrowLeft size={16} />
              Back
            </button>
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

        {/* Report Generating Area */}
        <div className="attendance-area">
          <div className="report-generating-content">
            {/* Report Cards Grid */}
            <div className="report-cards-grid">
              {reportCards.map((report, index) => (
                <div key={index} className="report-card">
                  <div className="report-card-content">
                    <h3>{report.title}</h3>
                    <button 
                      className="download-report-btn"
                      onClick={() => handleDownloadReport(report.type, report.category)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance Monthly Chart */}
            <div className="monthly-chart-container">
              <h3>Attendance Monthly Chart</h3>
              <div className="chart-area">
                <div className="chart-grid">
                  <div className="y-axis-labels">
                    <span>100%</span>
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                    <span>0%</span>
                  </div>
                  <div className="chart-content">
                    <svg viewBox="0 0 400 200" className="monthly-chart-svg">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Chart line */}
                      <polyline
                        fill="none"
                        stroke="#4facfe"
                        strokeWidth="3"
                        points="20,160 60,140 100,120 140,130 180,110 220,125 260,100 300,115 340,90 380,105"
                      />
                      
                      {/* Data points */}
                      <circle cx="20" cy="160" r="4" fill="#4facfe" />
                      <circle cx="60" cy="140" r="4" fill="#4facfe" />
                      <circle cx="100" cy="120" r="4" fill="#4facfe" />
                      <circle cx="140" cy="130" r="4" fill="#4facfe" />
                      <circle cx="180" cy="110" r="4" fill="#4facfe" />
                      <circle cx="220" cy="125" r="4" fill="#4facfe" />
                      <circle cx="260" cy="100" r="4" fill="#4facfe" />
                      <circle cx="300" cy="115" r="4" fill="#4facfe" />
                      <circle cx="340" cy="90" r="4" fill="#4facfe" />
                      <circle cx="380" cy="105" r="4" fill="#4facfe" />
                    </svg>
                  </div>
                </div>
                <div className="x-axis-labels">
                  <span>01 Aug</span>
                  <span>03 Aug</span>
                  <span>05 Aug</span>
                  <span>07 Aug</span>
                  <span>09 Aug</span>
                  <span>11 Aug</span>
                  <span>13 Aug</span>
                  <span>15 Aug</span>
                  <span>17 Aug</span>
                  <span>19 Aug</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportGenerating