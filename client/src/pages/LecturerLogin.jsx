import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { User, Lock, ArrowLeft, Camera, AlertCircle, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './Login.css'

const LecturerLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  
  // Face recognition states
  const [cameraError, setCameraError] = useState(null)
  const [cameraLoading, setCameraLoading] = useState(true)
  const [permissionRequested, setPermissionRequested] = useState(false)
  const [showPermissionHelper, setShowPermissionHelper] = useState(false)
  const webcamRef = useRef(null)
  const streamRef = useRef(null)

  // Auto-request camera permission on component mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480, 
            facingMode: "user" 
          } 
        })
        
        stream.getTracks().forEach(track => track.stop())
        setPermissionRequested(true)
        setCameraLoading(false)
        
      } catch (error) {
        console.error('Permission request failed:', error)
        setPermissionRequested(true)
        setCameraLoading(false)
        
        if (error.name === 'NotAllowedError') {
          setShowPermissionHelper(true)
          setCameraError('Camera permission is required for face recognition')
        } else {
          handleCameraError(error)
        }
      }
    }

    const timer = setTimeout(requestCameraPermission, 500)
    return () => clearTimeout(timer)
  }, [])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use admin credentials for lecturer login as requested
      const response = await mockApi.login(formData.username, formData.password, 'admin')
      toast.success('Login successful!')
      // Redirect to lecturer overview after admin authentication
      navigate('/lecturer-overview')
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onUserMedia = (stream) => {
    streamRef.current = stream
    setCameraError(null)
    setCameraLoading(false)
    setShowPermissionHelper(false)
    console.log('Camera initialized successfully')
  }

  const onUserMediaError = (error) => {
    console.error('Camera error:', error)
    setCameraLoading(false)
    const errorMessage = handleCameraError(error)
    toast.error(errorMessage)
    
    if (error.name === 'NotAllowedError') {
      setShowPermissionHelper(true)
    }
  }

  const handleCameraError = (error) => {
    let errorMessage = 'Unable to access camera'
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera access denied. Please allow camera permissions.'
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device.'
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is already in use by another application.'
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera constraints cannot be satisfied.'
    }
    
    setCameraError(errorMessage)
    return errorMessage
  }

  const retryCamera = () => {
    setCameraError(null)
    setCameraLoading(true)
    setShowPermissionHelper(false)
    
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const openCameraSettings = () => {
    toast.info('Please check your browser settings to allow camera access')
    if (navigator.userAgent.includes('Chrome')) {
      toast.info('Chrome: Click the camera icon in the address bar')
    } else if (navigator.userAgent.includes('Firefox')) {
      toast.info('Firefox: Click the shield icon in the address bar')
    } else if (navigator.userAgent.includes('Safari')) {
      toast.info('Safari: Go to Safari > Settings > Websites > Camera')
    }
  }

  return (
    <div className="login-container-with-face">
      <motion.button
        className="back-btn"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Back to Home
      </motion.button>

      <div className="login-content-grid">
        {/* Face Recognition Section */}
        <div className="face-recognition-section">
          <div className="face-section-header">
            <h2>Face Recognition</h2>
            <p>Position your face within the frame for verification</p>
          </div>
          
          <motion.div 
            className="camera-frame-login"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {cameraLoading ? (
              <div className="camera-loading">
                <div className="face-detection-overlay">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                
                <div className="loading-content">
                  <Camera size={64} className="loading-icon" />
                  <p className="loading-text">Initializing camera...</p>
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                </div>
              </div>
            ) : showPermissionHelper ? (
              <div className="permission-helper">
                <div className="face-detection-overlay">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                
                <div className="permission-content">
                  <Shield size={48} className="permission-icon" />
                  <h3 className="permission-title">Camera Permission Required</h3>
                  <p className="permission-text">
                    Please allow camera access for face verification.
                  </p>
                  
                  <div className="permission-actions">
                    <motion.button
                      className="retry-camera-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={retryCamera}
                    >
                      <Camera size={16} />
                      Try Again
                    </motion.button>
                    
                    <motion.button
                      className="settings-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openCameraSettings}
                    >
                      <Shield size={16} />
                      Settings
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : cameraError ? (
              <div className="camera-error">
                <div className="face-detection-overlay">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                
                <div className="error-content">
                  <AlertCircle size={48} className="error-icon" />
                  <p className="error-text">{cameraError}</p>
                  <motion.button
                    className="retry-camera-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retryCamera}
                  >
                    <Camera size={16} />
                    Retry Camera
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="webcam-container">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="webcam-login"
                  onUserMedia={onUserMedia}
                  onUserMediaError={onUserMediaError}
                />
                <div className="face-detection-overlay">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Login Form Section */}
        <div className="login-form-section">
          <motion.div
            className="login-card-with-face"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="login-header">
              <h1>Lecturer Access</h1>
              <p>Enter admin credentials to access lecturer dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="login-submit-btn lecturer"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </form>

            <div className="login-footer">
              <p>Demo credentials: admin / admin123</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LecturerLogin