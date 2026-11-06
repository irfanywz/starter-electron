import { useEffect, useState } from 'react'
import { FolderOpen } from 'lucide-react'
import type { AppInfo } from '@shared/ipc'
import { toast } from '@/lib/toast'

const buttonClass =
  'rounded-lg border border-border bg-surface px-3 py-1.5 text-sm hover:bg-fg/10'

export default function HomePage() {
  const [info, setInfo] = useState<AppInfo | null>(null)

  useEffect(() => {
    window.api.app.getInfo().then(setInfo)
  }, [])

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Starter Minimal</h1>

      {info && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 rounded-lg border border-border bg-surface p-4 text-sm">
          <dt className="text-muted">Version</dt>
          <dd>{info.version}</dd>
          <dt className="text-muted">Mode</dt>
          <dd>{info.packaged ? 'Portable build' : 'Dev'}</dd>
          <dt className="text-muted">Data dir</dt>
          <dd className="select-text break-all">{info.dataDir}</dd>
        </dl>
      )}

      <div className="flex flex-wrap gap-2">
        <button className={buttonClass} onClick={() => window.api.app.openDataDir()}>
          <FolderOpen size={14} className="mr-2 inline" />
          Open data folder
        </button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">Toast demo</h2>
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} onClick={() => toast.info('Just so you know')}>
            Info
          </button>
          <button className={buttonClass} onClick={() => toast.success('Saved successfully')}>
            Success
          </button>
          <button className={buttonClass} onClick={() => toast.warning('Careful with that')}>
            Warning
          </button>
          <button className={buttonClass} onClick={() => toast.error('Something went wrong')}>
            Error
          </button>
        </div>
      </section>

      <p className="text-xs text-muted">
        Close-to-tray and start-minimized can be changed in Settings. Quit from the tray menu.
      </p>
    </div>
  )
}
