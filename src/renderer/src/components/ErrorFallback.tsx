import { TriangleAlert } from 'lucide-react'
import TitleBar from '@/components/TitleBar'
import { errorMessage, errorStack } from '@/lib/errors'

interface Props {
  error: unknown
  /** Tombol pemulihan (mis. "Go home"). Kosong = cuma tombol Reload. */
  onReset?: () => void
  resetLabel?: string
  /** Isi seluruh window + titlebar sendiri (dipakai kalau Layout ikut crash) */
  fullscreen?: boolean
}

const buttonClass = 'rounded-lg border border-border bg-surface px-4 py-1.5 text-sm hover:bg-fg/10'

export default function ErrorFallback({ error, onReset, resetLabel = 'Try again', fullscreen }: Props) {
  const content = (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <TriangleAlert size={32} className="text-red-500" />
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
      <p className="text-xs text-muted">The error has been saved to the log.</p>

      <div className="flex gap-2">
        {onReset && (
          <button className={buttonClass} onClick={onReset}>
            {resetLabel}
          </button>
        )}
        <button className={buttonClass} onClick={() => window.location.reload()}>
          Reload app
        </button>
      </div>

      <details className="max-w-xl text-left text-xs text-muted">
        <summary className="cursor-pointer">Details</summary>
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap select-text">
          {errorStack(error)}
        </pre>
      </details>
    </div>
  )

  if (!fullscreen) return content
  return (
    <div className="flex h-full flex-col">
      <TitleBar />
      <div className="min-h-0 flex-1">{content}</div>
    </div>
  )
}
