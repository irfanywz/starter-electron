import { Navigate, createHashRouter } from 'react-router'
import Layout from '@/components/Layout'
import RouteError from '@/components/RouteError'
import HomePage from '@/pages/HomePage'
import SettingsPage from '@/pages/SettingsPage'

// Hash router (#/settings) karena di production app dimuat dari file://, bukan server.
// Error di halaman ditangkap errorElement di level child, jadi sidebar + titlebar tetap hidup.
// Error di Layout sendiri ditangkap errorElement di root (fullscreen).
export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError fullscreen />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/" replace /> }
        ]
      }
    ]
  }
])
