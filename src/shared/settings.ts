/**
 * Definisi setting user, dipakai main + renderer.
 * Nambah setting baru = 3 tempat di file ini (TypeScript maksa semuanya diisi):
 *   1. field di `Settings`
 *   2. nilai default di `defaultSettings`
 *   3. validator di `validators`
 * Kalau perlu efek samping (mis. daftarin ke OS), tambah di src/main/settingsApply.ts.
 * Renderer langsung bisa pakai: useSettingsStore(s => s.settings?.<field>) dan update({ <field>: ... }).
 */

export const DEFAULT_SHORTCUT = 'CommandOrControl+Shift+Space'

export const THEME_MODES = ['system', 'light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export interface Settings {
  theme: ThemeMode
  /** Nyala otomatis saat login OS (cuma build Windows/macOS) */
  autoStart: boolean
  /** Tombol close nyembunyiin app ke tray, bukan quit */
  closeToTray: boolean
  /** Saat app dibuka, langsung ke tray tanpa munculin window */
  startMinimized: boolean
  /** Global shortcut show/hide. Kosong = nonaktif */
  shortcut: string
}

export const defaultSettings: Settings = {
  theme: 'system',
  autoStart: false,
  closeToTray: true,
  startMinimized: false,
  shortcut: DEFAULT_SHORTCUT
}

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

type Validators = { [K in keyof Settings]: (value: unknown) => value is Settings[K] }

export const validators: Validators = {
  theme: (v): v is ThemeMode => typeof v === 'string' && (THEME_MODES as readonly string[]).includes(v),
  autoStart: isBoolean,
  closeToTray: isBoolean,
  startMinimized: isBoolean,
  shortcut: (v): v is string => typeof v === 'string' && v.length <= 64
}
