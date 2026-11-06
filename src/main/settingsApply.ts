import { BrowserWindow, nativeTheme } from 'electron'
import { IPC, type SetSettingsResult, type SettingsErrors } from '@shared/ipc'
import { validators, type Settings } from '@shared/settings'
import { applyAutoStart } from './autostart'
import { log } from './logger'
import { getPublicSettings, getSettings, saveSettings } from './settings'
import { applyShortcut } from './shortcut'

/**
 * Efek samping per setting (opsional). Dipanggil saat nilai berubah dan saat app start.
 * Return string = pesan error -> setting TIDAK disimpan dan pesannya sampai ke renderer.
 * Setting tanpa efek (closeToTray, startMinimized) cukup disimpan; dibaca langsung lewat getSettings().
 */
type Effects = { [K in keyof Settings]?: (value: Settings[K]) => string | void }

const effects: Effects = {
  theme: (value) => {
    // Sekaligus ngatur prefers-color-scheme di renderer, jadi CSS ikut berubah
    nativeTheme.themeSource = value
  },
  autoStart: (value) => {
    applyAutoStart(value)
  },
  shortcut: (value) => applyShortcut(value).error
}

function runEffect(key: keyof Settings, value: unknown): string | void {
  return (effects[key] as ((v: unknown) => string | void) | undefined)?.(value)
}

type Listener = (settings: Settings) => void
const listeners = new Set<Listener>()

/** Dengerin perubahan setting dari main process (dipakai tray). Return fungsi unsubscribe. */
export function onSettingsChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function broadcast(): void {
  const settings = getPublicSettings()
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(IPC.settings.changed, settings)
  }
  listeners.forEach((fn) => fn(settings))
}

/** Terapkan semua setting tersimpan. Dipanggil sekali saat app ready, sebelum window dibuat. */
export function applyAllSettings(): void {
  const stored = getSettings()
  for (const key of Object.keys(effects) as (keyof Settings)[]) {
    const error = runEffect(key, stored[key])
    if (error) log.warn(`Failed to apply setting "${key}": ${error}`)
  }
}

/**
 * Satu-satunya pintu buat ubah setting (dari renderer lewat IPC, atau dari main, mis. tray).
 * Tiap key divalidasi, efeknya dijalankan, baru disimpan. Key yang gagal dilaporin di `errors`.
 */
export function setSettings(patch: unknown): SetSettingsResult {
  const errors: SettingsErrors = {}
  const accepted: Record<string, unknown> = {}

  if (patch && typeof patch === 'object') {
    for (const key of Object.keys(validators) as (keyof Settings)[]) {
      if (!(key in patch)) continue
      const value = (patch as Record<string, unknown>)[key]

      if (!validators[key](value)) {
        errors[key] = 'Invalid value'
        continue
      }
      if (getSettings()[key] === value) continue

      const error = runEffect(key, value)
      if (error) errors[key] = error
      else accepted[key] = value
    }
  }

  if (Object.keys(accepted).length > 0) {
    saveSettings(accepted as Partial<Settings>)
    broadcast()
  }
  return { settings: getPublicSettings(), errors }
}
