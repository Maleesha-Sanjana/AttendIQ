import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminLogin from './pages/AdminLogin'
import LecturerLogin from './pages/LecturerLogin'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import LecturerDashboard from './pages/LecturerDashboard'
import LecturerProfile from './pages/LecturerProfile'
import ReportGenerating from './pages/ReportGenerating'
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
        <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
        <Route path="/lecturer-profile" element={<LecturerProfile />} />
        <Route path="/report-generating" element={<ReportGenerating />} />
      </Routes>
    </div>
  )
}

export default App