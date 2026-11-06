import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { IPC, type AppInfo, type LogLevel, type SetSettingsResult } from '@shared/ipc'
import type { Settings } from '@shared/settings'

const writeLog = (level: LogLevel, message: string): void =>
  ipcRenderer.send(IPC.log.write, level, message)

const api = {
  app: {
    getInfo: (): Promise<AppInfo> => ipcRenderer.invoke(IPC.app.getInfo),
    openExternal: (url: string): Promise<void> => ipcRenderer.invoke(IPC.app.openExternal, url),
    openDataDir: (): Promise<string> => ipcRenderer.invoke(IPC.app.openDataDir)
  },
  window: {
    minimize: (): Promise<void> => ipcRenderer.invoke(IPC.window.minimize),
    toggleMaximize: (): Promise<void> => ipcRenderer.invoke(IPC.window.toggleMaximize),
    close: (): Promise<void> => ipcRenderer.invoke(IPC.window.close)
  },
  settings: {
    get: (): Promise<Settings> => ipcRenderer.invoke(IPC.settings.get),
    set: (patch: Partial<Settings>): Promise<SetSettingsResult> =>
      ipcRenderer.invoke(IPC.settings.set, patch),
    /** Return fungsi unsubscribe */
    onChange: (cb: (settings: Settings) => void): (() => void) => {
      const handler = (_e: IpcRendererEvent, settings: Settings): void => cb(settings)
      ipcRenderer.on(IPC.settings.changed, handler)
      return () => {
        ipcRenderer.removeListener(IPC.settings.changed, handler)
      }
    }
  },
  log: {
    info: (message: string): void => writeLog('info', message),
    warn: (message: string): void => writeLog('warn', message),
    error: (message: string): void => writeLog('error', message)
  },
  platform: process.platform
}

export type Api = typeof api

contextBridge.exposeInMainWorld('api', api)
