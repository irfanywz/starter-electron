import { BrowserWindow, ipcMain } from 'electron'
import { IPC } from '@shared/ipc'

export function registerWindowIpc(): void {
  ipcMain.handle(IPC.window.minimize, (e) => {
    BrowserWindow.fromWebContents(e.sender)?.minimize()
  })

  ipcMain.handle(IPC.window.toggleMaximize, (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  })

  // Hide ke tray atau quit, tergantung setting closeToTray (lihat window.ts)
  ipcMain.handle(IPC.window.close, (e) => {
    BrowserWindow.fromWebContents(e.sender)?.close()
  })
}
