import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { Camera, Scan, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { mockApi } from '../services/mockApi'
import './FaceRecognition.css'

const FaceRecognition = ({ onAttendanceMarked }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState('ready') // ready, scanning, success, error
  const [webcamEnabled, setWebcamEnabled] = useState(false)
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user"
  }

  const startScanning = useCallback(async () => {
    if (isScanning) return

    setIsScanning(true)
    setStatus('scanning')
    
    try {
      // Simulate face recognition process using mock API
      const mockStudentData = {
        student_id: 'STU001',
        session_id: 1,
        confidence_score: 0.95,
        device_info: navigator.userAgent
      }
      
      const response = await mockApi.markAttendance(mockStudentData)
      
      setStatus('success')
      onAttendanceMarked({
        id: 'STU001',
        name: 'John Doe',
        timestamp: new Date().toISOString(),
        confidence: 0.95
      })
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('ready')
        setIsScanning(false)
      }, 3000)
      
    } catch (error) {
      setStatus('error')
      toast.error(error.message || 'Face recognition failed')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('ready')
        setIsScanning(false)
      }, 3000)
    }
  }, [isScanning, onAttendanceMarked])

  const enableWebcam = () => {
    setWebcamEnabled(true)
    toast.success('Camera enabled')
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      startScanning()
      // Here you would send the image to your backend for processing
      console.log('Captured image for processing')
    }
  }, [startScanning])

  const getStatusColor = () => {
    switch (status) {
      case 'scanning': return '#ffaa00'
      case 'success': return '#00ff88'
      case 'error': return '#ff4444'
      default: return '#00ff88'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'scanning': return 'Scanning...'
      case 'success': return 'Recognition Successful'
      case 'error': return 'Recognition Failed'
      default: return 'Ready for Recognition'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'scanning': return <Scan className="status-icon" size={16} />
      case 'success': return <CheckCircle className="status-icon" size={16} />
      case 'error': return <AlertCircle className="status-icon" size={16} />
      default: return <Camera className="status-icon" size={16} />
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
        {webcamEnabled ? (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="webcam"
            />
            <div className="face-detection-overlay">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              
              {status === 'scanning' && (
                <motion.div 
                  className="scanning-line"
                  animate={{ y: [0, 260] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              )}
            </div>
            
            <motion.button
              className="capture-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={capture}
              disabled={isScanning}
            >
              {isScanning ? 'Processing...' : 'Mark Attendance'}
            </motion.button>
          </div>
        ) : (
          <div className="camera-placeholder">
            <div className="face-detection-overlay">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            
            <div className="placeholder-content">
              <Camera size={64} className="camera-icon" />
              <p className="placeholder-text">Click to enable camera</p>
              <motion.button
                className="enable-camera-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={enableWebcam}
              >
                Enable Camera
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
      
      <motion.div 
        className="status-indicator"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div 
          className="status-dot" 
          style={{ backgroundColor: getStatusColor() }}
        />
        {getStatusIcon()}
        <span className="status-text">{getStatusText()}</span>
      </motion.div>
    </div>
  )
}

export default FaceRecognition