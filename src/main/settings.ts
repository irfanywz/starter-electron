import { app } from 'electron'
import { dirname, join } from 'node:path'
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { defaultSettings, validators, type Settings } from '@shared/settings'

export interface WindowState {
  width: number
  height: number
  x?: number
  y?: number
  maximized: boolean
}

/** Isi settings.json: setting user + state internal (window) yang nggak diexpose ke renderer */
export type StoredSettings = Settings & { window: WindowState }

const defaultWindow: WindowState = { width: 900, height: 620, maximized: false }

const settingKeys = Object.keys(defaultSettings) as (keyof Settings)[]

let cache: StoredSettings | null = null

const filePath = (): string => join(app.getPath('userData'), 'settings.json')

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function sanitizeWindow(v: unknown): WindowState {
  const w = (v && typeof v === 'object' ? v : {}) as Partial<WindowState>
  return {
    width: isNum(w.width) && w.width >= 300 ? w.width : defaultWindow.width,
    height: isNum(w.height) && w.height >= 200 ? w.height : defaultWindow.height,
    x: isNum(w.x) ? w.x : undefined,
    y: isNum(w.y) ? w.y : undefined,
    maximized: w.maximized === true
  }
}

function load(): StoredSettings {
  let raw: Record<string, unknown> = {}
  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath(), 'utf8'))
    if (parsed && typeof parsed === 'object') raw = parsed as Record<string, unknown>
  } catch {
    // File belum ada / korup: pakai default
  }

  // Tiap field divalidasi sendiri-sendiri; yang invalid / hilang jatuh ke default
  const settings = { ...defaultSettings } as Record<keyof Settings, unknown>
  for (const key of settingKeys) {
    if (validators[key](raw[key])) settings[key] = raw[key]
  }
  return { ...(settings as unknown as Settings), window: sanitizeWindow(raw.window) }
}

export function getSettings(): StoredSettings {
  return (cache ??= load())
}

/** Versi yang boleh dilihat renderer (tanpa state internal) */
export function getPublicSettings(): Settings {
  const stored = getSettings()
  const out = { ...defaultSettings } as Record<keyof Settings, unknown>
  for (const key of settingKeys) out[key] = stored[key]
  return out as unknown as Settings
}

/** Simpan ke disk. Validasi + efek samping ada di settingsApply.ts (pakai itu dari luar). */
export function saveSettings(patch: Partial<StoredSettings>): StoredSettings {
  cache = { ...getSettings(), ...patch }
  const path = filePath()
  mkdirSync(dirname(path), { recursive: true })
  // Tulis ke file temp dulu baru rename, biar nggak korup kalau app mati di tengah
  const tmp = `${path}.tmp`
  writeFileSync(tmp, JSON.stringify(cache, null, 2))
  renameSync(tmp, path)
  return cache
}
