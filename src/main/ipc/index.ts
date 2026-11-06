import { registerAppIpc } from './app'
import { registerLogIpc } from './log'
import { registerSettingsIpc } from './settings'
import { registerWindowIpc } from './window'

// Daftarin semua handler IPC di sini
export function registerIpc(): void {
  registerAppIpc()
  registerLogIpc()
  registerSettingsIpc()
  registerWindowIpc()
}
