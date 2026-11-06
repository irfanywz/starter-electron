import { Menu, Tray, app, type MenuItemConstructorOptions } from 'electron'
import { trayIcon } from './assets'
import { log } from './logger'
import type { ThemeMode } from '@shared/settings'
import { getSettings } from './settings'
import { onSettingsChange, setSettings } from './settingsApply'
import { showMainWindow, toggleMainWindow } from './window'

// Simpan referensi di module-level biar nggak kena garbage collector
let tray: Tray | null = null

function buildMenu(): Menu {
  const { theme } = getSettings()

  const themeItem = (label: string, value: ThemeMode): MenuItemConstructorOptions => ({
    label,
    type: 'radio',
    checked: theme === value,
    click: () => setSettings({ theme: value })
  })

  return Menu.buildFromTemplate([
    { label: 'Show / Hide', click: toggleMainWindow },
    {
      label: 'Theme',
      submenu: [themeItem('System', 'system'), themeItem('Light', 'light'), themeItem('Dark', 'dark')]
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
}

export function createTray(): void {
  const icon = trayIcon()
  if (icon.isEmpty()) log.warn('Tray icon kosong, cek resources/tray.png')
  tray = new Tray(icon)
  tray.setToolTip(app.getName())
  tray.setContextMenu(buildMenu())

  tray.on('click', toggleMainWindow) // Windows / macOS
  tray.on('double-click', showMainWindow)

  // Menu radio ikut berubah kalau tema diganti dari UI
  onSettingsChange(() => tray?.setContextMenu(buildMenu()))
}
