import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    studentId: 'STU001',
    department: 'Computer Science',
    year: 2
  })

  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 0,
    attendedSessions: 0,
    attendancePercentage: 0,
    presentSessions: 0,
    lateSessions: 0,
    absentSessions: 0
  })

  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true)
        
        // Load student data using mock API
        const [statsResponse, attendanceResponse] = await Promise.all([
          mockApi.getStudentAttendanceStats('STU001'),
          mockApi.getStudentRecentAttendance('STU001')
        ])

        setAttendanceStats({
          totalSessions: statsResponse.stats.total_sessions,
          attendedSessions: statsResponse.stats.attended_sessions,
          attendancePercentage: statsResponse.stats.attendance_percentage,
          presentSessions: statsResponse.stats.present_sessions,
          lateSessions: statsResponse.stats.late_sessions,
          absentSessions: statsResponse.stats.absent_sessions
        })
        
        setRecentAttendance(attendanceResponse.attendance)
        
      } catch (error) {
        console.error('Error loading student data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStudentData()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="status-icon present" size={16} />
      case 'late':
        return <Clock className="status-icon late" size={16} />
      case 'absent':
        return <XCircle className="status-icon absent" size={16} />
      default:
        return null
    }
  }

  const getStatusClass = (status) => {
    return `status-badge ${status}`
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <motion.div
          className="header-content"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Student Dashboard</h1>
          <p>Welcome back, {studentData.name}</p>
        </motion.div>
      </div>

      <div className="dashboard-content">
        {/* Student Info Card */}
        <motion.div
          className="dashboard-card student-info"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="card-header">
            <User className="card-icon" size={24} />
            <h3>Student Information</h3>
          </div>
          <div className="student-details">
            <div className="detail-item">
              <span className="label">Student ID:</span>
              <span className="value">{studentData.studentId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Department:</span>
              <span className="value">{studentData.department}</span>
            </div>
            <div className="detail-item">
              <span className="label">Year of Study:</span>
              <span className="value">Year {studentData.year}</span>
            </div>
          </div>
        </motion.div>

        {/* Attendance Stats */}
        <motion.div
          className="dashboard-card attendance-stats"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="card-header">
            <BarChart3 className="card-icon" size={24} />
            <h3>Attendance Statistics</h3>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{attendanceStats.attendancePercentage}%</div>
              <div className="stat-label">Overall Attendance</div>
              <div className={`stat-indicator ${attendanceStats.attendancePercentage >= 80 ? 'good' : 'warning'}`}>
                {attendanceStats.attendancePercentage >= 80 ? 'Eligible for Exams' : 'Below Threshold'}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">{attendanceStats.attendedSessions}</div>
              <div className="stat-label">Sessions Attended</div>
              <div className="stat-sublabel">out of {attendanceStats.totalSessions}</div>
            </div>
            
            <div className="stat-breakdown">
              <div className="breakdown-item">
                <CheckCircle className="breakdown-icon present" size={16} />
                <span>Present: {attendanceStats.presentSessions}</span>
              </div>
              <div className="breakdown-item">
                <Clock className="breakdown-icon late" size={16} />
                <span>Late: {attendanceStats.lateSessions}</span>
              </div>
              <div className="breakdown-item">
                <XCircle className="breakdown-icon absent" size={16} />
                <span>Absent: {attendanceStats.absentSessions}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          className="dashboard-card recent-attendance"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="card-header">
            <Calendar className="card-icon" size={24} />
            <h3>Recent Attendance</h3>
          </div>
          
          <div className="attendance-list">
            {recentAttendance.map((record) => (
              <div key={record.id} className="attendance-item">
                <div className="attendance-info">
                  <div className="course-info">
                    <span className="course-code">{record.course}</span>
                    <span className="session-name">{record.session}</span>
                  </div>
                  <div className="attendance-meta">
                    <span className="date">{record.date}</span>
                    <span className="time">{record.time}</span>
                  </div>
                </div>
                <div className="attendance-status">
                  {getStatusIcon(record.status)}
                  <span className={getStatusClass(record.status)}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StudentDashboard