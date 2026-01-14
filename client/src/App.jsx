import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminLogin from './pages/AdminLogin'
import LecturerLogin from './pages/LecturerLogin'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminAttendanceOverview from './pages/AdminAttendanceOverview'
import AdminOverview from './pages/AdminOverview'
import AdminProfile from './pages/AdminProfile'
import AdminNotifications from './pages/AdminNotifications'
import LecturerDashboard from './pages/LecturerDashboard'
import LecturerOverview from './pages/LecturerOverview'
import LecturerProfile from './pages/LecturerProfile'
import ReportGenerating from './pages/ReportGenerating'
import AdminReportGenerating from './pages/AdminReportGenerating'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/lecturer-login" element={<LecturerLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-attendance-overview" element={<AdminAttendanceOverview />} />
        <Route path="/admin-overview" element={<AdminOverview />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-notifications" element={<AdminNotifications />} />
        <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
        <Route path="/lecturer-overview" element={<LecturerOverview />} />
        <Route path="/lecturer-profile" element={<LecturerProfile />} />
        <Route path="/report-generating" element={<ReportGenerating />} />
        <Route path="/admin-report-generating" element={<AdminReportGenerating />} />
      </Routes>
    </div>
  )
}

export default App