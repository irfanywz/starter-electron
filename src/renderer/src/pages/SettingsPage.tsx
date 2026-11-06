import { useEffect, useState, type ReactNode } from 'react'
import type { Settings } from '@shared/settings'
import Switch from '@/components/Switch'
import ThemeToggle from '@/components/ThemeToggle'
import { toast } from '@/lib/toast'
import { useSettingsStore } from '@/store/useSettingsStore'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted">{title}</h2>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
        {children}
      </div>
    </section>
  )
}

function Row({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm">{title}</div>
        {description && <div className="text-xs text-muted">{description}</div>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings)
  const update = useSettingsStore((s) => s.update)
  const [autoStartSupported, setAutoStartSupported] = useState(false)
  const [shortcut, setShortcut] = useState('')
  const savedShortcut = settings?.shortcut

  useEffect(() => {
    window.api.app.getInfo().then((info) => setAutoStartSupported(info.autoStartSupported))
  }, [])

  // Input shortcut = draft lokal; ikut nilai tersimpan tiap berubah dari luar
  useEffect(() => {
    if (savedShortcut !== undefined) setShortcut(savedShortcut)
  }, [savedShortcut])

  /** Simpan setting; tampilkan toast error kalau gagal, atau toast sukses kalau ada pesannya */
  const change = async (patch: Partial<Settings>, successMessage?: string): Promise<boolean> => {
    const errors = await update(patch)
    const error = Object.values(errors).find((e): e is string => typeof e === 'string')
    if (error) toast.error(error)
    else if (successMessage) toast.success(successMessage)
    return !error
  }

  const saveShortcut = async () => {
    const ok = await change({ shortcut }, shortcut ? 'Shortcut saved' : 'Shortcut disabled')
    if (!ok && savedShortcut !== undefined) setShortcut(savedShortcut)
  }

  if (!settings) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Section title="Appearance">
        <ThemeToggle />
      </Section>

      <Section title="General">
        <Row title="Close button hides to tray" description="Off = closing the window quits the app">
          <Switch
            label="Close button hides to tray"
            checked={settings.closeToTray}
            onChange={(closeToTray) => change({ closeToTray })}
          />
        </Row>

        <Row title="Start minimized" description="Open straight into the tray, no window">
          <Switch
            label="Start minimized"
            checked={settings.startMinimized}
            onChange={(startMinimized) => change({ startMinimized })}
          />
        </Row>

        <Row
          title="Start at login"
          description={
            autoStartSupported
              ? 'Launches with your system'
              : 'Only available in packaged builds on Windows/macOS'
          }
        >
          <Switch
            label="Start at login"
            checked={settings.autoStart}
            disabled={!autoStartSupported}
            onChange={(autoStart) =>
              change({ autoStart }, autoStart ? 'Start at login enabled' : 'Start at login disabled')
            }
          />
        </Row>

        <div className="flex flex-col gap-2">
          <label htmlFor="shortcut" className="text-sm">
            Global shortcut (show / hide)
          </label>
          <div className="flex gap-2">
            <input
              id="shortcut"
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveShortcut()}
              spellCheck={false}
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm outline-none select-text focus:border-accent"
            />
            <button
              onClick={saveShortcut}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-muted">
            Example: CommandOrControl+Shift+Space. Leave empty to disable.
          </p>
        </div>
      </Section>
    </div>
  )
}
