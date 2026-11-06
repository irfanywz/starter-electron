import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from '@/components/ErrorBoundary'
import { errorStack } from '@/lib/errors'
import './styles.css'

// Error yang nggak ketangkep di renderer ikut masuk ke file log (<dataDir>/logs/main.log)
window.addEventListener('error', (e) => {
  window.api.log.error(`Uncaught: ${e.message}\n${errorStack(e.error)}`)
})
window.addEventListener('unhandledrejection', (e) => {
  window.api.log.error(`Unhandled rejection: ${errorStack(e.reason)}`)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
