// Mock API service to simulate backend responses
// This replaces the actual backend API calls with mock data

// Mock user data
const mockUsers = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'admin@attendiq.com',
    role: 'admin',
    first_name: 'System',
    last_name: 'Administrator'
  },
  lecturer: {
    id: 2,
    username: 'lecturer',
    email: 'lecturer@attendiq.com',
    role: 'lecturer',
    first_name: 'John',
    last_name: 'Smith'
  }
}

// Mock student data
const mockStudents = [
  { id: 1, student_id: 'STU001', first_name: 'Alice', last_name: 'Johnson', email: 'alice@student.com', department: 'Computer Science', year_of_study: 2 },
  { id: 2, student_id: 'STU002', first_name: 'Bob', last_name: 'Wilson', email: 'bob@student.com', department: 'Computer Science', year_of_study: 2 },
  { id: 3, student_id: 'STU003', first_name: 'Carol', last_name: 'Davis', email: 'carol@student.com', department: 'Computer Science', year_of_study: 3 },
  { id: 4, student_id: 'STU004', first_name: 'David', last_name: 'Brown', email: 'david@student.com', department: 'Information Technology', year_of_study: 1 },
  { id: 5, student_id: 'STU005', first_name: 'Emma', last_name: 'Taylor', email: 'emma@student.com', department: 'Information Technology', year_of_study: 2 }
]

// Mock courses data
const mockCourses = [
  { id: 1, course_code: 'CS101', course_name: 'Introduction to Programming', lecturer_id: 2, department: 'Computer Science', credits: 3 },
  { id: 2, course_code: 'CS201', course_name: 'Data Structures', lecturer_id: 2, department: 'Computer Science', credits: 4 },
  { id: 3, course_code: 'IT101', course_name: 'Database Systems', lecturer_id: 2, department: 'Information Technology', credits: 3 }
]

