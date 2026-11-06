import { BrowserWindow, screen } from 'electron'
import { getSettings, saveSettings, type WindowState } from './settings'

/** Ukuran/posisi terakhir. Posisi dibuang kalau monitornya udah nggak ada. */
export function getInitialBounds(): WindowState {
  const saved = getSettings().window
  const { x, y, width, height } = saved
  if (x === undefined || y === undefined) return saved

  const stillVisible = screen.getAllDisplays().some(({ workArea: a }) => {
    return x < a.x + a.width && x + width > a.x && y < a.y + a.height && y + height > a.y
  })
  return stillVisible ? saved : { ...saved, x: undefined, y: undefined }
}

/** Simpan posisi/ukuran/maximized tiap berubah (di-debounce). */
export function trackWindowState(win: BrowserWindow): void {
  let timer: NodeJS.Timeout | undefined

  const save = (): void => {
    if (win.isDestroyed()) return
    // getNormalBounds = ukuran asli walau lagi maximized
    const { x, y, width, height } = win.getNormalBounds()
    saveSettings({ window: { x, y, width, height, maximized: win.isMaximized() } })
  }
  const saveSoon = (): void => {
    clearTimeout(timer)
    timer = setTimeout(save, 400)
  }

  win.on('resize', saveSoon)
  win.on('move', saveSoon)
  win.on('maximize', saveSoon)
  win.on('unmaximize', saveSoon)
  win.on('close', save)
}
