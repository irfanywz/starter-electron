import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorFallback from '@/components/ErrorFallback'
import { errorStack } from '@/lib/errors'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
  error: unknown
}

/**
 * Jaring pengaman terluar: nangkap error render yang lolos dari router
 * (error di dalam halaman sudah ditangani errorElement di router.tsx).
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, error: null }

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, error }
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    window.api.log.error(
      `React error boundary: ${errorStack(error)}\nComponent stack:${info.componentStack}`
    )
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children
    return (
      <ErrorFallback
        error={this.state.error}
        onReset={() => this.setState({ failed: false, error: null })}
        fullscreen
      />
    )
  }
}
