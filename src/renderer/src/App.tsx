import { useEffect } from 'react'
import { RouterProvider } from 'react-router/dom'
import { router } from './router'
import { useSettingsStore } from '@/store/useSettingsStore'

export default function App() {
  useEffect(() => useSettingsStore.getState().init(), [])

  return <RouterProvider router={router} />
}
