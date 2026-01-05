import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Clock
} from 'lucide-react'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalSessions: 0,
    totalLecturers: 0,
    todayAttendance: 0,
    monthlyAttendanceRate: 0
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Load all dashboard data using mock API
        const [statsResponse, activityResponse, lowAttendanceResponse] = await Promise.all([
          mockApi.getAdminStats(),
          mockApi.getRecentActivity(),
          mockApi.getLowAttendanceStudents()
        ])

        setStats(statsResponse.stats)
        setRecentActivity(activityResponse.records)
        setLowAttendanceStudents(lowAttendanceResponse.students)
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'attendance':
        return <UserCheck className="activity-icon" size={16} />
      case 'enrollment':
        return <Users className="activity-icon" size={16} />
      case 'session':
        return <Calendar className="activity-icon" size={16} />
      default:
        return <Clock className="activity-icon" size={16} />
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container admin">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container admin">
      <div className="dashboard-header">
        <motion.div
          className="header-content"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Admin Dashboard</h1>
          <p>System Overview and Management</p>
        </motion.div>
      </div>

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="stat-icon students">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_students}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="stat-icon courses">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_courses}</div>
              <div className="stat-label">Active Courses</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="stat-icon sessions">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_sessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="stat-icon lecturers">
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_lecturers}</div>
              <div className="stat-label">Lecturers</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="stat-icon attendance">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.today_attendance}</div>
              <div className="stat-label">Today's Attendance</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="stat-icon rate">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.monthly_attendance_rate}%</div>
              <div className="stat-label">Monthly Rate</div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          className="dashboard-card recent-activity"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="card-header">
            <Clock className="card-icon" size={24} />
            <h3>Recent Activity</h3>
          </div>
          
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrapper">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    {activity.type === 'attendance' && (
                      <>
                        <strong>{activity.student}</strong> marked {activity.status} for <strong>{activity.course}</strong>
                      </>
                    )}
                    {activity.type === 'enrollment' && (
                      <>
                        <strong>{activity.student}</strong> enrolled in <strong>{activity.course}</strong>
                      </>
                    )}
                    {activity.type === 'session' && (
                      <>
                        New session <strong>{activity.course}</strong> created by <strong>{activity.lecturer}</strong>
                      </>
                    )}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Attendance Alert */}
        <motion.div
          className="dashboard-card low-attendance-alert"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="card-header">
            <AlertTriangle className="card-icon warning" size={24} />
            <h3>Low Attendance Alert</h3>
          </div>
          
          <div className="alert-content">
            <p className="alert-description">
              Students below 80% attendance threshold
            </p>
            
            <div className="low-attendance-list">
              {lowAttendanceStudents.map((student) => (
                <div key={student.id} className="low-attendance-item">
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-meta">
                      {student.studentId} • {student.department}
                    </div>
                  </div>
                  <div className="attendance-percentage warning">
                    {student.attendance}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard