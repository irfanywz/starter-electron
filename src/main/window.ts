import { BrowserWindow, nativeTheme } from 'electron'
import { join } from 'node:path'
import { appIcon } from './assets'
import { getSettings } from './settings'
import { debug, is } from './utils'
import { getInitialBounds, trackWindowState } from './windowState'

let mainWindow: BrowserWindow | null = null
let quitting = false

/** Dipanggil saat app beneran mau quit (bukan cuma window ditutup ke tray) */
export function markQuitting(): void {
  quitting = true
}

const backgroundColor = (): string => (nativeTheme.shouldUseDarkColors ? '#0b0b0f' : '#f6f6f9')

export function createMainWindow({ show = true }: { show?: boolean } = {}): BrowserWindow {
  const state = getInitialBounds()

  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 640,
    minHeight: 440,
    show: false,
    frame: false, // custom titlebar (renderer/components/TitleBar.tsx)
    icon: appIcon(),
    backgroundColor: backgroundColor(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: debug // build: mati, kecuali exe dijalankan dengan --debug
    }
  })
  mainWindow = win
  trackWindowState(win)

  win.once('ready-to-show', () => {
    if (state.maximized) win.maximize()
    if (show) win.show()
  })

  // Close: sembunyi ke tray, atau beneran tutup (-> app quit) kalau setting closeToTray mati.
  // Quit lewat menu tray selalu jalan karena `quitting` di-set di before-quit.
  win.on('close', (e) => {
    if (!quitting && getSettings().closeToTray) {
      e.preventDefault()
      win.hide()
    }
  })
  win.on('closed', () => {
    mainWindow = null
  })

  nativeTheme.on('updated', () => {
    if (!win.isDestroyed()) win.setBackgroundColor(backgroundColor())
  })

  // Dev / --debug: F12 buka/tutup DevTools
  if (debug) {
    win.webContents.on('before-input-event', (_e, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') win.webContents.toggleDevTools()
    })
  }

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function showMainWindow(): void {
  const win = mainWindow ?? createMainWindow()
  if (win.isMinimized()) win.restore()
  win.show()
  win.focus()
}

export function toggleMainWindow(): void {
  const win = mainWindow
  if (win && win.isVisible() && !win.isMinimized()) win.hide()
  else showMainWindow()
}
