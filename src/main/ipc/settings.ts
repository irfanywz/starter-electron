import { ipcMain } from 'electron'
import { IPC } from '@shared/ipc'
import { getPublicSettings } from '../settings'
import { setSettings } from '../settingsApply'

// Generik: nambah setting baru nggak perlu ngubah file ini (lihat shared/settings.ts)
export function registerSettingsIpc(): void {
  ipcMain.handle(IPC.settings.get, () => getPublicSettings())
  ipcMain.handle(IPC.settings.set, (_e, patch: unknown) => setSettings(patch))
}
