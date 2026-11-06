import { app, nativeImage, type NativeImage } from 'electron'
import { join } from 'node:path'

/**
 * Icon dibaca dari folder `resources/` biasa (bukan dari dalam app.asar, karena
 * nativeImage.createFromPath nggak andal baca dari asar).
 *   - Build: electron-builder nyalin `resources/` ke <folder exe>/resources/resources (extraResources)
 *   - Dev  : <project>/resources
 */
const resourcesDir = (): string =>
  app.isPackaged ? join(process.resourcesPath, 'resources') : join(app.getAppPath(), 'resources')

export const appIcon = (): NativeImage => nativeImage.createFromPath(join(resourcesDir(), 'icon.png'))
export const trayIcon = (): NativeImage => nativeImage.createFromPath(join(resourcesDir(), 'tray.png'))
