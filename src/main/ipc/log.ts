import { ipcMain } from 'electron'
import { IPC, isLogLevel } from '@shared/ipc'
import { log } from '../logger'

const rendererLog = log.scope('renderer')

/** Renderer -> main: tulis log ke file yang sama dengan main process */
export function registerLogIpc(): void {
  ipcMain.on(IPC.log.write, (_e, level: unknown, message: unknown) => {
    if (!isLogLevel(level) || typeof message !== 'string') return
    rendererLog[level](message.slice(0, 5000))
  })
}
