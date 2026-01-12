import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import { 
  Camera, 
  X, 
  User, 
  Shield, 
  AlertCircle,
  UserPlus,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import './UserRegistration.css'

const UserRegistration = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1) // 1: Form, 2: Face Capture, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    role: 'student',
    faculty: '',
    building: ''
  })
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [cameraLoading, setCameraLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 480,
    height: 360,
    facingMode: "user"
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.studentId || !formData.email || !formData.faculty || !formData.building) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Move to face capture step and reset camera state
    setStep(2)
    setCameraLoading(true)
    setCameraError(null)
    setPermissionRequested(false)
  }

  // Initialize camera when step 2 is reached
  useEffect(() => {
    if (step === 2 && !permissionRequested) {
      const requestCameraPermission = async () => {
        try {
          // Small delay to show loading state
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Try to get camera permission
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: 480, 
              height: 360, 
              facingMode: "user" 
            } 
          })
          
          // If successful, stop the stream (react-webcam will handle it)
          stream.getTracks().forEach(track => track.stop())
          setPermissionRequested(true)
          setCameraLoading(false)
          setCameraError(null)
          
        } catch (error) {
          console.error('Camera permission request failed:', error)
          setPermissionRequested(true)
          setCameraLoading(false)
          
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
          toast.error(errorMessage)
        }
      }

      requestCameraPermission()
    }
  }, [step, permissionRequested])

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
    toast.success('Photo captured successfully!')
  }, [webcamRef])

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const handleSubmitRegistration = async () => {
    if (!capturedImage) {
      toast.error('Please capture a photo first')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call for user registration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock registration data
      const registrationData = {
        ...formData,
        faceImage: capturedImage,
        registrationDate: new Date().toISOString(),
        status: 'active'
      }
      
      console.log('User registered:', registrationData)
      
      setStep(3)
      toast.success('User registered successfully!')
      
      // Auto close after 3 seconds
      setTimeout(() => {
        handleClose()
      }, 3000)
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      name: '',
      studentId: '',
      email: '',
      role: 'student',
      faculty: '',
      building: ''
    })
    setCapturedImage(null)
    setCameraError(null)
    setCameraLoading(true)
    setPermissionRequested(false)
    onClose()
  }

  const onUserMedia = (stream) => {
    console.log('Camera initialized successfully')
    setCameraError(null)
    setCameraLoading(false)
  }

  const onUserMediaError = (error) => {
    console.error('Camera error:', error)
    setCameraLoading(false)
    
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
    toast.error(errorMessage)
  }

  const retryCamera = () => {
    setCameraError(null)
    setCameraLoading(true)
    setPermissionRequested(false)
    
    // Trigger camera initialization again
    setTimeout(() => {
      if (step === 2) {
        const requestCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                width: 480, 
                height: 360, 
                facingMode: "user" 
              } 
            })
            
            stream.getTracks().forEach(track => track.stop())
            setPermissionRequested(true)
            setCameraLoading(false)
            setCameraError(null)
            
          } catch (error) {
            console.error('Camera retry failed:', error)
            setPermissionRequested(true)
            setCameraLoading(false)
            
            let errorMessage = 'Unable to access camera'
            if (error.name === 'NotAllowedError') {
              errorMessage = 'Camera access denied. Please allow camera permissions.'
            }
            
            setCameraError(errorMessage)
            toast.error(errorMessage)
          }
        }
        
        requestCameraPermission()
      }
    }, 100)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="user-registration-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div 
          className="user-registration-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="header-content">
              <UserPlus size={24} className="header-icon" />
              <h2>User Registration</h2>
            </div>
            <button className="close-btn" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Details</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Face Capture</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Complete</span>
            </div>
          </div>

          {/* Content */}
          <div className="modal-content">
            {step === 1 && (
              <motion.div 
                className="form-step"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <form onSubmit={handleFormSubmit} className="registration-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="studentId">Student/Staff ID *</label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        placeholder="Enter ID number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="role">Role *</label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="faculty">Faculty *</label>
                      <select
                        id="faculty"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Faculty</option>
                        <option value="Computing">Computing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Management">Management</option>
                        <option value="Humanities">Humanities</option>
                        <option value="Science">Science</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="building">Building *</label>
                      <select
                        id="building"
                        name="building"
                        value={formData.building}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Building</option>
                        <option value="Dortian">Dortian</option>
                        <option value="Zenith">Zenith</option>
                        <option value="Westlane">Westlane</option>
                        <option value="Spencer">Spencer</option>
                        <option value="Sky">Sky</option>
                        <option value="Top">Top</option>
                        <option value="Phoenix">Phoenix</option>
                        <option value="Aurora">Aurora</option>
                        <option value="Nexus">Nexus</option>
                        <option value="Vertex">Vertex</option>
                        <option value="Summit">Summit</option>
                        <option value="Crystal">Crystal</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Diamond">Diamond</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={handleClose}>
                      Cancel
                    </button>
                    <button type="submit" className="next-btn">
                      Next: Capture Face
                      <Camera size={16} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                className="capture-step"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div className="capture-instructions">
                  <Shield size={20} />
                  <p>Position your face within the frame and capture a clear photo for face recognition.</p>
                </div>

                <div className="camera-container">
                  {cameraLoading ? (
                    <div className="camera-loading">
                      <div className="face-detection-overlay">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                      </div>
                      <div className="loading-content">
                        <Camera size={48} className="loading-icon" />
                        <p>Initializing camera...</p>
                        <div className="spinner"></div>
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
                        <p>{cameraError}</p>
                        <button className="retry-btn" onClick={retryCamera}>
                          <Camera size={16} />
                          Retry Camera
                        </button>
                      </div>
                    </div>
                  ) : capturedImage ? (
                    <div className="captured-image-container">
                      <img src={capturedImage} alt="Captured" className="captured-image" />
                      <div className="face-detection-overlay">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                      </div>
                      <div className="capture-success">
                        <Check size={24} />
                        <span>Photo Captured</span>
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
                        key={`webcam-${step}-${permissionRequested}`}
                      />
                      <div className="face-detection-overlay">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="capture-actions">
                  <button type="button" className="back-btn" onClick={() => setStep(1)}>
                    Back
                  </button>
                  
                  {capturedImage ? (
                    <div className="captured-actions">
                      <button type="button" className="retake-btn" onClick={retakePhoto}>
                        <Camera size={16} />
                        Retake Photo
                      </button>
                      <button 
                        type="button" 
                        className="submit-btn"
                        onClick={handleSubmitRegistration}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner small"></div>
                            Registering...
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} />
                            Register User
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="capture-btn"
                      onClick={capturePhoto}
                      disabled={cameraError || cameraLoading}
                    >
                      <Camera size={16} />
                      Capture Photo
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                className="success-step"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="success-content">
                  <div className="success-icon">
                    <Check size={48} />
                  </div>
                  <h3>Registration Successful!</h3>
                  <p>User has been registered successfully with face recognition enabled.</p>
                  
                  <div className="user-summary">
                    <div className="summary-item">
                      <span className="label">Name:</span>
                      <span className="value">{formData.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">ID:</span>
                      <span className="value">{formData.studentId}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Role:</span>
                      <span className="value">{formData.role}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Faculty:</span>
                      <span className="value">{formData.faculty}</span>
                    </div>
                  </div>

                  <button className="done-btn" onClick={handleClose}>
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UserRegistration