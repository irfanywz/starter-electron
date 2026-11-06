/**
 * SINGLE SOURCE OF TRUTH untuk IPC.
 * Nambah fitur baru = 3 langkah:
 *   1. Tambah channel + tipe di sini
 *   2. Tambah handler di src/main/ipc/<fitur>.ts (daftarin di ipc/index.ts)
 *   3. Expose di src/preload/index.ts
 * (Khusus setting user: nggak perlu IPC baru, lihat shared/settings.ts)
 */
import type { Settings } from './settings'

export const IPC = {
  app: {
    getInfo: 'app:get-info',
    openExternal: 'app:open-external',
    openDataDir: 'app:open-data-dir'
  },
  window: {
    minimize: 'window:minimize',
    toggleMaximize: 'window:toggle-maximize',
    close: 'window:close'
  },
  settings: {
    get: 'settings:get',
    set: 'settings:set',
    changed: 'settings:changed'
  },
  log: {
    write: 'log:write'
  }
} as const

export const LOG_LEVELS = ['info', 'warn', 'error'] as const
export type LogLevel = (typeof LOG_LEVELS)[number]

export function isLogLevel(v: unknown): v is LogLevel {
  return typeof v === 'string' && (LOG_LEVELS as readonly string[]).includes(v)
}

/** Pesan error per setting yang gagal diterapkan (mis. shortcut dipakai app lain) */
export type SettingsErrors = Partial<Record<keyof Settings, string>>

export interface SetSettingsResult {
  /** Kondisi setting terbaru setelah patch (yang gagal tetap nilai lama) */
  settings: Settings
  errors: SettingsErrors
}

export interface AppInfo {
  name: string
  version: string
  platform: NodeJS.Platform
  electron: string
  chrome: string
  node: string
  /** Lokasi folder data (settings.json, logs/, dll) */
  dataDir: string
  /** true kalau jalan dari build, false kalau dev */
  packaged: boolean
  /** false di dev dan di Linux */
  autoStartSupported: boolean
}
