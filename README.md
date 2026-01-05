# AttendIQ - Frontend Template

A modern React-based facial recognition attendance system template with mock data for demonstration purposes.

## 🚀 Features

- **Facial Recognition Interface**: Real-time camera integration with scanning animations
- **Multi-Role Dashboard**: Separate interfaces for Students, Lecturers, and Administrators
- **Mock Data System**: Complete frontend functionality with simulated backend responses
- **Responsive Design**: Modern, mobile-friendly interface with smooth animations
- **Interactive Components**: Live face recognition simulation, login system, and dashboard analytics

## 🛠 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool and development server
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Webcam** - Camera integration for face recognition
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/attendiq-frontend.git
cd attendiq-frontend
```

### 2. Install Dependencies

```bash
# Install client dependencies
npm run install-deps
```

### 3. Start the Application

```bash
# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000

## 🧪 How to Test

### 1. **Landing Page Testing**
- Open http://localhost:3000
- Test the face recognition interface:
  - Click "Enable Camera" to activate webcam
  - Click "Mark Attendance" to simulate face recognition
  - Watch the scanning animation and status updates

### 2. **Admin Login Testing**
- Click "Admin Login" button
- Use credentials: `admin` / `admin123`
- Explore the admin dashboard with:
  - System statistics
  - Recent activity feed
  - Low attendance alerts

### 3. **Lecturer Login Testing**
- Click "Lecturer Login" button
- Use credentials: `lecturer` / `lecturer123`
- Explore the lecturer dashboard with:
  - Course management
  - Upcoming sessions
  - Attendance analytics

### 4. **Student Dashboard Testing**
- Navigate to `/student-dashboard` directly
- View student attendance statistics
- Check recent attendance records

### 5. **Interactive Features Testing**
- **Sidebar Navigation**: Click different sidebar icons on landing page
- **Real-time Clock**: Watch the live time updates
- **Animations**: Hover over buttons and cards for smooth transitions
- **Responsive Design**: Resize browser window to test mobile layout
- **Face Recognition**: Test camera permissions and scanning simulation

## 👥 Demo Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: System administration dashboard

### Lecturer Account
- **Username**: `lecturer`
- **Password**: `lecturer123`
- **Access**: Course and session management

## 📱 Application Structure

```
attendiq-frontend/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── FaceRecognition.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── LecturerLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LecturerDashboard.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── services/      # Mock API service
│   │   │   └── mockApi.js
│   │   └── ...
└── README.md
```

## 🎯 Key Features Explained

### Mock API System
- Simulates real backend responses with realistic delays
- Includes authentication, attendance marking, and dashboard data
- 90% success rate for face recognition simulation
- Persistent login state using localStorage

### Face Recognition Simulation
- Real webcam integration using React Webcam
- Animated scanning interface with detection corners
- Confidence score simulation
- Success/failure scenarios with visual feedback

### Dashboard Analytics
- **Student Dashboard**: Personal attendance statistics, recent records
- **Lecturer Dashboard**: Course management, session attendance rates  
- **Admin Dashboard**: System overview, low attendance alerts

### Responsive Design
- Mobile-first approach with breakpoints
- Smooth animations using Framer Motion
- Modern glassmorphism UI effects
- Touch-friendly interface elements

## 🚀 Customization

### Adding New Mock Data
Edit `client/src/services/mockApi.js` to:
- Add more students, courses, or sessions
- Modify attendance statistics
- Change success/failure rates
- Add new API endpoints

### Styling Changes
- Main styles: `client/src/index.css`
- Component styles: Individual `.css` files
- Dashboard styles: `client/src/pages/Dashboard.css`

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Update routing in `client/src/App.jsx`
4. Add mock API endpoints in `client/src/services/mockApi.js`

## 🔮 Integration with Real Backend

To connect this template to a real backend:

1. Replace `mockApi.js` with actual API calls using axios or fetch
2. Update authentication to use real JWT tokens
3. Implement actual face recognition API integration
4. Add error handling for network requests
5. Update environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Team

**AttendIQ Team**
- Maleesha Sanjana
- Vishmi Kavindya  
- Nurani Kaushalya

---

**AttendIQ Frontend Template** - A complete React-based attendance system ready for customization! 🎓✨