import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { Camera, AlertCircle, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import './FaceRecognition.css'

const FaceRecognition = ({ onAttendanceMarked }) => {
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
        // Try to get camera permission immediately
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480, 
            facingMode: "user" 
          } 
        })
        
        // If successful, stop the stream (react-webcam will handle it)
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

    // Small delay to show loading state
    const timer = setTimeout(requestCameraPermission, 500)
    return () => clearTimeout(timer)
  }, [])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  }

  const startScanning = useCallback(async () => {
    // This function can be used later if needed for automatic scanning
    try {
      // Simulate face recognition process using mock API
      const mockStudentData = {
        student_id: 'STU001',
        session_id: 1,
        confidence_score: 0.95,
        device_info: navigator.userAgent
      }
      
      // You can add automatic attendance marking logic here if needed
      onAttendanceMarked({
        id: 'STU001',
        name: 'John Doe',
        timestamp: new Date().toISOString(),
        confidence: 0.95
      })
      
    } catch (error) {
      console.error('Face recognition error:', error)
    }
  }, [onAttendanceMarked])

  const enableWebcam = () => {
    setWebcamEnabled(true)
    toast.success('Camera enabled')
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
    
    // Reset and try again
    setTimeout(() => {
      // Force webcam to reinitialize
      window.location.reload()
    }, 100)
  }

  const openCameraSettings = () => {
    toast.info('Please check your browser settings to allow camera access')
    // Try to provide helpful instructions
    if (navigator.userAgent.includes('Chrome')) {
      toast.info('Chrome: Click the camera icon in the address bar')
    } else if (navigator.userAgent.includes('Firefox')) {
      toast.info('Firefox: Click the shield icon in the address bar')
    } else if (navigator.userAgent.includes('Safari')) {
      toast.info('Safari: Go to Safari > Settings > Websites > Camera')
    }
  }

  return (
    <div className="face-recognition-container">
      <motion.div 
        className="camera-frame"
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
              <Shield size={64} className="permission-icon" />
              <h3 className="permission-title">Camera Permission Required</h3>
              <p className="permission-text">
                To use face recognition for attendance, please allow camera access when prompted by your browser.
              </p>
              
              <div className="permission-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <span className="step-text">Click "Allow" when browser asks for camera permission</span>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <span className="step-text">If blocked, click the camera icon in address bar</span>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <span className="step-text">Select "Allow" and refresh the page</span>
                </div>
              </div>
              
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
                  Browser Settings
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
              <AlertCircle size={64} className="error-icon" />
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
              className="webcam"
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
  )
}

export default FaceRecognition