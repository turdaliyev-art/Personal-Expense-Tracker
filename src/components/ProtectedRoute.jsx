import { Navigate } from 'react-router-dom'
import { auth } from '../firebase/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth)

  if (loading) return <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: 'var(--text-color)'
  }}>Yuklanmoqda...</div>

  if (!user) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