// Mock attendance data
const mockAttendanceRecords = [
  { id: 1, student_id: 1, course: 'CS101', session: 'Introduction to Programming', date: '2024-01-15', status: 'present', time: '09:00 AM' },
  { id: 2, student_id: 1, course: 'CS201', session: 'Data Structures', date: '2024-01-14', status: 'late', time: '10:15 AM' },
  { id: 3, student_id: 1, course: 'IT101', session: 'Database Systems', date: '2024-01-13', status: 'present', time: '02:00 PM' },
  { id: 4, student_id: 1, course: 'CS101', session: 'Programming Fundamentals', date: '2024-01-12', status: 'absent', time: '-' },
  { id: 5, student_id: 1, course: 'CS201', session: 'Arrays and Linked Lists', date: '2024-01-11', status: 'present', time: '10:00 AM' }
]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const mockApi = {
  // Authentication
  login: async (username, password, role) => {
    await delay(1000) // Simulate network delay
    
    const validCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      lecturer: { username: 'lecturer', password: 'lecturer123' }
    }
    
    if (validCredentials[role] && 
        validCredentials[role].username === username && 
        validCredentials[role].password === password) {
      
      const user = mockUsers[role]
      const token = `mock-jwt-token-${role}-${Date.now()}`
      
      // Store in localStorage for persistence
      localStorage.setItem('attendiq_token', token)
      localStorage.setItem('attendiq_user', JSON.stringify(user))
      
      return {
        success: true,
        message: 'Login successful',
        token,
        user
      }
    }
    
    throw new Error('Invalid credentials')
  },

  // Verify token
  verifyToken: async () => {
    await delay(500)
    
    const token = localStorage.getItem('attendiq_token')
    const user = JSON.parse(localStorage.getItem('attendiq_user') || 'null')
    
    if (token && user) {
      return {
        success: true,
        user
      }
    }
    
    throw new Error('Invalid token')
  },

  // Logout
  logout: async () => {
    localStorage.removeItem('attendiq_token')
    localStorage.removeItem('attendiq_user')
    return { success: true }
  },

  // Mark attendance
  markAttendance: async (studentData) => {
    await delay(2000) // Simulate face recognition processing time
    
    // Simulate random success/failure
    const success = Math.random() > 0.1 // 90% success rate
    
    if (success) {
      return {
        success: true,
        message: 'Attendance marked successfully',
        attendance_id: Date.now(),
        status: 'present',
        type: 'checkin'
      }
    }
    
    throw new Error('Face recognition failed')
  },

  // Get admin dashboard stats
  getAdminStats: async () => {
    await delay(800)
    
    return {
      success: true,
      stats: {
        total_students: 245,
        total_courses: 12,
        total_sessions: 156,
        total_lecturers: 8,
        today_attendance: 89,
        monthly_attendance_rate: 82.5
      }
    }
  },

  // Get recent activity
  getRecentActivity: async () => {
    await delay(600)
    
    return {
      success: true,
      records: [
        { id: 1, type: 'attendance', student: 'Alice Johnson', course: 'CS101', time: '2 minutes ago', status: 'present' },
        { id: 2, type: 'attendance', student: 'Bob Wilson', course: 'CS201', time: '5 minutes ago', status: 'late' },
        { id: 3, type: 'enrollment', student: 'Carol Davis', course: 'IT101', time: '1 hour ago', status: 'enrolled' },
        { id: 4, type: 'attendance', student: 'David Brown', course: 'CS101', time: '2 hours ago', status: 'present' },
        { id: 5, type: 'session', course: 'Database Systems', lecturer: 'Dr. Smith', time: '3 hours ago', status: 'created' }
      ]
    }
  },

  // Get low attendance students
  getLowAttendanceStudents: async () => {
    await delay(700)
    
    return {
      success: true,
      students: [
        { id: 1, name: 'Emma Taylor', studentId: 'STU005', attendance: 65.2, department: 'IT' },
        { id: 2, name: 'Michael Chen', studentId: 'STU012', attendance: 72.8, department: 'CS' },
        { id: 3, name: 'Sarah Wilson', studentId: 'STU023', attendance: 76.5, department: 'CS' }
      ]
    }
  },

  // Get lecturer courses
  getLecturerCourses: async () => {
    await delay(600)
    
    return {
      success: true,
      courses: [
        { id: 1, code: 'CS101', name: 'Introduction to Programming', students: 45, sessions: 24 },
        { id: 2, code: 'CS201', name: 'Data Structures', students: 38, sessions: 20 },
        { id: 3, code: 'IT101', name: 'Database Systems', students: 42, sessions: 18 }
      ]
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async () => {
    await delay(500)
    
    return {
      success: true,
      sessions: [
        { id: 1, course: 'CS101', name: 'Variables and Data Types', date: '2024-01-16', time: '09:00 AM', location: 'Room 101' },
        { id: 2, course: 'CS201', name: 'Binary Trees', date: '2024-01-16', time: '11:00 AM', location: 'Room 203' },
        { id: 3, course: 'IT101', name: 'SQL Queries', date: '2024-01-17', time: '02:00 PM', location: 'Lab 1' },
        { id: 4, course: 'CS101', name: 'Control Structures', date: '2024-01-18', time: '09:00 AM', location: 'Room 101' }
      ]
    }
  },

  // Get recent session attendance
  getRecentSessionAttendance: async () => {
    await delay(600)
    
    return {
      success: true,
      attendance: [
        { id: 1, course: 'CS101', session: 'Introduction to Programming', date: '2024-01-15', present: 42, total: 45, rate: 93.3 },
        { id: 2, course: 'CS201', session: 'Arrays and Pointers', date: '2024-01-14', present: 35, total: 38, rate: 92.1 },
        { id: 3, course: 'IT101', session: 'Database Design', date: '2024-01-13', present: 38, total: 42, rate: 90.5 },
        { id: 4, course: 'CS101', session: 'Programming Basics', date: '2024-01-12', present: 40, total: 45, rate: 88.9 }
      ]
    }
  },

  // Get student attendance stats
  getStudentAttendanceStats: async (studentId) => {
    await delay(700)
    
    return {
      success: true,
      stats: {
        total_sessions: 45,
        attended_sessions: 38,
        attendance_percentage: 84.4,
        present_sessions: 35,
        late_sessions: 3,
        absent_sessions: 7
      }
    }
  },

  // Get student recent attendance
  getStudentRecentAttendance: async (studentId) => {
    await delay(500)
    
    return {
      success: true,
      attendance: mockAttendanceRecords
    }
  }
}

// Export individual functions for easier imports
export const {
  login,
  verifyToken,
  logout,
  markAttendance,
  getAdminStats,
  getRecentActivity,
  getLowAttendanceStudents,
  getLecturerCourses,
  getUpcomingSessions,
  getRecentSessionAttendance,
  getStudentAttendanceStats,
  getStudentRecentAttendance
} = mockApi