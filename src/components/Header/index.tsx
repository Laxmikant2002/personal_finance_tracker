import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './styles.css'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const isSignupPage = location.pathname === '/signup'

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/signup')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className='navbar'>
      <div className='logo' onClick={() => currentUser && navigate('/dashboard')}>
        Financely.
      </div>
      {currentUser && !isSignupPage ? (
        <div className='nav-actions'>
          <span className='user-name-header'>{currentUser.displayName || currentUser.email}</span>
          <button className='nav-link logout-btn' onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : !isSignupPage ? (
        <div className='nav-link' onClick={() => navigate('/dashboard')}>
          Dashboard
        </div>
      ) : null}
    </div>
  )
}

export default Header