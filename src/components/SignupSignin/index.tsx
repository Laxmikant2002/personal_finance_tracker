import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './styles.css'

function SignupSignin() {
  const { signup, loginWithGoogle } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    try {
      await signup(formData.email, formData.password, formData.fullName)
      // Navigation is handled by App.tsx based on currentUser state
    } catch (error) {
      console.error('Signup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      // Navigation is handled by App.tsx based on currentUser state
    } catch (error) {
      console.error('Google signup failed:', error)
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

  return (
    <div className='signup-signin-container'>
      <div className='signup-signin-card'>
        <h2 className='signup-title'>
          Sign Up On <span className='brand-name'>Financely.</span>
        </h2>

        <form className='signup-form' onSubmit={handleSubmit}>
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

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='JohnDoe@gmail.com'
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
              placeholder='Your Password'
              className='form-input'
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              placeholder='Confirm Password'
              className='form-input'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type='submit' className='btn-primary' disabled={loading}>
            {loading ? 'Creating Account...' : 'Signup With Email'}
          </button>

          <p className='divider'>Or</p>

          <button 
            type='button' 
            className='btn-google' 
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Signup With Google'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupSignin