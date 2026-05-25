import React from 'react'
import Login from './pages/login/Login'
import RoutesLayout from './layout/RoutesLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Transaction from './pages/transaction/Transaction'
import Categories from './pages/categories/Categories'
import Statistics from './pages/statistics/Statistics'
import Profile from './pages/profile/Profile'
import Signup from './pages/signup/Signup'

const App = () => {

  const router = createBrowserRouter([
     {
          path: "/",
          element: <Login/>
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/dashboard",
      element: <RoutesLayout />,
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
    }
  ])
  
  return (<RouterProvider router={router}/>)
}

export default App
