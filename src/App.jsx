import React, { useState, useEffect } from 'react'
import Login from './pages/login/Login'
import RoutesLayout from './layout/RoutesLayout'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Transaction from './pages/transaction/Transaction'
import Categories from './pages/categories/Categories'
import Statistics from './pages/statistics/Statistics'
import Profile from './pages/profile/Profile'
import Signup from './pages/signup/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebaseConfig'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.6rem', color: 'var(--text)' }}>
        Yuklanmoqda...
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? <Navigate to="/dashboard" replace /> : <Login />
    },
    {
      path: "/signup",
      element: user ? <Navigate to="/dashboard" replace /> : <Signup />
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <RoutesLayout darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      ),
      errorElement: <h1>Error</h1>,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: "transaction",
          element: <Transaction />
        },
        {
          path: "categories",
          element: <Categories />
        },
        {
          path: "statistics",
          element: <Statistics />
        },
        {
          path: "profile",
          element: <Profile />
        },
      ]
    },
    {
      path: "*",
      element: <Navigate to={user ? "/dashboard" : "/"} replace />
    }
  ])

  return <RouterProvider router={router} />
}

export default App