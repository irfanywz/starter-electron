import { app } from 'electron'
import log from 'electron-log/main'
import { join } from 'node:path'
import { getDataPaths } from './paths'

export { log }

/**
 * Log ditulis ke <dataDir>/logs/main.log (ikut portable, sejajar exe).
 * Rotasi otomatis: lewat 1 MB jadi main.old.log.
 * Renderer ngirim log lewat IPC (lihat ipc/log.ts), jadi nggak perlu setup tambahan.
 */
export function setupLogger(): void {
  log.transports.file.resolvePathFn = () => join(getDataPaths().dataDir, 'logs', 'main.log')
  log.transports.file.maxSize = 1024 * 1024
  log.transports.console.level = app.isPackaged ? false : 'debug'

  // Tangkap uncaught exception / unhandled rejection di main process
  log.errorHandler.startCatching({ showDialog: false })
}
