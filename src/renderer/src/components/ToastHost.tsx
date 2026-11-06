import { CircleCheck, CircleX, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { useToastStore, type ToastType } from '@/store/useToastStore'

const variants: Record<ToastType, { Icon: LucideIcon; color: string }> = {
  info: { Icon: Info, color: 'text-accent' },
  success: { Icon: CircleCheck, color: 'text-emerald-500' },
  warning: { Icon: TriangleAlert, color: 'text-amber-500' },
  error: { Icon: CircleX, color: 'text-red-500' }
}

/** Render sekali di Layout. Toast muncul di tengah bawah. */
export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map(({ id, type, message }) => {
        const { Icon, color } = variants[type]
        return (
          <div
            key={id}
            role={type === 'error' ? 'alert' : 'status'}
            className="toast-in pointer-events-auto flex max-w-md items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm shadow-lg"
          >
            <Icon size={16} className={`shrink-0 ${color}`} />
            <span className="min-w-0 break-words">{message}</span>
            <button
              onClick={() => dismiss(id)}
              aria-label="Dismiss"
              className="-mr-1 shrink-0 rounded p-1 text-muted hover:bg-fg/10"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
