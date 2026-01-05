import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Plus
} from 'lucide-react'
import { mockApi } from '../services/mockApi'
import './Dashboard.css'

const LecturerDashboard = () => {
  const [courses, setCourses] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalSessions: 0,
    averageAttendance: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Load all dashboard data using mock API
        const [coursesResponse, sessionsResponse, attendanceResponse] = await Promise.all([
          mockApi.getLecturerCourses(),
          mockApi.getUpcomingSessions(),
          mockApi.getRecentSessionAttendance()
        ])

        setCourses(coursesResponse.courses)
        setUpcomingSessions(sessionsResponse.sessions)
        setRecentAttendance(attendanceResponse.attendance)
        
        // Calculate stats from loaded data
        const totalStudents = coursesResponse.courses.reduce((sum, course) => sum + course.students, 0)
        const totalSessions = coursesResponse.courses.reduce((sum, course) => sum + course.sessions, 0)
        const avgAttendance = attendanceResponse.attendance.reduce((sum, record) => sum + record.rate, 0) / attendanceResponse.attendance.length
        
        setStats({
          totalStudents,
          totalCourses: coursesResponse.courses.length,
          totalSessions,
          averageAttendance: avgAttendance.toFixed(1)
        })
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'excellent'
    if (rate >= 80) return 'good'
    if (rate >= 70) return 'warning'
    return 'poor'
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

  return (
    <div className="dashboard-container lecturer">
      <div className="dashboard-header">
        <motion.div
          className="header-content"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Lecturer Dashboard</h1>
          <p>Manage your courses and track attendance</p>
        </motion.div>
      </div>

      <div className="dashboard-content">
        {/* Stats Overview */}
        <div className="stats-grid lecturer-stats">
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
              <div className="stat-number">{stats.totalStudents}</div>
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
              <div className="stat-number">{stats.totalCourses}</div>
              <div className="stat-label">My Courses</div>
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
              <div className="stat-number">{stats.totalSessions}</div>
              <div className="stat-label">Sessions Conducted</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="stat-icon attendance">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.averageAttendance}%</div>
              <div className="stat-label">Avg Attendance</div>
            </div>
          </motion.div>
        </div>

        {/* My Courses */}
        <motion.div
          className="dashboard-card my-courses"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="card-header">
            <BookOpen className="card-icon" size={24} />
            <h3>My Courses</h3>
            <button className="add-btn">
              <Plus size={16} />
              Add Course
            </button>
          </div>
          
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <div className="course-code">{course.code}</div>
                  <div className="course-students">{course.students} students</div>
                </div>
                <div className="course-name">{course.name}</div>
                <div className="course-stats">
                  <span>{course.sessions} sessions</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          className="dashboard-card upcoming-sessions"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="card-header">
            <Calendar className="card-icon" size={24} />
            <h3>Upcoming Sessions</h3>
            <button className="add-btn">
              <Plus size={16} />
              Schedule Session
            </button>
          </div>
          
          <div className="sessions-list">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <div className="session-course">{session.course}</div>
                  <div className="session-name">{session.name}</div>
                  <div className="session-location">{session.location}</div>
                </div>
                <div className="session-schedule">
                  <div className="session-date">{session.date}</div>
                  <div className="session-time">{session.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          className="dashboard-card recent-attendance lecturer"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="card-header">
            <BarChart3 className="card-icon" size={24} />
            <h3>Recent Session Attendance</h3>
          </div>
          
          <div className="attendance-list">
            {recentAttendance.map((record) => (
              <div key={record.id} className="attendance-item lecturer">
                <div className="attendance-info">
                  <div className="course-info">
                    <span className="course-code">{record.course}</span>
                    <span className="session-name">{record.session}</span>
                  </div>
                  <div className="attendance-meta">
                    <span className="date">{record.date}</span>
                    <span className="attendance-count">
                      {record.present}/{record.total} students
                    </span>
                  </div>
                </div>
                <div className="attendance-rate">
                  <div className={`rate-badge ${getAttendanceColor(record.rate)}`}>
                    {record.rate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LecturerDashboard