import { app } from 'electron'
// Urutan penting: data path harus diset SEBELUM logger, app ready & single-instance lock
import { setupDataPaths } from './paths'
import { log, setupLogger } from './logger'
import { setupSecurity } from './security'
import { getSettings } from './settings'
import { applyAllSettings } from './settingsApply'
import { registerIpc } from './ipc'
import { createMainWindow, markQuitting, showMainWindow } from './window'
import { createTray } from './tray'
import { releaseShortcuts } from './shortcut'
import { startHidden } from './utils'

const { dataDir, fallback } = setupDataPaths()
setupLogger()
setupSecurity()
app.setAppUserModelId('com.example.starterminimal')

if (fallback) {
  log.warn(`Folder di sebelah exe nggak bisa ditulis, data disimpan di lokasi default OS: ${dataDir}`)
}

if (!app.requestSingleInstanceLock()) {
  log.info('Another instance is already running, quitting')
  app.quit()
} else {
  app.on('second-instance', () => {
    log.info('Second instance launched, focusing existing window')
    showMainWindow()
  })
  app.on('before-quit', markQuitting)
  app.on('will-quit', releaseShortcuts)

  app.whenReady().then(() => {
    log.info(`App start v${app.getVersion()} (${process.platform}), data: ${dataDir}`)

    applyAllSettings() // tema, auto-start, shortcut (harus sebelum window dibuat)
    registerIpc()
    createMainWindow({ show: !(startHidden || getSettings().startMinimized) })
    createTray()

    app.on('activate', showMainWindow) // macOS: klik dock icon
  })

  // closeToTray aktif: window cuma di-hide jadi event ini nggak pernah muncul.
  // closeToTray mati: window beneran ketutup -> app quit (kecuali macOS).
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && !getSettings().closeToTray) app.quit()
  })
}
