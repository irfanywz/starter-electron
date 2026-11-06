import { Minus, Square, X } from 'lucide-react'
import logo from '@/assets/logo.png'

export default function TitleBar() {
  const isMac = window.api.platform === 'darwin'

  // Tanpa padding horizontal di header: padding cuma di sisi kiri (logo), jadi tombol kontrol mentok ke tepi kanan
  return (
    <header className="drag flex h-9 shrink-0 items-center justify-between border-b border-border bg-surface">
      <div className="flex items-center gap-2 pl-3">
        <img src={logo} alt="" draggable={false} className="h-4 w-4" />
        <span className="text-xs font-medium text-muted">Starter Minimal</span>
      </div>

      {!isMac && (
        <div className="no-drag flex h-full items-center">
          <button
            className="grid h-full w-11 place-items-center text-muted hover:bg-fg/10"
            onClick={() => window.api.window.minimize()}
            aria-label="Minimize"
          >
            <Minus size={14} />
          </button>
          <button
            className="grid h-full w-11 place-items-center text-muted hover:bg-fg/10"
            onClick={() => window.api.window.toggleMaximize()}
            aria-label="Maximize"
          >
            <Square size={12} />
          </button>
          {/* Hide ke tray atau quit: setting closeToTray */}
          <button
            className="grid h-full w-11 place-items-center text-muted hover:bg-red-500 hover:text-white"
            onClick={() => window.api.window.close()}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </header>
  )
}
