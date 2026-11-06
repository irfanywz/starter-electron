import { globalShortcut } from 'electron'
import { toggleMainWindow } from './window'

let current: string | null = null

export interface ApplyResult {
  ok: boolean
  error?: string
}

/**
 * Pasang global shortcut buat show/hide window. String kosong = nonaktifin.
 * Kalau gagal, shortcut lama dipulihin.
 * Format: https://www.electronjs.org/docs/latest/api/accelerator
 */
export function applyShortcut(accelerator: string): ApplyResult {
  const previous = current
  if (previous) globalShortcut.unregister(previous)

  if (!accelerator) {
    current = null
    return { ok: true }
  }

  let registered = false
  let error = 'Shortcut is already used by another app'
  try {
    registered = globalShortcut.register(accelerator, toggleMainWindow)
  } catch {
    error = 'Invalid shortcut format'
  }

  if (registered) {
    current = accelerator
    return { ok: true }
  }

  // Gagal: balikin yang lama
  if (previous) globalShortcut.register(previous, toggleMainWindow)
  current = previous
  return { ok: false, error }
}

export function releaseShortcuts(): void {
  globalShortcut.unregisterAll()
  current = null
}
