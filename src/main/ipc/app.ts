import { app, ipcMain, shell } from 'electron'
import { IPC, type AppInfo } from '@shared/ipc'
import { autoStartSupported } from '../autostart'
import { getDataPaths } from '../paths'

export function registerAppIpc(): void {
  ipcMain.handle(IPC.app.getInfo, (): AppInfo => {
    const { dataDir, packaged } = getDataPaths()
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      dataDir,
      packaged,
      autoStartSupported: autoStartSupported()
    }
  })

  ipcMain.handle(IPC.app.openExternal, async (_e, url: unknown) => {
    if (typeof url === 'string' && /^https?:\/\//.test(url)) {
      await shell.openExternal(url)
    }
  })

  ipcMain.handle(IPC.app.openDataDir, () => shell.openPath(getDataPaths().dataDir))
}
