import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './styles.css'

function SignupSignin() {
  const { signup, login, loginWithGoogle } = useAuth()
  const [isSignup, setIsSignup] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSignup) {
      // Signup validation
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters!')
        return
      }
    }

    setLoading(true)
    try {
      if (isSignup) {
        await signup(formData.email, formData.password, formData.fullName)
      } else {
        await login(formData.email, formData.password)
      }
    } catch (error) {
      console.error(`${isSignup ? 'Signup' : 'Login'} failed:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Google authentication failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className='signup-signin-container'>
      <div className='signup-signin-card'>
        <div className='auth-tabs'>
          <button
            className={`tab-button ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
            type='button'
          >
            Sign Up
          </button>
          <button
            className={`tab-button ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
            type='button'
          >
            Sign In
          </button>
        </div>

        <h2 className='signup-title'>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className='subtitle'>
          {isSignup 
            ? 'Start managing your finances today' 
            : 'Sign in to continue to Financely'}
        </p>

        <form className='signup-form' onSubmit={handleSubmit}>
          {isSignup && (
            <div className='form-group'>
              <label htmlFor='fullName'>Full Name</label>
              <input
                type='text'
                id='fullName'
                placeholder='John Doe'
                className='form-input'
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              placeholder='john@example.com'
              className='form-input'
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              placeholder={isSignup ? 'Create a password (min 6 characters)' : 'Enter your password'}
              className='form-input'
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {isSignup && (
            <div className='form-group'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                id='confirmPassword'
                placeholder='Confirm your password'
                className='form-input'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          )}

          <button type='submit' className='btn-primary' disabled={loading}>
            {loading 
              ? 'Please wait...' 
              : isSignup 
                ? 'Create Account' 
                : 'Sign In'}
          </button>

          <div className='divider-container'>
            <div className='divider-line'></div>
            <span className='divider-text'>OR</span>
            <div className='divider-line'></div>
          </div>

          <button 
            type='button' 
            className='btn-google' 
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {loading ? 'Please wait...' : `Continue with Google`}
          </button>
        </form>

        <p className='switch-mode'>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button 
            type='button' 
            className='switch-link' 
            onClick={switchMode}
            disabled={loading}
          >
            {isSignup ? ' Sign In' : ' Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignupSignin