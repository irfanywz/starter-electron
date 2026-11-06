import { app, Menu, session, shell, type MenuItemConstructorOptions } from 'electron'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { debug, is } from './utils'

const appFileUrl = pathToFileURL(join(__dirname, '../renderer/index.html')).href

const isHttp = (url: string): boolean => /^https?:\/\//i.test(url)

/** URL milik app sendiri: dev server (dev) atau file index.html (production) */
function isAppUrl(url: string): boolean {
  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && devUrl) return url.startsWith(devUrl)
  return url.startsWith(appFileUrl)
}

// Permission yang boleh. Semua selain ini otomatis ditolak (kamera, mic, lokasi, dll).
const allowedPermissions = new Set(['clipboard-sanitized-write'])

function setupMenu(): void {
  if (process.platform === 'darwin') {
    // macOS butuh menu buat Cmd+C/V/Q
    const template: MenuItemConstructorOptions[] = [
      { role: 'appMenu' },
      { role: 'editMenu' },
      { role: 'windowMenu' }
    ]
    if (debug) template.splice(2, 0, { role: 'viewMenu' })
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else if (!debug) {
    // Build normal: buang menu default, jadi Ctrl+R (reload) dan Ctrl+Shift+I (DevTools) mati
    Menu.setApplicationMenu(null)
  }
}

/** Panggil sekali di awal (sebelum window dibuat). */
export function setupSecurity(): void {
  // Berlaku untuk SEMUA webContents yang dibuat nanti
  app.on('web-contents-created', (_e, contents) => {
    // Navigasi keluar dari app diblok; link http(s) dibuka di browser default
    contents.on('will-navigate', (event, url) => {
      if (isAppUrl(url)) return
      event.preventDefault()
      if (isHttp(url)) shell.openExternal(url)
    })
    contents.on('will-attach-webview', (event) => event.preventDefault())
    contents.setWindowOpenHandler(({ url }) => {
      if (isHttp(url)) shell.openExternal(url)
      return { action: 'deny' }
    })
  })

  app.whenReady().then(() => {
    const { defaultSession } = session
    defaultSession.setPermissionRequestHandler((_wc, permission, callback) =>
      callback(allowedPermissions.has(permission))
    )
    defaultSession.setPermissionCheckHandler((_wc, permission) => allowedPermissions.has(permission))
    setupMenu()
  })
}
